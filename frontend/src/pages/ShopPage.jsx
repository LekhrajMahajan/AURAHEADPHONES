import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Check, Plus, Search } from 'lucide-react';
import ToastNotification from '../components/ToastNotification';

const ShopPage = ({ currentUser, addToCart, products = [], searchQuery = '' }) => {
  const navigate = useNavigate();


  const [addedId,     setAddedId]     = useState(null);
  const [toastMessage,setToastMessage]= useState('');
  const [showToast,   setShowToast]   = useState(false);



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
      <div className="max-w-7xl mx-auto px-6 md:px-16">

        {/* Shop Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 md:mb-24 gap-8">
          <div className="min-h-[160px] md:min-h-[220px]">
            {currentUser && (
              <span className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.2em] text-[#1A1A1A]/70 mb-4 block">
                Welcome back, {currentUser.name}
              </span>
            )}
            {searchQuery.trim() ? (
              <div>
                <h1 className="text-[3rem] md:text-[5rem] leading-[0.9] font-medium tracking-tighter text-[#1A1A1A]">
                  Results for
                </h1>
                <h2 className="text-[2rem] md:text-[3.5rem] font-medium tracking-tighter text-[#1A1A1A]/70 leading-tight">
                  "{searchQuery}"
                </h2>
              </div>
            ) : (
              <h1 className="text-[3.5rem] md:text-[6rem] lg:text-[7.5rem] leading-[0.9] font-medium tracking-tighter text-[#1A1A1A]">
                The<br />Collection
              </h1>
            )}
          </div>
          <p className="text-gray-700 text-lg md:text-xl font-light max-w-sm leading-relaxed">
            {searchQuery.trim()
              ? `${products.length} product${products.length !== 1 ? 's' : ''} found`
              : 'Discover our meticulously curated lineup. Engineered for uncompromised acoustic excellence.'
            }
          </p>
        </div>

        {searchQuery.trim() && products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[40px] shadow-sm border border-gray-100">
            <Search className="w-16 h-16 text-gray-300 mb-6" strokeWidth={1} />
            <h2 className="text-2xl font-medium text-[#1A1A1A] mb-3">No products found</h2>
            <p className="text-gray-600 mb-2">No results for "<span className="font-semibold text-[#1A1A1A]">{searchQuery}</span>"</p>
            <p className="text-gray-500 text-sm mb-8">Try searching with different keywords</p>
          </div>
        ) : (
          /* Product Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {products.map((product, index) => {
              const productId = product._id || product.id;
              const isAdded   = addedId === productId;

              return (
                <div
                  key={productId}
                  onClick={() => navigate(`/product/${productId}`)}
                  className="group flex flex-col bg-white rounded-[30px] p-5 shadow-sm hover:shadow-2xl transition-shadow duration-500 border border-gray-100 cursor-pointer transform-gpu will-change-transform"
                >
                  {/* Image */}
                  <div className="relative w-full aspect-square bg-[#F5F5F5] rounded-[20px] mb-6 overflow-hidden flex items-center justify-center p-6 transform-gpu">
                    {product.tag && (
                      <div className="absolute top-4 left-4 px-3 py-1.5 bg-[#1A1A1A] text-white text-[10px] uppercase tracking-widest font-semibold rounded-full z-10">
                        {product.tag}
                      </div>
                    )}
                    <img
                      src={`/${product.img}`}
                      alt={product.name}
                      {...(index < 4 ? { fetchpriority: "high" } : {})}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 transform-gpu will-change-transform"
                    />
                    {/* Quick Add */}
                    <div className="absolute bottom-6 right-6 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 transform-gpu">
                      <button onClick={(e) => handleAdd(product, e)}
                        aria-label={isAdded ? "Added to Cart" : "Add to Cart"}
                        className="w-14 h-14 bg-[#1A1A1A] text-white rounded-full flex items-center justify-center hover:bg-[#333] shadow-lg transition-colors"
                      >
                        {isAdded ? <Check className="w-6 h-6 text-green-400" /> : <Plus className="w-6 h-6" />}
                      </button>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex flex-col flex-grow px-2">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-xl font-medium text-[#1A1A1A] mb-1.5">{product.name}</h3>
                        <p className="text-gray-500 uppercase tracking-widest text-[10px] font-semibold">{product.color}</p>
                      </div>
                      <div className="text-lg font-medium text-[#1A1A1A]">
                        {typeof product.price === 'number' ? `₹${product.price.toLocaleString('en-IN')}` : product.price}
                      </div>
                    </div>
                    <div className="mt-auto">
                      <button onClick={(e) => handleAdd(product, e)}
                        className="w-full py-3.5 bg-[#1A1A1A] text-white rounded-full flex items-center justify-center gap-2 hover:bg-[#333] transition-colors text-[11px] font-semibold uppercase tracking-widest"
                      >
                        {isAdded ? <><Check className="w-4 h-4 text-green-400" /> Added</> : <><ShoppingBag className="w-4 h-4" /> Add to Cart</>}
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