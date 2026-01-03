import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line 
} from 'recharts';
import { 
  LayoutDashboard, ShoppingBag, Utensils, TrendingUp, Plus, Edit2, Trash2, CheckCircle, Clock 
} from 'lucide-react';
import { Store } from '../services';
import { MenuItem, Category, Order, OrderStatus, SalesData } from '../types';
import { Button, Card, Badge, Modal } from '../components/Common';

// --- Dashboard Component ---

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<{dailyRevenue: number, monthlyRevenue: number, totalOrders: number, chartData: SalesData[]}>({
    dailyRevenue: 0, monthlyRevenue: 0, totalOrders: 0, chartData: []
  });

  useEffect(() => {
    // Force refresh stats
    const loadStats = () => setStats(Store.getAnalytics());
    loadStats();
    const interval = setInterval(loadStats, 10000); // Live update
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <h2 className="text-3xl font-bold text-slate-800 font-heading">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-to-br from-slate-800 to-slate-900 text-white border-none shadow-xl shadow-slate-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-300 text-sm font-medium tracking-wide">Daily Revenue</p>
              <h3 className="text-4xl font-bold mt-2 font-heading">₹{stats.dailyRevenue}</h3>
            </div>
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6 border-white/60">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-sm font-medium tracking-wide">Monthly Revenue</p>
              <h3 className="text-4xl font-bold mt-2 text-slate-900 font-heading">₹{stats.monthlyRevenue}</h3>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl">
              <span className="text-blue-600 font-bold text-xl">₹</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-white/60">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-sm font-medium tracking-wide">Total Orders</p>
              <h3 className="text-4xl font-bold mt-2 text-slate-900 font-heading">{stats.totalOrders}</h3>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl">
              <ShoppingBag className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-8 h-96 border-white/60">
          <h3 className="text-xl font-bold text-slate-900 mb-8 font-heading">Revenue Trend (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats.chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dy={10} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} dx={-10} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontFamily: 'Inter' }}
                cursor={{ stroke: '#64748b', strokeWidth: 2 }}
              />
              <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={4} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }} activeDot={{ r: 8, stroke: '#fff', strokeWidth: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

         <Card className="p-8 h-96 border-white/60">
          <h3 className="text-xl font-bold text-slate-900 mb-8 font-heading">Orders Volume</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dy={10} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
              <Tooltip 
                cursor={{fill: '#f1f5f9'}}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontFamily: 'Inter' }}
              />
              <Bar dataKey="orders" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

// --- Order Management ---

export const OrderManager: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<'All' | OrderStatus>('All');

  const refresh = () => setOrders(Store.getOrders());
  
  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusUpdate = (id: string, status: OrderStatus) => {
    Store.updateOrderStatus(id, status);
    refresh();
  };

  const filteredOrders = filter === 'All' ? orders : orders.filter(o => o.status === filter);

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-slate-800 font-heading">Orders</h2>
        <div className="flex gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
          {['All', ...Object.values(OrderStatus)].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === s ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-20 text-slate-400 bg-white/50 rounded-[2rem] border-2 border-dashed border-slate-200">
            <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>No orders found for this category.</p>
          </div>
        ) : (
          filteredOrders.map(order => (
            <Card key={order.id} className="p-6 flex flex-col md:flex-row justify-between gap-6 hover:shadow-xl hover:shadow-slate-200 transition-all border-white/60">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xl font-bold text-slate-900 font-heading">#{order.id}</span>
                  <Badge status={order.status} />
                  <span className="text-sm text-slate-400 flex items-center gap-1 ml-2">
                    <Clock className="w-3 h-3" />
                    {new Date(order.timestamp).toLocaleString()}
                  </span>
                </div>
                <div className="text-slate-900 font-medium mb-1 text-lg">{order.customerName} <span className="text-slate-400 font-normal text-sm">({order.customerPhone})</span></div>
                <div className="text-sm text-slate-500 mb-4 bg-slate-50 inline-block px-2 py-1 rounded-lg">
                  Payment: <span className="font-semibold text-slate-700">{order.paymentMethod}</span>
                </div>
                <div className="space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={`${item.id}-${idx}`} className="text-sm text-slate-600 flex justify-between max-w-md border-b border-slate-50 pb-2 last:border-0">
                      <span className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{item.quantity}x</span> 
                        {item.name} 
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded uppercase tracking-wider">{item.selectedUnit}</span>
                      </span>
                      <span className="font-medium">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 font-bold text-xl text-slate-800 font-heading">Total: ₹{order.total}</div>
              </div>
              
              <div className="flex md:flex-col justify-center gap-3 min-w-[160px]">
                {order.status === OrderStatus.PENDING && (
                  <Button onClick={() => handleStatusUpdate(order.id, OrderStatus.PREPARING)} className="w-full bg-blue-600 hover:bg-blue-700 shadow-blue-200">
                    Start Preparing
                  </Button>
                )}
                {order.status === OrderStatus.PREPARING && (
                  <Button onClick={() => handleStatusUpdate(order.id, OrderStatus.COMPLETED)} className="w-full bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200">
                    Mark Completed
                  </Button>
                )}
                 {order.status !== OrderStatus.CANCELLED && order.status !== OrderStatus.COMPLETED && (
                  <Button variant="danger" onClick={() => handleStatusUpdate(order.id, OrderStatus.CANCELLED)} className="w-full bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 shadow-none">
                    Cancel Order
                  </Button>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

// --- Menu Management ---

export const MenuManager: React.FC = () => {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<MenuItem>>({});
  
  // Calculate existing categories for suggestion list
  const existingCategories = Array.from(new Set(menu.map(m => m.category)));

  useEffect(() => {
    setMenu(Store.getMenu());
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem = {
      ...editingItem,
      id: editingItem.id || Math.random().toString(36).substr(2, 9),
      price: Number(editingItem.price),
      available: editingItem.available !== undefined ? editingItem.available : true,
      // Default to Main Course if empty
      category: editingItem.category || 'Main Course' 
    } as MenuItem;

    let newMenu;
    if (editingItem.id) {
      newMenu = menu.map(m => m.id === newItem.id ? newItem : m);
    } else {
      newMenu = [...menu, newItem];
    }
    
    Store.saveMenu(newMenu);
    setMenu(newMenu);
    setIsModalOpen(false);
    setEditingItem({});
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure?")) {
      const newMenu = menu.filter(m => m.id !== id);
      Store.saveMenu(newMenu);
      setMenu(newMenu);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-slate-800 font-heading">Menu Management</h2>
        <Button onClick={() => { setEditingItem({ available: true }); setIsModalOpen(true); }} className="shadow-slate-200">
          <Plus className="w-5 h-5 mr-2" /> Add New Item
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {menu.map(item => (
          <Card key={item.id} className={`group relative border-white/60 hover:shadow-xl hover:shadow-slate-200 transition-all duration-300 ${!item.available ? 'opacity-75 grayscale' : ''}`}>
            <div className="aspect-video w-full overflow-hidden bg-slate-100 relative rounded-t-[2rem]">
               <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
                 <Button variant="secondary" onClick={() => { setEditingItem(item); setIsModalOpen(true); }} className="!p-3 rounded-full hover:scale-110"><Edit2 className="w-4 h-4" /></Button>
                 <Button variant="danger" onClick={() => handleDelete(item.id)} className="!p-3 rounded-full hover:scale-110"><Trash2 className="w-4 h-4" /></Button>
               </div>
               {!item.available && (
                 <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                   Sold Out
                 </div>
               )}
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-slate-900 text-lg font-heading">{item.name}</h3>
                <span className="font-bold text-blue-600">₹{item.price}</span>
              </div>
              <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed mb-4">{item.description}</p>
              <div className="flex gap-2">
                 <Badge status={item.category} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem.id ? "Edit Item" : "Add New Item"}>
        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Name</label>
            <input required type="text" className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" value={editingItem.name || ''} onChange={e => setEditingItem({...editingItem, name: e.target.value})} placeholder="e.g., Mutton Biryani" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
            <textarea required rows={3} className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" value={editingItem.description || ''} onChange={e => setEditingItem({...editingItem, description: e.target.value})} placeholder="Describe ingredients and taste..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Price (₹)</label>
              <input required type="number" step="1" className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" value={editingItem.price || ''} onChange={e => setEditingItem({...editingItem, price: parseFloat(e.target.value)})} placeholder="0" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
              <input 
                list="category-options" 
                required 
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white" 
                value={editingItem.category || ''} 
                onChange={e => setEditingItem({...editingItem, category: e.target.value})}
                placeholder="Select..."
              />
              <datalist id="category-options">
                {existingCategories.map(c => <option key={c} value={c} />)}
                <option value="Starters" />
                <option value="Main Course" />
                <option value="Drinks" />
                <option value="Dessert" />
              </datalist>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Image URL</label>
            <input required type="url" className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" value={editingItem.imageUrl || ''} onChange={e => setEditingItem({...editingItem, imageUrl: e.target.value})} placeholder="https://..." />
          </div>
          
          <div className="flex items-center gap-3 pt-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
             <input 
               type="checkbox" 
               id="available-check" 
               checked={editingItem.available !== undefined ? editingItem.available : true} 
               onChange={e => setEditingItem({...editingItem, available: e.target.checked})} 
               className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-slate-300"
             />
             <label htmlFor="available-check" className="text-sm font-medium text-slate-700 select-none cursor-pointer">Available for Ordering</label>
          </div>

          <Button type="submit" className="w-full py-3 mt-2 shadow-slate-200">Save Item</Button>
        </form>
      </Modal>
    </div>
  );
};