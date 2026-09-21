import crypto from 'node:crypto';
import { NextResponse } from 'next/server';
import { getCashfreeWebhookSecret } from '@/lib/cashfree';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-webhook-signature') || '';
    const timestamp = request.headers.get('x-webhook-timestamp') || '';
    const expected = crypto.createHmac('sha256', getCashfreeWebhookSecret()).update(timestamp + rawBody).digest('base64');
    if (expected.length !== signature.length || !crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))) return NextResponse.json({ error: 'Invalid signature.' }, { status: 400 });
    const event = JSON.parse(rawBody) as { type?: string; data?: { order?: { order_id?: string; order_status?: string }; payment?: { cf_payment_id?: number; payment_status?: string; payment_message?: string } } };
    const orderId = event.data?.order?.order_id;
    const payment = event.data?.payment;
    if (!orderId) return NextResponse.json({ received: true });
    const paid = event.type === 'PAYMENT_SUCCESS_WEBHOOK' || payment?.payment_status === 'SUCCESS';
    const failed = event.type === 'PAYMENT_FAILED_WEBHOOK' || payment?.payment_status === 'FAILED';
    if (paid || failed) await prisma.order.updateMany({ where: { cashfreeOrderId: orderId, paymentStatus: 'PENDING' }, data: { paymentStatus: paid ? 'PAID' : 'FAILED', cashfreePaymentId: payment?.cf_payment_id ? String(payment.cf_payment_id) : null, paymentError: failed ? payment?.payment_message || 'Payment failed' : null } });
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Cashfree webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed.' }, { status: 500 });
  }
}