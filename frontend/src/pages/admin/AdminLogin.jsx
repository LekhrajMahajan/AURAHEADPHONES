import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Save token and admin details
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminInfo', JSON.stringify({ email: data.email, role: data.role }));

      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EAE8E3] flex items-center justify-center p-4" style={{ fontFamily: "'Outfit', sans-serif" }}>
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-[0_10px_40px_rgba(0,0,0,0.08)]">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2">Admin Portal</h1>
          <p className="text-gray-500">Secure access for Aura admin</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-2 text-left">Admin Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-[#F8F8F8] border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1A1A1A] transition-all"
              placeholder="admin@aura.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-2 text-left">Admin Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-[#F8F8F8] border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1A1A1A] transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1A1A1A] text-white py-4 rounded-xl font-medium hover:bg-black transition-colors disabled:opacity-70 flex justify-center items-center"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Access Dashboard'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
