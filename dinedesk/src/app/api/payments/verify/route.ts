import { NextResponse } from 'next/server';
import { Types } from 'mongoose';
import { getSession } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { Order } from '@/lib/models';

export async function POST(request: Request) {
  try {
    await connectDB();

    const session = await getSession();
    const userId = (session?.user as { id?: string } | undefined)?.id;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Validate userId format
    let userObjectId: Types.ObjectId;
    try {
      userObjectId = new Types.ObjectId(userId);
    } catch {
      console.error('Invalid userId format:', userId);
      return NextResponse.json({ error: 'Invalid session.' }, { status: 401 });
    }

    const { orderId } = await request.json();
    if (typeof orderId !== 'string' || orderId.length === 0) {
      return NextResponse.json({ error: 'Invalid payment verification data.' }, { status: 400 });
    }

    // Validate orderId format
    let orderObjectId: Types.ObjectId;
    try {
      orderObjectId = new Types.ObjectId(orderId);
    } catch {
      return NextResponse.json({ error: 'Invalid order ID.' }, { status: 400 });
    }

    const order = await Order.findOne({
      _id: orderObjectId,
      userId: userObjectId,
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
    }

    // For demo, auto-approve payment
    if (order.paymentStatus === 'PAID' || order.paymentStatus === 'PENDING') {
      await Order.findByIdAndUpdate(orderObjectId, {
        paymentStatus: 'PAID',
        status: 'PREPARING',
      });
      return NextResponse.json({ success: true, status: 'PAID' });
    }

    return NextResponse.json({ success: false, status: order.paymentStatus }, { status: 402 });
  } catch (error) {
    console.error('Verify payment error:', error);
    return NextResponse.json({ error: 'Unable to verify payment.' }, { status: 500 });
  }
}
