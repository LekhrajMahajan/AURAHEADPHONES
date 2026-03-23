import React, { useState, useEffect } from 'react';
import { Download, Edit2, Search, Filter } from 'lucide-react';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Expose updating state for specific orders
  const [updating, setUpdating] = useState(null);

  const STATUS_MAP = {
    1: { label: 'Pending', color: 'bg-orange-100 text-orange-700' },
    2: { label: 'Processing', color: 'bg-blue-100 text-blue-700' },
    3: { label: 'Delivered', color: 'bg-green-100 text-green-700' },
    4: { label: 'Cancelled', color: 'bg-red-100 text-red-700' }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/orders/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    setUpdating(id);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/orders/${id}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchOrders(); // Refresh to get updated
      }
    } catch (err) {
      console.error('Error updating order:', err);
    } finally {
      setUpdating(null);
    }
  };

  const handleDownloadInvoice = (order) => {
    // Generate a simple dummy invoice txt file
    const content = `INVOICE\n\nOrder ID: ${order._id}\nDate: ${new Date(order.createdAt).toLocaleDateString()}\nCustomer: ${order.user?.name || 'Guest'}\n\nTotal: ₹${order.total}\nPayment Method: ${order.paymentMethod}\n\nThank you!`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice_${order._id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = (o._id.toLowerCase().includes(searchQuery.toLowerCase())) || 
                          (o.user?.name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (o.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (statusFilter === 'All') return matchesSearch;
    const filterNumber = Object.keys(STATUS_MAP).find(k => STATUS_MAP[k].label === statusFilter);
    return matchesSearch && (o.status === parseInt(filterNumber));
  });

  if (loading) {
    return <div className="p-8 flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#1A1A1A] border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1A1A1A]">Orders</h1>
          <p className="text-gray-500 mt-1">Manage, update, and track customer orders.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] mb-6 flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[200px] relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by ID, name, email..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#F8F8F8] border border-gray-200 focus:outline-none focus:border-[#1A1A1A] transition-colors"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-gray-400" />
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#F8F8F8] border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:border-[#1A1A1A]"
          >
            <option>All</option>
            <option>Pending</option>
            <option>Processing</option>
            <option>Delivered</option>
            <option>Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm">
                <th className="p-4 font-medium pl-6">Order ID & Date</th>
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Items & Total</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right pr-6">Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map(o => (
                <tr key={o._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 pl-6">
                    <p className="font-medium text-[#1A1A1A] text-sm uppercase">#{o._id.slice(-6)}</p>
                    <p className="text-xs text-gray-400">{new Date(o.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td className="p-4">
                    <p className="font-medium text-[#1A1A1A] text-sm">{o.user?.name || 'Guest'}</p>
                    <p className="text-xs text-gray-400">{o.user?.email || 'N/A'}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-sm text-[#1A1A1A]">{o.items?.length || 0} items</p>
                    <p className="font-semibold">₹{o.total}</p>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${STATUS_MAP[o.status || 1].color}`}>
                      {STATUS_MAP[o.status || 1].label}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-2 text-sm">
                      <select 
                        value={o.status} 
                        onChange={(e) => handleStatusUpdate(o._id, parseInt(e.target.value))}
                        disabled={updating === o._id}
                        className="bg-[#F8F8F8] border border-gray-200 text-xs rounded-lg px-2 py-1.5 focus:outline-none"
                      >
                        <option value={1}>Pending</option>
                        <option value={2}>Processing</option>
                        <option value={3}>Delivered</option>
                        <option value={4}>Cancelled</option>
                      </select>
                      
                      <button onClick={() => handleDownloadInvoice(o)} className="p-1.5 text-gray-400 hover:text-[#1A1A1A] hover:bg-gray-100 rounded-lg transition-colors" title="Download Invoice">
                        <Download size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredOrders.length === 0 && <div className="p-8 text-center text-gray-500">No orders found.</div>}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
