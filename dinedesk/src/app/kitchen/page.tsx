import { Clock, CheckCircle2, ChevronRight, Utensils } from "lucide-react";

export default function KitchenDashboard() {
  const activeOrders = [
    {
      id: "ORD-8902",
      table: "Table 4",
      time: "10 mins ago",
      status: "Preparing",
      items: [
        { name: "The Signature Double", quantity: 2, notes: "No onions on one" },
        { name: "Truffle Mushroom Pasta", quantity: 1 }
      ]
    },
    {
      id: "ORD-8903",
      table: "Takeaway",
      time: "5 mins ago",
      status: "Pending",
      items: [
        { name: "The Signature Double", quantity: 1 }
      ]
    },
    {
      id: "ORD-8901",
      table: "Table 12",
      time: "25 mins ago",
      status: "Ready",
      items: [
        { name: "Truffle Mushroom Pasta", quantity: 3 }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Pending': return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800/50';
      case 'Preparing': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800/50';
      case 'Ready': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800/50';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-outfit font-bold mb-1 flex items-center gap-3">
            <Utensils className="w-8 h-8 text-primary" /> Kitchen Dashboard
          </h1>
          <p className="text-foreground/60">Manage incoming orders and preparation status.</p>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-card border border-border px-4 py-2 rounded-xl text-center shadow-sm">
            <div className="text-2xl font-bold text-primary">12</div>
            <div className="text-xs text-foreground/60 font-medium uppercase tracking-wider">Active</div>
          </div>
          <div className="bg-card border border-border px-4 py-2 rounded-xl text-center shadow-sm">
            <div className="text-2xl font-bold text-green-500">45</div>
            <div className="text-xs text-foreground/60 font-medium uppercase tracking-wider">Completed</div>
          </div>
        </div>
      </div>

      {/* Orders Kanban/List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Pending Column */}
        <div className="flex flex-col gap-4">
          <h2 className="font-outfit font-semibold text-lg flex items-center justify-between pb-2 border-b border-border">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500"></span> Pending
            </span>
            <span className="bg-background text-xs px-2 py-1 rounded-md border border-border">1</span>
          </h2>
          
          {activeOrders.filter(o => o.status === 'Pending').map(order => (
            <div key={order.id} className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold font-outfit text-lg">{order.id}</h3>
                  <span className="text-primary font-medium text-sm">{order.table}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-foreground/60 font-medium bg-background px-2 py-1 rounded-md border border-border">
                  <Clock className="w-3 h-3" /> {order.time}
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex gap-3 text-sm">
                    <span className="font-bold w-6 h-6 rounded-md bg-background border border-border flex items-center justify-center shrink-0">
                      {item.quantity}
                    </span>
                    <div>
                      <div className="font-medium">{item.name}</div>
                      {item.notes && <div className="text-amber-600 dark:text-amber-400 text-xs mt-0.5">Note: {item.notes}</div>}
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="w-full py-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400 font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors flex justify-center items-center gap-2">
                Start Preparing <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Preparing Column */}
        <div className="flex flex-col gap-4">
          <h2 className="font-outfit font-semibold text-lg flex items-center justify-between pb-2 border-b border-border">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500"></span> Preparing
            </span>
            <span className="bg-background text-xs px-2 py-1 rounded-md border border-border">1</span>
          </h2>
          
          {activeOrders.filter(o => o.status === 'Preparing').map(order => (
            <div key={order.id} className="bg-card border-2 border-blue-500/30 rounded-2xl p-5 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold font-outfit text-lg">{order.id}</h3>
                  <span className="text-primary font-medium text-sm">{order.table}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-md border border-blue-200 dark:border-blue-800">
                  <Clock className="w-3 h-3" /> {order.time}
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex gap-3 text-sm">
                    <span className="font-bold w-6 h-6 rounded-md bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 flex items-center justify-center shrink-0">
                      {item.quantity}
                    </span>
                    <div>
                      <div className="font-medium">{item.name}</div>
                      {item.notes && <div className="text-amber-600 dark:text-amber-400 text-xs mt-0.5">Note: {item.notes}</div>}
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="w-full py-2.5 rounded-xl bg-green-50 text-green-600 border border-green-200 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400 font-semibold hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors flex justify-center items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Mark as Ready
              </button>
            </div>
          ))}
        </div>

        {/* Ready Column */}
        <div className="flex flex-col gap-4">
          <h2 className="font-outfit font-semibold text-lg flex items-center justify-between pb-2 border-b border-border">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500"></span> Ready for Pickup
            </span>
            <span className="bg-background text-xs px-2 py-1 rounded-md border border-border">1</span>
          </h2>
          
          {activeOrders.filter(o => o.status === 'Ready').map(order => (
            <div key={order.id} className="bg-card border border-green-200 dark:border-green-800/50 rounded-2xl p-5 shadow-sm opacity-80">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold font-outfit text-lg line-through text-foreground/50">{order.id}</h3>
                  <span className="text-green-600 font-medium text-sm">{order.table}</span>
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex gap-3 text-sm text-foreground/60">
                    <span className="font-bold w-6 h-6 rounded-md bg-background border border-border flex items-center justify-center shrink-0">
                      {item.quantity}
                    </span>
                    <div>
                      <div className="font-medium">{item.name}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="w-full py-2 rounded-xl bg-background border border-border text-foreground/60 text-sm font-semibold hover:bg-card transition-colors flex justify-center items-center gap-2">
                Clear Order
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
