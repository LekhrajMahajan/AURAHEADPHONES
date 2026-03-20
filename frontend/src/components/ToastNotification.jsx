import React, { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';

const ToastNotification = ({ message, isVisible, onClose }) => {
  // To automatically close the toast after 3 seconds
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <div
      className={`fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[200] flex items-center gap-4 bg-[#1A1A1A] text-white pl-4 pr-6 py-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${isVisible
          ? 'translate-y-0 opacity-100 scale-100'
          : 'translate-y-10 opacity-0 scale-95 pointer-events-none'
        }`}
    >
      {/* Icon Area */}
      <div className="bg-green-500/20 text-green-400 p-2.5 rounded-xl flex-shrink-0">
        <CheckCircle2 className="w-5 h-5" strokeWidth={2} />
      </div>

      {/* Text Area */}
      <div className="flex flex-col pr-4">
        <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-300 mb-0.5">
          Success
        </h4>
        <p className="text-sm font-medium text-white/90">
          {message || "Item added to your cart."}
        </p>
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="ml-auto p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all"
      >
        <X className="w-4 h-4" strokeWidth={2} />
      </button>
    </div>
  );
};

export default ToastNotification;
