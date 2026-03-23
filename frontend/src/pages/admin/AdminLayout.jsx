import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  LogOut,
  Ticket
} from 'lucide-react';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('adminToken');
  const adminInfo = JSON.parse(localStorage.getItem('adminInfo') || '{}');

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
    }
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Products', path: '/admin/products', icon: <Package size={20} /> },
    { name: 'Orders', path: '/admin/orders', icon: <ShoppingCart size={20} /> },
    { name: 'Users', path: '/admin/users', icon: <Users size={20} /> },
    { name: 'Coupons', path: '/admin/coupons', icon: <Ticket size={20} /> },
    { name: 'Settings', path: '/admin/settings', icon: <Settings size={20} /> },
  ];

  if (!token) return null;

  return (
    <div className="flex h-screen bg-[#F8F8F8] text-[#1A1A1A] antialiased" style={{ fontFamily: "'Outfit', sans-serif" }}>
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <div className="w-8 h-8 bg-[#1A1A1A] text-white rounded-lg flex items-center justify-center font-bold text-xl">
            A
          </div>
          <div>
            <h2 className="font-bold text-lg tracking-tight">Admin Portal</h2>
            <p className="text-xs text-gray-400 capitalize">{adminInfo.role || 'Superadmin'}</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                  isActive 
                    ? 'bg-[#1A1A1A] text-white shadow-md' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-[#1A1A1A]'
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors font-medium"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content View */}
      <main className="flex-1 h-full overflow-y-auto w-full min-h-0" data-lenis-prevent>
        <div className="p-8">
          <Outlet />
        </div>
      </main>
      
    </div>
  );
};

export default AdminLayout;
