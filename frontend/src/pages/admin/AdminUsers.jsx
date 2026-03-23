import React, { useState, useEffect } from 'react';
import { ShieldOff, ShieldCheck, Crown, Search } from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [toggling, setToggling] = useState(null);

  const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API}/users/admin/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBlock = async (id) => {
    setToggling(id);
    try {
      const token = localStorage.getItem('adminToken');
      await fetch(`${API}/users/admin/${id}/block`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers();
    } catch (err) {
      console.error('Error toggling block:', err);
    } finally {
      setToggling(null);
    }
  };

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort by totalSpending desc for VIP display
  const topCustomers = [...users].sort((a, b) => b.totalSpending - a.totalSpending).slice(0, 3).map(u => u._id);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-[#1A1A1A] border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-[#1A1A1A]">Customers</h1>
        <p className="text-gray-500 mt-1">Manage your customer base, view spending, and control access.</p>
      </div>

      {/* VIP Banner */}
      {topCustomers.length > 0 && (
        <div className="bg-gradient-to-r from-[#1A1A1A] to-[#3a3a3a] text-white rounded-3xl p-6 mb-6 flex items-center gap-4">
          <Crown size={28} className="text-yellow-400 flex-shrink-0" />
          <div>
            <p className="font-semibold text-lg">Top Customers (VIP)</p>
            <p className="text-gray-300 text-sm mt-0.5">
              {users.filter(u => topCustomers.includes(u._id)).map(u => u.name).join(', ')}
            </p>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-6 flex items-center gap-3">
        <Search size={18} className="text-gray-400 flex-shrink-0" />
        <input
          type="text"
          placeholder="Search customers by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full focus:outline-none bg-transparent text-sm"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm">
                <th className="p-4 pl-6 font-medium">Customer</th>
                <th className="p-4 font-medium">Orders</th>
                <th className="p-4 font-medium">Total Spending</th>
                <th className="p-4 font-medium">Joined</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 pr-6 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {u.name?.[0]?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-sm text-[#1A1A1A]">{u.name}</p>
                          {topCustomers.includes(u._id) && (
                            <Crown size={12} className="text-yellow-500" />
                          )}
                        </div>
                        <p className="text-xs text-gray-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm font-medium">{u.orderCount}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm font-semibold text-[#1A1A1A]">₹{(u.totalSpending || 0).toLocaleString()}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-xs text-gray-400">{new Date(u.createdAt).toLocaleDateString()}</span>
                  </td>
                  <td className="p-4">
                    {u.isBlocked ? (
                      <span className="inline-flex text-xs font-medium text-red-600 bg-red-50 px-2.5 py-1 rounded-md">Blocked</span>
                    ) : (
                      <span className="inline-flex text-xs font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-md">Active</span>
                    )}
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <button
                      onClick={() => handleToggleBlock(u._id)}
                      disabled={toggling === u._id}
                      className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${
                        u.isBlocked
                          ? 'text-green-500 hover:bg-green-50'
                          : 'text-red-400 hover:bg-red-50'
                      }`}
                      title={u.isBlocked ? 'Unblock user' : 'Block user'}
                    >
                      {u.isBlocked ? <ShieldCheck size={17} /> : <ShieldOff size={17} />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="p-8 text-center text-gray-400">No customers found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
