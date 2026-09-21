import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { menuCatalog } from '@/lib/menu-catalog';
import { prisma } from '@/lib/prisma';
import { cashfreeRequest, isCashfreeConfigured } from '@/lib/cashfree';

const PAYMENT_METHODS = new Set(['UPI', 'CARD', 'NETBANKING', 'WALLET']);
type RequestedItem = { id: number; quantity: number };

export async function POST(request: Request) {
  try {
    const session = await getSession();
    const user = session?.user as { id?: string; email?: string; name?: string } | undefined;
    if (!user?.id || !user.email) return NextResponse.json({ error: 'Please log in before checkout.' }, { status: 401 });

    const body = await request.json();
    const paymentMethod = typeof body.paymentMethod === 'string' ? body.paymentMethod : 'UPI';
    const items = Array.isArray(body.items) ? body.items : [];
    if (!PAYMENT_METHODS.has(paymentMethod) || items.length === 0 || items.length > 40) {
      return NextResponse.json({ error: 'Invalid checkout details.' }, { status: 400 });
    }

    const requestedItems: RequestedItem[] = items.map((item: { id?: unknown; quantity?: unknown }) => ({
      id: Number(item.id), quantity: Number(item.quantity),
    }));
    if (requestedItems.some((item) => !Number.isInteger(item.id) || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 20)) {
      return NextResponse.json({ error: 'Invalid item quantity.' }, { status: 400 });
    }

    const orderItems = requestedItems.map((requested) => {
      const catalogItem = menuCatalog.find((item) => item.id === requested.id);
      if (!catalogItem) throw new Error('Invalid menu item');
      return { ...catalogItem, quantity: requested.quantity, subtotal: catalogItem.price * requested.quantity };
    });
    const total = orderItems.reduce((sum: number, item) => sum + item.subtotal, 0);
    const gst = Math.round(total * 0.18);
    const grandTotal = total + gst;
    const order = await prisma.order.create({
      data: {
        userId: user.id, customerName: user.name, customerEmail: user.email,
        total, gst, grandTotal, paymentMethod: 'CASHFREE', paymentStatus: 'PENDING',
        items: { create: orderItems.map((item) => ({ itemName: item.name, itemPrice: item.price, quantity: item.quantity, subtotal: item.subtotal })) },
      },
    });
    const cashfreeOrderId = `dinedesk_${order.id}`;
    try {
      const cashfreeOrder = await cashfreeRequest<{ payment_session_id: string }>('/orders', {
        method: 'POST',
        headers: { 'x-idempotency-key': order.id },
        body: JSON.stringify({
          order_id: cashfreeOrderId,
          order_amount: grandTotal,
          order_currency: 'INR',
          customer_details: { customer_id: user.id, customer_name: user.name || user.email, customer_email: user.email, customer_phone: '9999999999' },
          order_meta: { return_url: `${new URL(request.url).origin}/orders/${order.id}?payment=return`, notify_url: `${new URL(request.url).origin}/api/payments/webhook` },
          order_note: 'DineDesk restaurant order',
        }),
      });
      await prisma.order.update({ where: { id: order.id }, data: { cashfreeOrderId, cashfreePaymentSessionId: cashfreeOrder.payment_session_id } });
      return NextResponse.json({ orderId: order.id, cashfreeOrderId, paymentSessionId: cashfreeOrder.payment_session_id });
    } catch (error) {
      await prisma.order.update({ where: { id: order.id }, data: { paymentStatus: 'FAILED', paymentError: 'Cashfree order creation failed' } });
      throw error;
    }
  } catch (error) {
    console.error('Create payment order error:', error);
    if (!isCashfreeConfigured()) {
      return NextResponse.json({ error: 'Cashfree Sandbox is not configured. Add CASHFREE_CLIENT_ID, CASHFREE_CLIENT_SECRET, and CASHFREE_ENVIRONMENT=SANDBOX to dinedesk/.env.local, then restart the server.' }, { status: 503 });
    }
    return NextResponse.json({ error: 'Unable to start payment.' }, { status: 500 });
  }
}