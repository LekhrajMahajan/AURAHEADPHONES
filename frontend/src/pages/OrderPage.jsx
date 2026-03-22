import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Clock, Truck, CheckCircle2 } from 'lucide-react';
import { fetchMyOrders } from '../services/api';

const OrderPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await fetchMyOrders();
        // Backend array return karta hai
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Orders fetch failed:', err);
        setError('Could not load orders. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  const trackingSteps = [
    { id: 1, label: 'Order Placed', icon: Package },
    { id: 2, label: 'Processing', icon: Clock },
    { id: 3, label: 'Shipped', icon: Truck },
    { id: 4, label: 'Delivered', icon: CheckCircle2 },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EAE8E3] flex items-center justify-center pt-32">
        <div className="w-8 h-8 border-2 border-[#1A1A1A] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EAE8E3] pt-32 pb-32 animate-[fade-in_0.5s_ease-out]">
      <div className="max-w-4xl mx-auto px-6 md:px-16">

        <div className="mb-16">
          <h1 className="text-[3.5rem] md:text-[5rem] font-medium tracking-tighter text-[#1A1A1A] leading-[1]">
            Your<br />Orders
          </h1>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 text-red-500 p-6 rounded-[20px] mb-8 text-center font-medium">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!error && orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[40px] shadow-sm">
            <Package className="w-16 h-16 text-gray-300 mb-6" />
            <h2 className="text-2xl font-medium text-[#1A1A1A] mb-4">No Active Orders</h2>
            <p className="text-gray-500 mb-8">You haven't placed any orders yet.</p>
            <button
              onClick={() => navigate('/shop')}
              className="px-8 py-4 bg-[#1A1A1A] text-white rounded-full uppercase tracking-widest text-xs font-semibold hover:bg-[#333] transition-colors"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-12">
            {orders.map((order, idx) => {
              const orderId = order._id ? `#${order._id.slice(-6).toUpperCase()}` : `#${idx + 1}`;
              const orderDate = order.createdAt
                ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                    year: 'numeric', month: 'long', day: 'numeric',
                  })
                : 'N/A';

              return (
                <div
                  key={order._id || idx}
                  className="bg-white rounded-[40px] p-8 md:p-12 shadow-xl border border-gray-100 animate-[fade-in_0.5s_ease-out]"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  {/* Order Header */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pb-8 border-b border-gray-100 gap-4">
                    <div>
                      <h3 className="text-2xl font-medium text-[#1A1A1A] mb-2">{orderId}</h3>
                      <p className="text-gray-500 text-sm font-medium tracking-widest uppercase">
                        Placed on {orderDate}
                      </p>
                    </div>
                    <div className="text-left md:text-right">
                      <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Total Amount</p>
                      <div className="text-2xl font-medium text-[#1A1A1A]">
                        ₹{(order.total || 0).toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>

                  {/* Live Tracking */}
                  <div className="mb-16">
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-8">
                      Live Status
                    </h4>
                    <div className="relative flex justify-between items-center w-full">
                      {/* Background line */}
                      <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gray-100 -translate-y-1/2 z-0"></div>
                      {/* Active line */}
                      <div
                        className="absolute top-1/2 left-0 h-[2px] bg-green-500 -translate-y-1/2 z-0 transition-all duration-1000"
                        style={{ width: `${(((order.status || 1) - 1) / 3) * 100}%` }}
                      ></div>

                      {trackingSteps.map((step) => {
                        const StepIcon = step.icon;
                        const isActive = (order.status || 1) >= step.id;
                        return (
                          <div key={step.id} className="relative z-10 flex flex-col items-center gap-3">
                            <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${
                              isActive
                                ? 'bg-white border-green-500 text-green-500 shadow-md'
                                : 'bg-gray-50 border-gray-100 text-gray-300'
                            }`}>
                              <StepIcon className="w-5 h-5 md:w-6 md:h-6" />
                            </div>
                            <span className={`text-[10px] md:text-xs font-semibold uppercase tracking-widest absolute -bottom-8 whitespace-nowrap text-center ${
                              isActive ? 'text-[#1A1A1A]' : 'text-gray-300'
                            }`}>
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-4 pt-4">
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-4">
                      Items Included
                    </h4>
                    {(order.items || []).map((item, itemIdx) => (
                      <div
                        key={item._id || itemIdx}
                        className="flex items-center gap-6 bg-[#F9F9F8] p-4 rounded-3xl"
                      >
                        <div className="w-20 h-20 bg-white rounded-[20px] p-2 flex-shrink-0 shadow-sm">
                          <img
                            src={item.img?.startsWith('http') ? item.img : `/${item.img}`}
                            alt={item.name}
                            className="w-full h-full object-contain mix-blend-multiply"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-medium text-[#1A1A1A]">{item.name}</h4>
                          <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest mt-1">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <div className="text-base font-medium pr-4">
                          ₹{(item.price || 0).toLocaleString('en-IN')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderPage;