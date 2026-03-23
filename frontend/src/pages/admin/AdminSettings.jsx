import React, { useState, useEffect } from 'react';
import { Save, Eye, EyeOff, RefreshCw } from 'lucide-react';

const Section = ({ title, children }) => (
  <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-6 mb-6">
    <h2 className="font-bold text-lg text-[#1A1A1A] mb-4 pb-3 border-b border-gray-100">{title}</h2>
    {children}
  </div>
);

const Field = ({ label, hint, children }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-[#1A1A1A] mb-1">{label}</label>
    {hint && <p className="text-xs text-gray-400 mb-1.5">{hint}</p>}
    {children}
  </div>
);

const AdminSettings = () => {
  const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const token = () => localStorage.getItem('adminToken');

  // Admin Credentials
  const [credentials, setCredentials] = useState({ email: '', newPassword: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [credMsg, setCredMsg] = useState('');
  const [savingCred, setSavingCred] = useState(false);

  // Populate current email
  useEffect(() => {
    const info = JSON.parse(localStorage.getItem('adminInfo') || '{}');
    setCredentials(prev => ({ ...prev, email: info.email || '' }));
  }, []);

  const handleUpdateCredentials = async (e) => {
    e.preventDefault();
    if (credentials.newPassword && credentials.newPassword !== credentials.confirmPassword) {
      return setCredMsg('Passwords do not match.');
    }
    setSavingCred(true);
    setCredMsg('');
    try {
      const body = { email: credentials.email };
      if (credentials.newPassword) body.password = credentials.newPassword;

      const res = await fetch(`${API}/admin/auth/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        // Update stored token and info
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminInfo', JSON.stringify({ email: data.email, role: data.role }));
        setCredMsg('✓ Credentials updated successfully!');
        setCredentials(prev => ({ ...prev, newPassword: '', confirmPassword: '' }));
      } else {
        setCredMsg(data.message || 'Update failed.');
      }
    } catch (err) {
      setCredMsg('Failed to connect to server.');
    } finally {
      setSavingCred(false);
    }
  };

  // General Settings (stored in localStorage for simplicity / can be backed by a DB later)
  const stored = JSON.parse(localStorage.getItem('aura_admin_settings') || '{}');
  const [general, setGeneral] = useState({ siteName: stored.siteName || 'Aura Headphones', taxRate: stored.taxRate || '18', shippingFee: stored.shippingFee || '99', freeShippingAbove: stored.freeShippingAbove || '999' });
  const [genMsg, setGenMsg] = useState('');

  const handleSaveGeneral = (e) => {
    e.preventDefault();
    localStorage.setItem('aura_admin_settings', JSON.stringify(general));
    setGenMsg('✓ Settings saved locally.');
    setTimeout(() => setGenMsg(''), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-[#1A1A1A]">Settings</h1>
        <p className="text-gray-500 mt-1">Configure your store, credentials, and preferences.</p>
      </div>

      {/* Admin Credentials */}
      <Section title="🔐 Admin Credentials">
        <form onSubmit={handleUpdateCredentials}>
          <Field label="Admin Email">
            <input
              type="email" required value={credentials.email}
              onChange={e => setCredentials({ ...credentials, email: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#F8F8F8] border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]"
            />
          </Field>
          <Field label="New Password" hint="Leave blank to keep current password.">
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'} value={credentials.newPassword}
                onChange={e => setCredentials({ ...credentials, newPassword: e.target.value })}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-[#F8F8F8] border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1A1A1A] pr-12"
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </Field>
          {credentials.newPassword && (
            <Field label="Confirm Password">
              <input
                type="password" value={credentials.confirmPassword}
                onChange={e => setCredentials({ ...credentials, confirmPassword: e.target.value })}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-[#F8F8F8] border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]"
              />
            </Field>
          )}
          {credMsg && <p className={`text-sm mb-3 ${credMsg.startsWith('✓') ? 'text-green-600' : 'text-red-500'}`}>{credMsg}</p>}
          <button type="submit" disabled={savingCred} className="bg-[#1A1A1A] text-white px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 hover:bg-black transition-colors disabled:opacity-50">
            <Save size={16} />
            {savingCred ? 'Saving…' : 'Update Credentials'}
          </button>
        </form>
      </Section>

      {/* General Store Settings */}
      <Section title="🏪 Store Settings">
        <form onSubmit={handleSaveGeneral}>
          <Field label="Store Name">
            <input value={general.siteName} onChange={e => setGeneral({...general, siteName: e.target.value})}
              className="w-full px-4 py-2.5 rounded-xl bg-[#F8F8F8] border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]" />
          </Field>
          <div className="grid grid-cols-3 gap-4">
            <Field label="Tax / GST (%)">
              <input type="number" min="0" max="100" value={general.taxRate} onChange={e => setGeneral({...general, taxRate: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl bg-[#F8F8F8] border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]" />
            </Field>
            <Field label="Shipping Fee (₹)">
              <input type="number" min="0" value={general.shippingFee} onChange={e => setGeneral({...general, shippingFee: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl bg-[#F8F8F8] border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]" />
            </Field>
            <Field label="Free Shipping Above (₹)">
              <input type="number" min="0" value={general.freeShippingAbove} onChange={e => setGeneral({...general, freeShippingAbove: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl bg-[#F8F8F8] border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]" />
            </Field>
          </div>
          {genMsg && <p className="text-sm text-green-600 mb-3">{genMsg}</p>}
          <button type="submit" className="bg-[#1A1A1A] text-white px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 hover:bg-black transition-colors">
            <Save size={16} /> Save Settings
          </button>
        </form>
      </Section>

      {/* Environment Info */}
      <Section title="⚙️ Environment (Read-only)">
        <div className="space-y-3 text-sm">
          {[
            ['API URL', import.meta.env.VITE_API_URL || 'http://localhost:5000'],
            ['Cloudinary Cloud', import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'Not configured'],
            ['Firebase Project', import.meta.env.VITE_FIREBASE_PROJECT_ID || 'Not configured'],
          ].map(([k, v]) => (
            <div key={k} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <span className="text-gray-500">{k}</span>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded-md text-[#1A1A1A] font-mono">{v}</code>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
};

export default AdminSettings;
