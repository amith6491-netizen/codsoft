import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const session = await getSession();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  const { orderId, status, error } = await request.json();
  if (!['FAILED', 'CANCELLED'].includes(status)) return NextResponse.json({ error: 'Invalid payment status.' }, { status: 400 });
  await prisma.order.updateMany({ where: { id: orderId, userId, paymentStatus: 'PENDING' }, data: { paymentStatus: status, paymentError: typeof error === 'string' ? error.slice(0, 500) : null } });
  return NextResponse.json({ success: true });
}