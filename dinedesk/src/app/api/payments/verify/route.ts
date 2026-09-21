import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { cashfreeRequest } from '@/lib/cashfree';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    const userId = (session?.user as { id?: string } | undefined)?.id;
    if (!userId) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    const { orderId, cashfreePaymentId } = await request.json();
    if (typeof orderId !== 'string' || orderId.length === 0) {
      return NextResponse.json({ error: 'Invalid payment verification data.' }, { status: 400 });
    }
    const order = await prisma.order.findFirst({ where: { id: orderId, userId, cashfreeOrderId: { not: null } } });
    if (!order) return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
    if (order.paymentStatus === 'PAID') return NextResponse.json({ success: true, status: 'PAID' });
    const cashfreeOrder = await cashfreeRequest<{ order_status: string }>(`/orders/${order.cashfreeOrderId}`);
    const payments = await cashfreeRequest<Array<{ cf_payment_id?: number; payment_status?: string }>>(`/orders/${order.cashfreeOrderId}/payments`);
    const successfulPayment = payments.find((payment) => payment.payment_status === 'SUCCESS');
    if (cashfreeOrder.order_status === 'PAID' && successfulPayment) {
      await prisma.order.update({ where: { id: order.id }, data: { paymentStatus: 'PAID', cashfreePaymentId: String(successfulPayment.cf_payment_id || cashfreePaymentId || ''), paymentError: null } });
      return NextResponse.json({ success: true, status: 'PAID' });
    }
    if (payments.some((payment) => payment.payment_status === 'FAILED')) {
      await prisma.order.update({ where: { id: order.id }, data: { paymentStatus: 'FAILED', paymentError: 'Cashfree payment failed' } });
      return NextResponse.json({ success: false, status: 'FAILED', error: 'Payment failed.' }, { status: 402 });
    }
    return NextResponse.json({ success: false, status: 'PENDING', error: 'Payment is still pending.' }, { status: 202 });
  } catch (error) {
    console.error('Verify payment error:', error);
    return NextResponse.json({ error: 'Unable to verify payment.' }, { status: 500 });
  }
}