import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { Order } from '@/lib/models';
import { Check, Package, Clock, MapPin } from 'lucide-react';
import { Types } from 'mongoose';

export default async function OrderConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  await connectDB();

  const session = await getSession();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  const { id } = await params;

  if (!userId) notFound();

  let order = null;
  try {
    const userObjectId = new Types.ObjectId(userId);
    const orderObjectId = new Types.ObjectId(id);
    order = await Order.findOne({
      _id: orderObjectId,
      userId: userObjectId,
    });
  } catch (error) {
    console.error('Order fetch error:', error);
  }

  if (!order) notFound();

  const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400',
    PREPARING: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400',
    READY: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400',
    COMPLETED: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400',
    CANCELLED: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400',
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      {/* Order Confirmation Header */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-3xl p-8 text-center mb-8">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <h1 className="text-3xl font-outfit font-bold mb-2">Order Confirmed!</h1>
        <p className="text-green-700 dark:text-green-400">Thank you for your order</p>
      </div>

      {/* Order Details Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Order ID */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <p className="text-foreground/60 text-sm mb-1">Order ID</p>
          <p className="font-bold text-lg font-mono">{order._id.toString().slice(0, 8).toUpperCase()}...</p>
        </div>

        {/* Order Status */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <p className="text-foreground/60 text-sm mb-1">Status</p>
          <div className={`inline-block px-3 py-1 rounded-lg text-sm font-semibold ${statusColors[order.status] || statusColors.PENDING}`}>
            {order.status}
          </div>
        </div>

        {/* Order Time */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <p className="text-foreground/60 text-sm mb-1">Order Time</p>
          <p className="font-bold">{new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
        </div>
      </div>

      {/* Order Type & Delivery Info */}
      {order.orderType && (
        <div className="bg-card border border-border rounded-3xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <Package className="w-5 h-5 text-primary mt-1 shrink-0" />
              <div>
                <p className="text-foreground/60 text-sm">Delivery Type</p>
                <p className="font-bold text-lg">
                  {order.orderType === 'DINE_IN' ? '🍽️ Dine In' : '📦 Takeaway'}
                </p>
              </div>
            </div>
            {order.tableNumber && (
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-1 shrink-0" />
                <div>
                  <p className="text-foreground/60 text-sm">Table Number</p>
                  <p className="font-bold text-lg">Table {order.tableNumber}</p>
                </div>
              </div>
            )}
            {order.specialNote && (
              <div className="flex items-start gap-3 md:col-span-2">
                <Clock className="w-5 h-5 text-primary mt-1 shrink-0" />
                <div>
                  <p className="text-foreground/60 text-sm">Special Notes</p>
                  <p className="font-semibold">{order.specialNote}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Order Summary */}
      <div className="bg-card border border-border rounded-3xl p-6 md:p-8 mb-8">
        <h2 className="text-2xl font-outfit font-bold mb-6">Order Summary</h2>
        
        {/* Items */}
        <div className="space-y-4 mb-6 border-b border-border pb-6">
          {order.items.map((item: any, idx: number) => (
            <div key={idx} className="flex justify-between items-center">
              <div>
                <p className="font-semibold">{item.itemName}</p>
                <p className="text-foreground/60 text-sm">Qty: {item.quantity}</p>
              </div>
              <p className="font-bold">₹{item.subtotal.toLocaleString('en-IN')}</p>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="space-y-3">
          <div className="flex justify-between text-foreground/70">
            <span>Subtotal</span>
            <span>₹{(order.grandTotal - order.gst).toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-foreground/70">
            <span>GST (18%)</span>
            <span>₹{order.gst.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-t border-border">
            <span className="font-bold text-lg">Grand Total</span>
            <span className="font-bold text-2xl text-primary">₹{order.grandTotal.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Payment Info */}
      <div className="bg-card border border-border rounded-3xl p-6 mb-8">
        <h2 className="text-xl font-outfit font-bold mb-4">Payment Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-foreground/60 text-sm mb-1">Payment Method</p>
            <p className="font-semibold">{order.paymentMethod}</p>
          </div>
          <div>
            <p className="text-foreground/60 text-sm mb-1">Payment Status</p>
            <span className={`inline-block px-3 py-1 rounded-lg text-sm font-semibold ${statusColors[order.paymentStatus] || statusColors.PENDING}`}>
              {order.paymentStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link 
          href="/menu" 
          className="flex-1 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors text-center"
        >
          Continue Ordering
        </Link>
      </div>
    </div>
  );
}
