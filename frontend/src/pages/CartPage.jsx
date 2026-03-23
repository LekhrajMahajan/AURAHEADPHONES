import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Minus, Plus, ArrowRight, ShoppingBag, Trash2 } from 'lucide-react';
import useScrollSmoother from '../utils/useScrollSmoother';
import { getOptimizedUrl } from '../utils/cloudinary';

// Convert the price to a consistent Indian format.
const toNumber = (price) => {
  if (typeof price === 'number') return price;
  return parseFloat(String(price).replace(/[^0-9.]/g, '')) || 0;
};
const formatPrice = (price) => `₹${toNumber(price).toLocaleString('en-IN')}`;

const CartPage = ({ cartItems, updateQuantity, removeItem }) => {
  useScrollSmoother();
  const navigate = useNavigate();
  const [removingId, setRemovingId] = useState(null); // For animation

  const subtotal = cartItems.reduce((sum, item) => {
    return sum + (toNumber(item.price) * (item.quantity || 1));
  }, 0);

  // Remove with fade animation
  const handleRemove = (id) => {
    setRemovingId(id);
    setTimeout(() => {
      removeItem(id);
      setRemovingId(null);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-[#EAE8E3] pt-32 pb-32 animate-[fade-in_0.5s_ease-out]">
      <div className="max-w-7xl mx-auto px-6 md:px-16">

        {/* Header */}
        <div className="mb-10 md:mb-24 mt-8 md:mt-0">
          <h1 className="text-[3rem] md:text-[6rem] font-medium tracking-tighter text-[#1A1A1A] leading-[0.9]">
            Your<br />Cart
          </h1>
          {cartItems.length > 0 && (
            <p className="text-gray-500 text-sm font-semibold uppercase tracking-widest mt-4">
              {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart
            </p>
          )}
        </div>

        {/* Empty Cart */}
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[40px] shadow-sm border border-gray-100">
            <ShoppingBag className="w-16 h-16 text-gray-300 mb-6" strokeWidth={1} />
            <h2 className="text-2xl font-medium text-[#1A1A1A] mb-3">Your cart is empty</h2>
            <p className="text-gray-500 mb-8 text-center max-w-xs leading-relaxed">
              Looks like you haven't added any products yet.
            </p>
            <Link
              to="/shop"
              className="px-8 py-4 bg-[#1A1A1A] text-white rounded-full uppercase tracking-widest text-xs font-semibold hover:bg-[#333] transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12">

            {/* ── Cart Items ── */}
            <div className="lg:w-2/3 flex flex-col gap-5">
              {cartItems.map((item) => {
                const itemId   = item._id || item.id;
                const isRemoving = removingId === itemId;

                return (
                  <div
                    key={itemId}
                    className={`flex flex-col sm:flex-row items-center gap-4 md:gap-6 bg-white p-4 md:p-6 rounded-[20px] md:rounded-[30px] shadow-sm border border-gray-100 relative transition-all duration-300 ${
                      isRemoving ? 'opacity-0 scale-95 translate-x-4' : 'opacity-100 scale-100'
                    }`}
                  >
                    {/* ✅ Remove Button — top right */}
                    <button
                      onClick={() => handleRemove(itemId)}
                      title="Remove item"
                      className="absolute top-5 right-5 p-2 rounded-full text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all duration-200 group"
                    >
                      <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    </button>

                    {/* Product Image */}
                    <div className="w-20 h-20 md:w-28 md:h-28 bg-[#F5F5F5] rounded-[14px] md:rounded-[18px] p-2 md:p-3 flex-shrink-0 flex items-center justify-center">
                      <img
                        src={getOptimizedUrl(item.img, { width: 200 })}
                        alt={item.name}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover mix-blend-multiply"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 flex flex-col text-center sm:text-left w-full">
                      <h3 className="text-lg font-medium text-[#1A1A1A] mb-1 pr-8">{item.name}</h3>
                      {item.color && (
                        <p className="text-gray-400 uppercase tracking-widest text-[10px] font-semibold mb-3">{item.color}</p>
                      )}
                      <div className="text-xl font-medium text-[#1A1A1A]">
                        {formatPrice(item.price)}
                      </div>
                    </div>

                    {/* ✅ Quantity Controls */}
                    <div className="flex items-center gap-3 bg-[#F5F5F5] rounded-full px-3 py-2 flex-shrink-0">
                      <button
                        onClick={() => updateQuantity(itemId, -1)}
                        className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white transition-colors text-[#1A1A1A] disabled:opacity-30"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-6 text-center font-semibold text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(itemId, 1)}
                        className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white transition-colors text-[#1A1A1A]"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Item total */}
                    <div className="text-base font-semibold text-[#1A1A1A] min-w-[80px] text-right flex-shrink-0 hidden sm:block">
                      ₹{(toNumber(item.price) * item.quantity).toLocaleString('en-IN')}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── Order Summary ── */}
            <div className="lg:w-1/3">
              <div className="bg-[#1A1A1A] text-white p-6 md:p-10 rounded-[30px] md:rounded-[40px] shadow-2xl sticky top-24 md:top-32">
                <h3 className="text-xl md:text-2xl font-medium mb-6 md:mb-8">Order Summary</h3>

                {/* Items breakdown */}
                <div className="flex flex-col gap-3 mb-6 max-h-48 overflow-y-auto">
                  {cartItems.map(item => {
                    const itemId = item._id || item.id;
                    return (
                      <div key={itemId} className="flex justify-between items-center text-white/70 text-sm">
                        <span className="truncate max-w-[60%] font-light">{item.name}</span>
                        <span className="font-medium">×{item.quantity}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="w-full h-[1px] bg-white/10 mb-6"></div>

                <div className="flex flex-col gap-4 mb-6 text-white/80 font-light text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal ({cartItems.reduce((a, i) => a + i.quantity, 0)} items)</span>
                    <span className="font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-green-400 font-semibold text-[10px] uppercase tracking-widest">Free</span>
                  </div>
                </div>

                <div className="w-full h-[1px] bg-white/10 mb-6"></div>

                <div className="flex justify-between items-center mb-10">
                  <span className="text-lg font-medium">Total</span>
                  <span className="text-3xl font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>

                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full py-5 bg-white text-[#1A1A1A] rounded-full flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all text-sm font-bold uppercase tracking-widest shadow-xl"
                >
                  Proceed to Checkout <ArrowRight className="w-5 h-5" />
                </button>

                <Link
                  to="/shop"
                  className="block text-center mt-5 text-white/50 text-xs uppercase tracking-widest font-semibold hover:text-white/80 transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;