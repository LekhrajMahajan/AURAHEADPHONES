import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, MapPin, Phone, Mail, ShieldCheck, ArrowLeft, Loader2, CheckCircle2, Package } from 'lucide-react';
import { getProfile, updateProfile } from '../services/api';

const ProfilePage = ({ currentUser, setCurrentUser }) => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  useEffect(() => {
  if (!currentUser) { navigate('/login'); return; }
  
  getProfile().then(data => {
    setFormData({
      name: data.name || '',
      email: data.email || '',
      phone: data.phone || '',
      address: data.address || '',
      city: data.city || '',
      state: data.state || '',
      pincode: data.pincode || '',
    });
  });
}, [currentUser, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
  e.preventDefault();
  setIsSaving(true);
  try {
    const updated = await updateProfile(formData);
    if (setCurrentUser) setCurrentUser(updated);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  } catch (err) {
    console.error('Profile update failed:', err);
  } finally {
    setIsSaving(false);
  }
};

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-[#EAE8E3] pt-32 pb-32 animate-[fade-in_0.5s_ease-out]">
      <div className="max-w-6xl mx-auto px-6 md:px-16">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-gray-500 hover:text-[#1A1A1A] transition-colors mb-12 text-sm font-semibold uppercase tracking-widest"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Left Sidebar - Profile Summary */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-[#1A1A1A] text-white p-6 md:p-10 rounded-[30px] md:rounded-[40px] shadow-2xl text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white/10 to-transparent"></div>
              
              <div className="relative w-28 h-28 mx-auto bg-white text-[#1A1A1A] rounded-full flex items-center justify-center text-4xl font-medium mb-6 shadow-xl">
                {formData.name ? formData.name.charAt(0).toUpperCase() : <User size={40} />}
              </div>
              
              <h2 className="text-2xl font-medium tracking-tight mb-2 truncate px-2">
                {formData.name || 'Aura User'}
              </h2>
              <p className="text-white/60 text-sm font-light mb-8 truncate px-2">
                {formData.email}
              </p>
              
              <div className="w-full h-[1px] bg-white/10 mb-8"></div>
              
              <div className="space-y-4 text-left">
                <div className="flex items-center gap-4 text-white/80">
                  <ShieldCheck className="w-5 h-5 text-green-400" />
                  <span className="text-sm font-light">Verified Account</span>
                </div>
                <div className="flex items-center gap-4 text-white/80">
                  <Package className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-light">Aura Member</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Edit Form */}
          <div className="lg:col-span-8">
            <div className="bg-white p-6 md:p-12 rounded-[30px] md:rounded-[40px] shadow-sm border border-gray-100">
              <div className="mb-8 md:mb-10">
                <h1 className="text-3xl md:text-4xl font-medium tracking-tighter text-[#1A1A1A] mb-3">Profile Settings</h1>
                <p className="text-gray-500 font-light">Update your personal details and shipping address.</p>
              </div>

              <form onSubmit={handleSave} className="space-y-8">
                
                {/* Personal Information Section */}
                <section>
                  <h3 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-6 pb-2 border-b border-gray-100">
                    <User className="w-4 h-4" /> Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold text-[#1A1A1A] uppercase tracking-widest pl-2">Full Name</label>
                      <input 
                        type="text" name="name" value={formData.name} onChange={handleChange} required
                        className="bg-[#F9F9F8] border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-[#1A1A1A] transition-all w-full" 
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold text-[#1A1A1A] uppercase tracking-widest pl-2">Phone Number</label>
                      <input 
                        type="tel" name="phone" value={formData.phone} onChange={handleChange}
                        className="bg-[#F9F9F8] border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-[#1A1A1A] transition-all w-full" 
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div className="flex flex-col gap-2 md:col-span-2">
                      <label className="text-xs font-semibold text-[#1A1A1A] uppercase tracking-widest pl-2">Email Address</label>
                      <input 
                        type="email" name="email" value={formData.email} disabled
                        className="bg-gray-100 text-gray-500 border-none rounded-2xl px-6 py-4 outline-none cursor-not-allowed w-full" 
                        title="Email cannot be changed"
                      />
                    </div>
                  </div>
                </section>

                {/* Address Section */}
                <section className="pt-4">
                  <h3 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-6 pb-2 border-b border-gray-100">
                    <MapPin className="w-4 h-4" /> Default Shipping Address
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2 md:col-span-2">
                      <label className="text-xs font-semibold text-[#1A1A1A] uppercase tracking-widest pl-2">Street Address</label>
                      <input 
                        type="text" name="address" value={formData.address} onChange={handleChange}
                        className="bg-[#F9F9F8] border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-[#1A1A1A] transition-all w-full" 
                        placeholder="House No., Building Name, Street"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold text-[#1A1A1A] uppercase tracking-widest pl-2">City</label>
                      <input 
                        type="text" name="city" value={formData.city} onChange={handleChange}
                        className="bg-[#F9F9F8] border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-[#1A1A1A] transition-all w-full" 
                        placeholder="Mumbai"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold text-[#1A1A1A] uppercase tracking-widest pl-2">State</label>
                      <input 
                        type="text" name="state" value={formData.state} onChange={handleChange}
                        className="bg-[#F9F9F8] border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-[#1A1A1A] transition-all w-full" 
                        placeholder="Maharashtra"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold text-[#1A1A1A] uppercase tracking-widest pl-2">PIN Code</label>
                      <input 
                        type="text" name="pincode" value={formData.pincode} onChange={handleChange}
                        className="bg-[#F9F9F8] border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-[#1A1A1A] transition-all w-full" 
                        placeholder="400001"
                      />
                    </div>
                  </div>
                </section>

                {/* Save Button */}
                <div className="pt-8">
                  <button 
                    type="submit" 
                    disabled={isSaving}
                    className={`w-full md:w-auto md:px-12 py-5 rounded-full text-sm font-semibold uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 ${isSaved ? 'bg-green-500 text-white' : 'bg-[#1A1A1A] text-white hover:bg-[#333]'}`}
                  >
                    {isSaving ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Saving Changes...</>
                    ) : isSaved ? (
                      <><CheckCircle2 className="w-5 h-5" /> Profile Saved</>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
                
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;