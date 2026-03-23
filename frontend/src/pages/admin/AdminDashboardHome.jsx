import React, { useState, useEffect } from 'react';
import { TrendingUp, ShoppingCart, Users, Clock, BarChart2, Award } from 'lucide-react';
import { getOptimizedUrl } from '../../utils/cloudinary';

const StatCard = ({ icon, title, value, subtitle, accent }) => (
  <div className={`bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all`}>
    <div className="flex items-start justify-between mb-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${accent}`}>
        {icon}
      </div>
    </div>
    <div>
      <h3 className="text-2xl font-bold text-[#1A1A1A]">{value}</h3>
      <p className="text-sm font-medium text-[#1A1A1A] mt-1">{title}</p>
      <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
    </div>
  </div>
);

const SimpleBarChart = ({ data }) => {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data.map(d => d.revenue), 1);
  return (
    <div className="flex items-end gap-2 h-40 w-full">
      {data.map((d, i) => (
        <div key={i} className="flex flex-col items-center flex-1 gap-1">
          <span className="text-[10px] text-gray-400 font-medium">₹{d.revenue > 999 ? (d.revenue/1000).toFixed(1)+'k' : d.revenue}</span>
          <div className="w-full rounded-t-lg bg-[#1A1A1A] transition-all duration-700" style={{ height: `${(d.revenue / max) * 120 + 4}px`, opacity: d.revenue === 0 ? 0.15 : 1 }} />
          <span className="text-[10px] text-gray-400 text-center leading-tight">{d.day}</span>
        </div>
      ))}
    </div>
  );
};

const AdminDashboardHome = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const res = await fetch(`${API}/users/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error('Failed to load stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#1A1A1A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const cards = [
    {
      icon: <TrendingUp size={18} className="text-green-600" />,
      title: 'Revenue Today',
      value: `₹${(stats?.todayRevenue || 0).toLocaleString()}`,
      subtitle: `₹${(stats?.monthRevenue || 0).toLocaleString()} this month`,
      accent: 'bg-green-50',
    },
    {
      icon: <ShoppingCart size={18} className="text-blue-600" />,
      title: 'Total Orders',
      value: stats?.totalOrders ?? 0,
      subtitle: 'All time',
      accent: 'bg-blue-50',
    },
    {
      icon: <Users size={18} className="text-purple-600" />,
      title: 'Total Customers',
      value: stats?.totalCustomers ?? 0,
      subtitle: 'Registered users',
      accent: 'bg-purple-50',
    },
    {
      icon: <Clock size={18} className="text-orange-500" />,
      title: 'Pending Orders',
      value: stats?.pendingOrders ?? 0,
      subtitle: 'Awaiting processing',
      accent: 'bg-orange-50',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-[#1A1A1A]">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back. Here's what's happening today.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {cards.map((c, i) => <StatCard key={i} {...c} />)}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Sales Graph */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          <div className="flex items-center gap-2 mb-6">
            <BarChart2 size={18} className="text-[#1A1A1A]" />
            <h2 className="font-bold text-[#1A1A1A]">Sales — Last 7 Days</h2>
          </div>
          {stats?.salesGraph?.length ? (
            <SimpleBarChart data={stats.salesGraph} />
          ) : (
            <div className="h-40 flex items-center justify-center text-gray-300 text-sm">No sales data yet</div>
          )}
        </div>

        {/* Top Products */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          <div className="flex items-center gap-2 mb-5">
            <Award size={18} className="text-[#1A1A1A]" />
            <h2 className="font-bold text-[#1A1A1A]">Best Sellers</h2>
          </div>
          {stats?.topProducts?.length ? (
            <div className="space-y-3">
              {stats.topProducts.map((p, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-300 w-4">#{i + 1}</span>
                  {p.img && (
                    <img src={getOptimizedUrl(p.img, { width: 60 })} alt={p.name}
                      className="w-9 h-9 rounded-lg object-cover bg-gray-100 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1A1A1A] truncate">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.qty} sold · ₹{p.revenue.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 text-gray-300 text-sm">No data yet</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardHome;
