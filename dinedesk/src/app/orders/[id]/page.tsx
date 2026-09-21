import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function OrderConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  const { id } = await params;
  const order = userId ? await prisma.order.findFirst({ where: { id, userId }, include: { items: true } }) : null;
  if (!order) notFound();

  return (
    <div className="container mx-auto px-4 py-20 max-w-2xl">
      <div className="bg-card border border-border rounded-3xl p-8 text-center shadow-sm">
        <p className="text-green-600 font-semibold mb-3">Payment confirmed</p>
        <h1 className="text-3xl font-outfit font-bold mb-3">Your order is confirmed</h1>
        <p className="text-foreground/70 mb-8">Order ID: {order.id}</p>
        <div className="border-y border-border py-5 space-y-3 text-left mb-8">
          {order.items.map((item) => <div key={item.id} className="flex justify-between"><span>{item.itemName} x {item.quantity}</span><span>₹{item.subtotal.toLocaleString('en-IN')}</span></div>)}
          <div className="flex justify-between font-bold pt-3 border-t border-border"><span>Total</span><span>₹{order.grandTotal.toLocaleString('en-IN')}</span></div>
        </div>
        <Link href="/menu" className="inline-block px-8 py-3 bg-primary text-white font-semibold rounded-xl">Continue browsing</Link>
      </div>
    </div>
  );
}