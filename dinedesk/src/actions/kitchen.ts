'use server';

import { connectDB } from '@/lib/mongodb';
import { Order } from '@/lib/models';
import { revalidatePath } from 'next/cache';

export type KitchenOrderItem = {
  itemName: string;
  itemPrice: number;
  quantity: number;
  subtotal: number;
};

export type KitchenOrder = {
  id: string;
  displayId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  status: 'PENDING' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';
  total: number;
  gst: number;
  grandTotal: number;
  paymentMethod: string;
  paymentStatus: string;
  orderType: 'DINE_IN' | 'TAKEAWAY';
  tableNumber?: string;
  specialNote?: string;
  items: KitchenOrderItem[];
  createdAt: string;
  updatedAt: string;
};

export async function getKitchenOrders(): Promise<KitchenOrder[]> {
  try {
    await connectDB();
    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .lean();

    return orders.map((o: any) => ({
      id: o._id.toString(),
      displayId: `ORD-${o._id.toString().slice(-6).toUpperCase()}`,
      customerName: o.customerName || 'Guest Customer',
      customerEmail: o.customerEmail || '',
      customerPhone: o.customerPhone || '',
      status: (o.status || 'PENDING') as KitchenOrder['status'],
      total: o.total || 0,
      gst: o.gst || 0,
      grandTotal: o.grandTotal || 0,
      paymentMethod: o.paymentMethod || 'UPI',
      paymentStatus: o.paymentStatus || 'PENDING',
      orderType: (o.orderType || 'DINE_IN') as KitchenOrder['orderType'],
      tableNumber: o.tableNumber || '',
      specialNote: o.specialNote || '',
      items: (o.items || []).map((it: any) => ({
        itemName: it.itemName || 'Unnamed Item',
        itemPrice: it.itemPrice || 0,
        quantity: it.quantity || 1,
        subtotal: it.subtotal || (it.itemPrice || 0) * (it.quantity || 1) || 0,
      })),
      createdAt: o.createdAt ? new Date(o.createdAt).toISOString() : new Date().toISOString(),
      updatedAt: o.updatedAt ? new Date(o.updatedAt).toISOString() : new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Failed to fetch kitchen orders:', error);
    return [];
  }
}

export async function updateKitchenOrderStatus(
  orderId: string,
  newStatus: 'PENDING' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED'
) {
  try {
    await connectDB();
    const result = await Order.findByIdAndUpdate(
      orderId,
      { $set: { status: newStatus } },
      { new: true }
    );
    revalidatePath('/kitchen');
    return { success: true, status: result?.status };
  } catch (error) {
    console.error('Failed to update order status:', error);
    return { success: false, error: 'Failed to update order status' };
  }
}
