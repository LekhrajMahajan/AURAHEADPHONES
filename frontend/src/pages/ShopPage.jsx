import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Check } from 'lucide-react';
import ToastNotification from '../components/ToastNotification';
import { getOptimizedUrl } from '../utils/cloudinary';

const ShopPage = ({ currentUser, addToCart, products = [], searchQuery = '' }) => {
  const navigate = useNavigate();

  const [addedId, setAddedId] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const handleAdd = (product, e) => {
    e.stopPropagation();
    if (!currentUser) {
      setToastMessage('Please login first to add products to cart.');
      setShowToast(true);
      setTimeout(() => navigate('/login'), 1500);
      return;
    }
    if (addToCart) addToCart(product);
    setToastMessage(`${product.name} added to cart!`);
    setShowToast(true);
    const productId = product._id || product.id;
    setAddedId(productId);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <div className="min-h-screen bg-[#EAE8E3] pt-32 pb-32 animate-[fade-in_0.5s_ease-out]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-[#D6D5D0] pb-8">
          <div>
            <h4 className="text-[10px] md:text-xs font-semibold tracking-[0.2em] uppercase text-gray-500 mb-4">
              {currentUser ? `Welcome back, ${currentUser.name?.split(' ')[0] || 'Guest'}` : 'Our Lineup'}
            </h4>
            <h1 className="text-[3.5rem] md:text-[5rem] font-medium leading-[0.9] text-[#1A1A1A] tracking-tighter">
              The<br />Collection
            </h1>
          </div>
          <div className="text-gray-500 text-sm md:text-base font-light max-w-sm text-right mt-6 md:mt-0 leading-relaxed">
            Discover our meticulously curated lineup. Engineered for uncompromised acoustic excellence.
          </div>
        </div>

        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-gray-500">
            <ShoppingBag className="w-16 h-16 mb-6 opacity-20" />
            <p className="text-xl font-medium">No products found for "{searchQuery}"</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {products.map((product) => {
              const isAdded = addedId === (product._id || product.id);
              return (
                <div
                  key={product._id || product.id}
                  onClick={() => navigate(`/product/${product._id || product.id}`)}
                  className="group bg-white rounded-[20px] md:rounded-[30px] p-4 md:p-6 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-500 flex flex-col h-auto md:h-[480px] cursor-pointer"
                >
                  <div className="relative w-full aspect-square md:aspect-auto md:h-[250px] bg-[#F5F5F5] rounded-[16px] md:rounded-[24px] mb-4 md:mb-6 flex items-center justify-center p-3 md:p-6 overflow-hidden">
                    {product.tag && (
                      <span className="absolute top-3 left-3 md:top-4 md:left-4 bg-[#1A1A1A] text-white text-[8px] md:text-[9px] font-bold uppercase tracking-widest px-2 py-1 md:px-3 md:py-1.5 rounded-full z-10">
                        {product.tag}
                      </span>
                    )}
                    <img
                      src={getOptimizedUrl(product.img, { width: 600 })}
                      alt={product.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover mix-blend-multiply group-hover:scale-110 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"
                    />
                  </div>
                  <div className="flex flex-col flex-grow px-1 md:px-2">
                    <div className="flex flex-col justify-start items-start mb-4 md:mb-6 gap-2">
                      <div>
                        <h3 className="text-sm md:text-xl font-medium text-[#1A1A1A] mb-1 md:mb-1.5 truncate w-full">{product.name}</h3>
                        <p className="text-gray-500 uppercase tracking-widest text-[8px] md:text-[10px] font-semibold">{product.color}</p>
                      </div>
                      <div className="text-sm md:text-lg font-medium text-[#1A1A1A]">
                        {typeof product.price === 'number' ? `₹${product.price.toLocaleString('en-IN')}` : product.price}
                      </div>
                    </div>
                    <div className="mt-auto">
                      <button onClick={(e) => handleAdd(product, e)}
                        className="w-full py-2.5 md:py-3.5 bg-[#1A1A1A] text-white rounded-full flex items-center justify-center gap-1.5 md:gap-2 hover:bg-[#333] transition-colors text-[9px] md:text-[11px] font-semibold uppercase tracking-widest"
                      >
                        {isAdded ? <><Check className="w-3 h-3 md:w-4 md:h-4 text-green-400" /> Added</> : <><ShoppingBag className="w-3 h-3 md:w-4 md:h-4" /> Add to Cart</>}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <ToastNotification message={toastMessage} isVisible={showToast} onClose={() => setShowToast(false)} />
    </div>
  );
};

export default ShopPage;