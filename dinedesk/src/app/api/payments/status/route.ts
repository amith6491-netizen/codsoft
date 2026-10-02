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
    if (!userId) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

    const { orderId, status, error } = await request.json();
    if (!['FAILED', 'CANCELLED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid payment status.' }, { status: 400 });
    }

    let orderObjectId: Types.ObjectId;
    let userObjectId: Types.ObjectId;
    try {
      orderObjectId = new Types.ObjectId(orderId);
      userObjectId = new Types.ObjectId(userId);
    } catch {
      return NextResponse.json({ error: 'Invalid order or user ID.' }, { status: 400 });
    }

    await Order.updateMany(
      { _id: orderObjectId, userId: userObjectId, paymentStatus: 'PENDING' },
      {
        paymentStatus: status,
        paymentError: typeof error === 'string' ? error.slice(0, 500) : null,
      }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Update payment status error:', err);
    return NextResponse.json({ error: 'Failed to update payment status.' }, { status: 500 });
  }
}