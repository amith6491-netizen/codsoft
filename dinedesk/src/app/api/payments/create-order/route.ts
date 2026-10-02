import { NextResponse } from 'next/server';
import { Types } from 'mongoose';
import { getSession } from '@/lib/auth';
import { menuCatalog } from '@/lib/menu-catalog';
import { connectDB } from '@/lib/mongodb';
import { Order } from '@/lib/models';

const PAYMENT_METHODS = new Set(['UPI', 'CARD', 'NETBANKING', 'WALLET', 'CASH']);
type RequestedItem = { id: number; quantity: number };

export async function POST(request: Request) {
  try {
    await connectDB();

    const session = await getSession();
    const user = session?.user as { id?: string; email?: string; name?: string } | undefined;
    if (!user?.id || !user.email) {
      return NextResponse.json({ error: 'Please log in before checkout.' }, { status: 401 });
    }

    // Validate and convert userId to ObjectId
    let userId: Types.ObjectId;
    try {
      userId = new Types.ObjectId(user.id);
    } catch {
      console.error('Invalid userId format:', user.id);
      return NextResponse.json({ error: 'Invalid session. Please log in again.' }, { status: 401 });
    }

    const body = await request.json();
    const paymentMethod = typeof body.paymentMethod === 'string' ? body.paymentMethod : 'UPI';
    const items = Array.isArray(body.items) ? body.items : [];
    
    if (!PAYMENT_METHODS.has(paymentMethod) || items.length === 0 || items.length > 40) {
      return NextResponse.json({ error: 'Invalid checkout details.' }, { status: 400 });
    }

    const requestedItems: RequestedItem[] = items.map((item: { id?: unknown; quantity?: unknown }) => ({
      id: Number(item.id),
      quantity: Number(item.quantity),
    }));

    if (requestedItems.some((item) => !Number.isInteger(item.id) || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 20)) {
      return NextResponse.json({ error: 'Invalid item quantity.' }, { status: 400 });
    }

    const orderItems = requestedItems.map((requested) => {
      const catalogItem = menuCatalog.find((item) => item.id === requested.id);
      if (!catalogItem) throw new Error('Invalid menu item');
      return {
        itemName: catalogItem.name,
        itemPrice: catalogItem.price,
        quantity: requested.quantity,
        subtotal: catalogItem.price * requested.quantity,
      };
    });

    const total = orderItems.reduce((sum, item) => sum + item.subtotal, 0);
    // For Cash on Delivery, skip payment but still create order
    const paymentStatus = paymentMethod === 'CASH' ? 'PENDING' : 'PAID';
    const gst = Math.round(total * 0.18);
    const grandTotal = total + gst;

    // Create order in MongoDB
    const order = await Order.create({
      userId,
      customerName: user.name,
      customerEmail: user.email,
      total,
      gst,
      grandTotal,
      paymentMethod: paymentMethod,
      paymentStatus: paymentStatus,
      items: orderItems,
    });

    // For Cash on Delivery, return immediately without waiting for payment
    if (paymentMethod === 'CASH') {
      return NextResponse.json({
        orderId: order._id.toString(),
        paymentSessionId: `cash_${order._id}_${Date.now()}`,
        success: true,
        message: 'Order placed successfully. Payment due at delivery.',
      });
    }

    // For UPI, generate demo payment session ID
    const paymentSessionId = `demo_${order._id}_${Date.now()}`;

    return NextResponse.json({
      orderId: order._id.toString(),
      paymentSessionId,
      success: true,
      message: 'Order created successfully.',
    });
  } catch (error) {
    console.error('Create payment order error:', error);
    return NextResponse.json(
      { error: 'Unable to start payment. Please try again.' },
      { status: 500 }
    );
  }
}
