import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Ticket, Calendar, Tag } from 'lucide-react';

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    code: '', discountType: 'percentage', discountValue: '', expiryDate: '', usageLimit: ''
  });

  const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const token = () => localStorage.getItem('adminToken');

  useEffect(() => { fetchCoupons(); }, []);

  const fetchCoupons = async () => {
    try {
      const res = await fetch(`${API}/coupons`, { headers: { Authorization: `Bearer ${token()}` } });
      const data = await res.json();
      setCoupons(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${API}/coupons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify({ ...form, discountValue: Number(form.discountValue), usageLimit: form.usageLimit ? Number(form.usageLimit) : null }),
      });
      if (res.ok) {
        setForm({ code: '', discountType: 'percentage', discountValue: '', expiryDate: '', usageLimit: '' });
        setShowForm(false);
        fetchCoupons();
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to create coupon');
      }
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this coupon?')) return;
    await fetch(`${API}/coupons/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token()}` } });
    fetchCoupons();
  };

  const isExpired = (date) => new Date(date) < new Date();

  if (loading) return <div className="flex justify-center h-64 items-center"><div className="w-8 h-8 border-2 border-[#1A1A1A] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1A1A1A]">Coupons & Offers</h1>
          <p className="text-gray-500 mt-1">Create and manage discount codes for your customers.</p>
        </div>
        <button onClick={() => setShowForm(true)} className="bg-[#1A1A1A] text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 hover:bg-black transition-colors shadow-sm">
          <Plus size={18} /> Create Coupon
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.05)] p-6 mb-6">
          <h2 className="font-bold text-lg mb-4">New Coupon</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Coupon Code</label>
              <input required placeholder="e.g. SAVE20" value={form.code} onChange={e => setForm({...form, code: e.target.value.toUpperCase()})}
                className="w-full px-4 py-2.5 rounded-xl bg-[#F8F8F8] border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1A1A1A] font-mono uppercase" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Discount Type</label>
              <select value={form.discountType} onChange={e => setForm({...form, discountType: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl bg-[#F8F8F8] border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]">
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (₹)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Discount Value</label>
              <input required type="number" min="0" value={form.discountValue} onChange={e => setForm({...form, discountValue: e.target.value})}
                placeholder={form.discountType === 'percentage' ? 'e.g. 20' : 'e.g. 500'}
                className="w-full px-4 py-2.5 rounded-xl bg-[#F8F8F8] border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Expiry Date</label>
              <input required type="date" value={form.expiryDate} onChange={e => setForm({...form, expiryDate: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl bg-[#F8F8F8] border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Usage Limit <span className="text-gray-400 font-normal">(blank = unlimited)</span></label>
              <input type="number" min="1" value={form.usageLimit} onChange={e => setForm({...form, usageLimit: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl bg-[#F8F8F8] border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]" />
            </div>
            <div className="flex items-end gap-3">
              <button type="submit" disabled={saving} className="flex-1 bg-[#1A1A1A] text-white py-2.5 rounded-xl font-medium hover:bg-black transition-colors disabled:opacity-50">
                {saving ? 'Creating...' : 'Create Coupon'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2.5 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Coupon Cards */}
      <div className="grid gap-4">
        {coupons.map(c => (
          <div key={c._id} className={`bg-white rounded-2xl border p-5 flex items-center justify-between transition-all ${isExpired(c.expiryDate) ? 'border-gray-100 opacity-60' : 'border-gray-100 shadow-sm hover:shadow-md'}`}>
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 bg-[#F8F8F8] rounded-xl flex items-center justify-center">
                <Ticket size={22} className="text-[#1A1A1A]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-lg text-[#1A1A1A]">{c.code}</span>
                  {isExpired(c.expiryDate) && <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">EXPIRED</span>}
                </div>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Tag size={13} />
                    {c.discountType === 'percentage' ? `${c.discountValue}% off` : `₹${c.discountValue} off`}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={13} />
                    Expires {new Date(c.expiryDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div className="text-center">
                <p className="font-bold text-[#1A1A1A] text-lg">{c.usedCount}</p>
                <p className="text-xs text-gray-400">Used</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-[#1A1A1A] text-lg">{c.usageLimit ?? '∞'}</p>
                <p className="text-xs text-gray-400">Limit</p>
              </div>
              <button onClick={() => handleDelete(c._id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        {coupons.length === 0 && <div className="p-10 text-center text-gray-400 bg-white rounded-2xl border border-gray-100">No coupons yet. Create your first one!</div>}
      </div>
    </div>
  );
};

export default AdminCoupons;
