'use client';

import { useState, useEffect, useTransition, useMemo } from 'react';
import {
  Utensils,
  Clock,
  CheckCircle2,
  ChevronRight,
  RefreshCw,
  Search,
  Receipt,
  ChefHat,
  ShoppingBag,
  CheckCheck,
  Check,
  AlertCircle
} from 'lucide-react';
import { KitchenOrder, getKitchenOrders, updateKitchenOrderStatus } from '@/actions/kitchen';

interface KitchenDashboardClientProps {
  initialOrders: KitchenOrder[];
}

function formatTimeAgo(isoString: string) {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 45) return 'Just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDays = Math.floor(diffHr / 24);
  return `${diffDays}d ago`;
}

function formatTimeOfDay(isoString: string) {
  return new Date(isoString).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

function formatINR(amount: number) {
  return `₹${amount.toLocaleString('en-IN')}`;
}

export default function KitchenDashboardClient({
  initialOrders,
}: KitchenDashboardClientProps) {
  const [orders, setOrders] = useState<KitchenOrder[]>(initialOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);

  // Poll for new orders every 15 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const fresh = await getKitchenOrders();
        setOrders(fresh);
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      const fresh = await getKitchenOrders();
      setOrders(fresh);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleStatusChange = async (
    orderId: string,
    newStatus: 'PENDING' | 'PREPARING' | 'READY' | 'COMPLETED'
  ) => {
    setUpdatingId(orderId);
    // Optimistic update
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );

    startTransition(async () => {
      try {
        await updateKitchenOrderStatus(orderId, newStatus);
      } catch (error) {
        console.error('Failed to update order status:', error);
        // Revert on error
        const fresh = await getKitchenOrders();
        setOrders(fresh);
      } finally {
        setUpdatingId(null);
      }
    });
  };

  // Filter orders by search
  const filteredOrders = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return orders;
    return orders.filter(
      (o) =>
        o.displayId.toLowerCase().includes(query) ||
        o.customerName.toLowerCase().includes(query) ||
        (o.tableNumber && o.tableNumber.toLowerCase().includes(query)) ||
        o.items.some((item) => item.itemName.toLowerCase().includes(query))
    );
  }, [orders, searchQuery]);

  // Real live statistics computed strictly from MongoDB orders
  const pendingOrders = filteredOrders.filter((o) => o.status === 'PENDING');
  const preparingOrders = filteredOrders.filter((o) => o.status === 'PREPARING');
  const readyOrders = filteredOrders.filter((o) => o.status === 'READY');
  const completedOrders = filteredOrders.filter((o) => o.status === 'COMPLETED');

  const totalActive = pendingOrders.length + preparingOrders.length;
  const totalReady = readyOrders.length;
  const totalCompleted = completedOrders.length;
  const totalAllOrders = orders.length;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 pb-6 border-b border-border">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-outfit font-bold flex items-center gap-2.5">
                Kitchen Live Dispatch
              </h1>
              <p className="text-foreground/60 text-xs sm:text-sm">
                Real-time active kitchen order preparation and queue manager.
              </p>
            </div>
          </div>
        </div>

        {/* Real Summary Metrics */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-card border border-border text-xs text-foreground/70 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium">Live Sync</span>
          </div>

          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-card hover:bg-foreground/5 border border-border rounded-xl text-xs font-semibold text-foreground transition-all shadow-sm disabled:opacity-50"
            title="Refresh orders now"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 text-primary ${
                isRefreshing ? 'animate-spin' : ''
              }`}
            />
            <span>Refresh</span>
          </button>

          <div className="flex items-center gap-3 bg-card border border-border px-4 py-2 rounded-2xl shadow-sm">
            <div className="text-center pr-3 border-r border-border">
              <div className="text-xl sm:text-2xl font-bold font-outfit text-primary">
                {totalActive}
              </div>
              <div className="text-[10px] font-semibold text-foreground/50 uppercase tracking-wider">
                Active Queue
              </div>
            </div>
            <div className="text-center pr-3 border-r border-border">
              <div className="text-xl sm:text-2xl font-bold font-outfit text-green-500">
                {totalReady}
              </div>
              <div className="text-[10px] font-semibold text-foreground/50 uppercase tracking-wider">
                Ready
              </div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold font-outfit text-foreground/70">
                {totalCompleted}
              </div>
              <div className="text-[10px] font-semibold text-foreground/50 uppercase tracking-wider">
                Completed
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
          <input
            type="text"
            placeholder="Search order ID, table, dish or customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-2 ${
              showCompleted
                ? 'bg-primary/10 border-primary text-primary'
                : 'bg-card border-border text-foreground/70 hover:border-foreground/30'
            }`}
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>{showCompleted ? 'Hide Completed' : `Show Completed (${totalCompleted})`}</span>
          </button>
        </div>
      </div>

      {/* Completed Orders Drawer (if toggled) */}
      {showCompleted && (
        <div className="mb-10 p-5 bg-card border border-border rounded-3xl shadow-sm">
          <h2 className="font-outfit font-bold text-lg mb-4 flex items-center gap-2">
            <CheckCheck className="w-5 h-5 text-emerald-500" /> Completed Orders ({completedOrders.length})
          </h2>
          {completedOrders.length === 0 ? (
            <p className="text-foreground/50 text-sm py-4 text-center">
              No orders have been marked as completed yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {completedOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-background border border-border/80 rounded-2xl p-4 text-xs opacity-85 hover:opacity-100 transition-opacity"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-bold font-mono text-sm">{order.displayId}</span>
                      <p className="text-foreground/60">{order.customerName}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-semibold text-[10px]">
                      Completed
                    </span>
                  </div>
                  <div className="text-foreground/70 text-[11px] mb-2">
                    {order.items.map((i) => `${i.quantity}x ${i.itemName}`).join(', ')}
                  </div>
                  <div className="flex justify-between items-center text-foreground/50 text-[10px] pt-2 border-t border-border/50">
                    <span>{formatTimeOfDay(order.createdAt)}</span>
                    <span className="font-bold text-foreground/80">{formatINR(order.grandTotal)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Kanban 3-Column Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Column 1: Pending */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b-2 border-amber-500/40">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <h2 className="font-outfit font-bold text-base sm:text-lg">
                Pending Orders
              </h2>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 font-bold text-xs">
              {pendingOrders.length}
            </span>
          </div>

          {pendingOrders.length === 0 ? (
            <div className="bg-card border border-border border-dashed rounded-3xl p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-foreground/5 mx-auto mb-3 flex items-center justify-center text-foreground/40">
                <Utensils className="w-6 h-6" />
              </div>
              <p className="font-outfit font-bold text-sm text-foreground/80 mb-1">
                No Pending Orders
              </p>
              <p className="text-foreground/50 text-xs leading-relaxed max-w-xs mx-auto">
                Incoming orders placed by customers will appear here automatically.
              </p>
            </div>
          ) : (
            pendingOrders.map((order) => (
              <div
                key={order.id}
                className="bg-card border border-border hover:border-amber-500/50 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col"
              >
                {/* Order Top Bar */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold font-outfit text-lg tracking-tight">
                      {order.displayId}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-primary font-semibold text-xs">
                        {order.orderType === 'DINE_IN'
                          ? `🍽️ Table ${order.tableNumber || '1'}`
                          : '📦 Takeaway'}
                      </span>
                      <span className="text-foreground/40 text-xs">•</span>
                      <span className="text-foreground/60 text-xs font-medium">
                        {order.customerName}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className="inline-flex items-center gap-1 text-[11px] text-foreground/60 font-medium bg-background px-2.5 py-1 rounded-md border border-border">
                      <Clock className="w-3 h-3 text-amber-500" /> {formatTimeAgo(order.createdAt)}
                    </span>
                    <span className="text-[10px] text-foreground/40 font-mono">
                      {formatTimeOfDay(order.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Special Note (if any) */}
                {order.specialNote && (
                  <div className="mb-3 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs flex items-start gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Note: </span>
                      <span>{order.specialNote}</span>
                    </div>
                  </div>
                )}

                {/* Items List */}
                <div className="space-y-2 mb-5 flex-1 pt-2 border-t border-border/60">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2.5">
                        <span className="font-bold text-xs w-6 h-6 rounded-md bg-background border border-border flex items-center justify-center shrink-0">
                          {item.quantity}
                        </span>
                        <span className="font-medium text-xs sm:text-sm text-foreground/90">
                          {item.itemName}
                        </span>
                      </div>
                      <span className="text-xs text-foreground/50 font-medium">
                        {formatINR(item.subtotal)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer and Action */}
                <div className="pt-3 border-t border-border/60 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-foreground/50 font-semibold block">
                      Total ({order.paymentMethod})
                    </span>
                    <span className="font-bold text-sm text-foreground font-outfit">
                      {formatINR(order.grandTotal)}
                    </span>
                  </div>

                  <button
                    onClick={() => handleStatusChange(order.id, 'PREPARING')}
                    disabled={updatingId === order.id}
                    className="flex-1 py-2 px-3 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300 font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors flex justify-center items-center gap-1.5 text-xs sm:text-sm disabled:opacity-50"
                  >
                    <span>Start Preparing</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Column 2: In Preparation */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b-2 border-blue-500/40">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
              <h2 className="font-outfit font-bold text-base sm:text-lg">
                In Preparation
              </h2>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 font-bold text-xs">
              {preparingOrders.length}
            </span>
          </div>

          {preparingOrders.length === 0 ? (
            <div className="bg-card border border-border border-dashed rounded-3xl p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-foreground/5 mx-auto mb-3 flex items-center justify-center text-foreground/40">
                <ChefHat className="w-6 h-6" />
              </div>
              <p className="font-outfit font-bold text-sm text-foreground/80 mb-1">
                Kitchen Clear
              </p>
              <p className="text-foreground/50 text-xs leading-relaxed max-w-xs mx-auto">
                No orders are currently being cooked. Move pending orders here when work begins.
              </p>
            </div>
          ) : (
            preparingOrders.map((order) => (
              <div
                key={order.id}
                className="bg-card border-2 border-blue-500/40 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col"
              >
                {/* Order Top Bar */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold font-outfit text-lg tracking-tight">
                      {order.displayId}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-blue-600 dark:text-blue-400 font-semibold text-xs">
                        {order.orderType === 'DINE_IN'
                          ? `🍽️ Table ${order.tableNumber || '1'}`
                          : '📦 Takeaway'}
                      </span>
                      <span className="text-foreground/40 text-xs">•</span>
                      <span className="text-foreground/60 text-xs font-medium">
                        {order.customerName}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className="inline-flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-300 font-semibold bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 rounded-md border border-blue-200 dark:border-blue-800">
                      <Clock className="w-3 h-3" /> {formatTimeAgo(order.createdAt)}
                    </span>
                    <span className="text-[10px] text-foreground/40 font-mono">
                      {formatTimeOfDay(order.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Special Note (if any) */}
                {order.specialNote && (
                  <div className="mb-3 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs flex items-start gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Note: </span>
                      <span>{order.specialNote}</span>
                    </div>
                  </div>
                )}

                {/* Items List */}
                <div className="space-y-2 mb-5 flex-1 pt-2 border-t border-border/60">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2.5">
                        <span className="font-bold text-xs w-6 h-6 rounded-md bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-300 flex items-center justify-center shrink-0">
                          {item.quantity}
                        </span>
                        <span className="font-medium text-xs sm:text-sm text-foreground/90">
                          {item.itemName}
                        </span>
                      </div>
                      <span className="text-xs text-foreground/50 font-medium">
                        {formatINR(item.subtotal)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer and Action */}
                <div className="pt-3 border-t border-border/60 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-foreground/50 font-semibold block">
                      Total ({order.paymentMethod})
                    </span>
                    <span className="font-bold text-sm text-foreground font-outfit">
                      {formatINR(order.grandTotal)}
                    </span>
                  </div>

                  <button
                    onClick={() => handleStatusChange(order.id, 'READY')}
                    disabled={updatingId === order.id}
                    className="flex-1 py-2 px-3 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-300 font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors flex justify-center items-center gap-1.5 text-xs sm:text-sm disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Mark as Ready</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Column 3: Ready for Pickup / Serving */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b-2 border-emerald-500/40">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <h2 className="font-outfit font-bold text-base sm:text-lg">
                Ready for Service
              </h2>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
              {readyOrders.length}
            </span>
          </div>

          {readyOrders.length === 0 ? (
            <div className="bg-card border border-border border-dashed rounded-3xl p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-foreground/5 mx-auto mb-3 flex items-center justify-center text-foreground/40">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <p className="font-outfit font-bold text-sm text-foreground/80 mb-1">
                No Orders Waiting
              </p>
              <p className="text-foreground/50 text-xs leading-relaxed max-w-xs mx-auto">
                Orders marked as ready for service or pickup will appear here.
              </p>
            </div>
          ) : (
            readyOrders.map((order) => (
              <div
                key={order.id}
                className="bg-card border-2 border-emerald-500/30 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col"
              >
                {/* Order Top Bar */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold font-outfit text-lg tracking-tight">
                      {order.displayId}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
                        {order.orderType === 'DINE_IN'
                          ? `🍽️ Table ${order.tableNumber || '1'}`
                          : '📦 Takeaway'}
                      </span>
                      <span className="text-foreground/40 text-xs">•</span>
                      <span className="text-foreground/60 text-xs font-medium">
                        {order.customerName}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-300 font-semibold bg-emerald-50 dark:bg-emerald-900/30 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800">
                      <Check className="w-3 h-3" /> Ready
                    </span>
                    <span className="text-[10px] text-foreground/40 font-mono">
                      {formatTimeOfDay(order.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-2 mb-5 flex-1 pt-2 border-t border-border/60">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2.5">
                        <span className="font-bold text-xs w-6 h-6 rounded-md bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-300 flex items-center justify-center shrink-0">
                          {item.quantity}
                        </span>
                        <span className="font-medium text-xs sm:text-sm text-foreground/90">
                          {item.itemName}
                        </span>
                      </div>
                      <span className="text-xs text-foreground/50 font-medium">
                        {formatINR(item.subtotal)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer and Action */}
                <div className="pt-3 border-t border-border/60 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-foreground/50 font-semibold block">
                      Total ({order.paymentMethod})
                    </span>
                    <span className="font-bold text-sm text-foreground font-outfit">
                      {formatINR(order.grandTotal)}
                    </span>
                  </div>

                  <button
                    onClick={() => handleStatusChange(order.id, 'COMPLETED')}
                    disabled={updatingId === order.id}
                    className="flex-1 py-2 px-3 rounded-xl bg-background border border-border text-foreground/80 hover:bg-card hover:text-foreground font-semibold transition-colors flex justify-center items-center gap-1.5 text-xs sm:text-sm disabled:opacity-50"
                  >
                    <CheckCheck className="w-4 h-4 text-emerald-500" />
                    <span>Complete & Clear</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
