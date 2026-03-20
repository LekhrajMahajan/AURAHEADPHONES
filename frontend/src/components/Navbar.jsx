import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, LogOut, Package, Search, X } from 'lucide-react';

const Navbar = ({ scrollY = 0, cartCount = 0, currentUser, handleLogout, products = [], onSearch }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [searchOpen,  setSearchOpen]  = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const inputRef = useRef(null);

  const isScrolled   = scrollY > 50;
  const navLinkClass = "text-sm font-bold uppercase tracking-widest hover:text-gray-500 transition-colors flex items-center gap-2 cursor-pointer";

  // Focus input when search opens
  useEffect(() => {
    if (searchOpen && inputRef.current) inputRef.current.focus();
  }, [searchOpen]);

  // ESC to close
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') closeSearch(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim().length > 0) {
      const filtered = products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.color.toLowerCase().includes(query.toLowerCase()) ||
        (p.tag && p.tag.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 5);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }

    if (onSearch) onSearch(query);
  };

  const handleSuggestionClick = (product) => {
    const productId = product._id || product.id;
    closeSearch();
    navigate(`/product/${productId}`);
  };

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      navigate('/shop');
      if (onSearch) onSearch(searchQuery);
      setSuggestions([]);
    }
  };

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchQuery('');
    setSuggestions([]);
    if (onSearch) onSearch('');
  };

  const formatPrice = (price) =>
    typeof price === 'number' ? `₹${price.toLocaleString('en-IN')}` : price;

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-[100] px-6 py-6 md:px-12 flex justify-between items-center transition-all duration-300 ${
        isScrolled ? 'bg-[#EAE8E3]/95 backdrop-blur-md shadow-sm py-4 md:py-4' : 'bg-transparent'
      }`}>

        {/* Logo */}
        <div className="text-[#1A1A1A] z-10">
          <Link to="/" onClick={closeSearch} className="text-2xl font-bold tracking-[0.2em] uppercase hover:opacity-80 transition-opacity">
            AURA
          </Link>
        </div>

        {/* ✅ Animated Search Bar */}
        <div className={`absolute left-0 right-0 px-6 md:px-12 transition-all duration-500 ease-in-out ${
          searchOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}>
          <form onSubmit={handleSearchSubmit} className="relative max-w-2xl mx-auto">
            <div className="flex items-center bg-white rounded-full shadow-xl border border-gray-100 overflow-hidden">
              <Search className="w-5 h-5 text-gray-400 ml-6 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search headphones, colors, tags..."
                className="flex-1 px-4 py-4 text-[#1A1A1A] text-sm font-medium outline-none bg-transparent placeholder:text-gray-400"
              />
              {searchQuery && (
                <button type="button"
                  aria-label="Clear Search"
                  onClick={() => { setSearchQuery(''); setSuggestions([]); if (onSearch) onSearch(''); inputRef.current?.focus(); }}
                  className="p-2 mr-2 text-gray-400 hover:text-[#1A1A1A] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* ✅ Dropdown suggestions */}
            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-[20px] shadow-2xl border border-gray-100 overflow-hidden z-[200]">
                {suggestions.map((product) => {
                  const productId = product._id || product.id;
                  return (
                    <button key={productId} type="button" onClick={() => handleSuggestionClick(product)}
                      className="w-full flex items-center gap-4 px-6 py-4 hover:bg-[#F5F5F5] transition-colors text-left group"
                    >
                      <div className="w-12 h-12 bg-[#F5F5F5] rounded-xl flex items-center justify-center p-1.5 flex-shrink-0 group-hover:bg-white transition-colors">
                        <img src={`/${product.img}`} alt={product.name} className="w-full h-full object-cover mix-blend-multiply" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#1A1A1A] truncate">{product.name}</p>
                        <p className="text-xs text-gray-500 uppercase tracking-widest">{product.color}</p>
                      </div>
                      <p className="text-sm font-medium text-[#1A1A1A] flex-shrink-0">{formatPrice(product.price)}</p>
                      {product.tag && (
                        <span className="text-[10px] font-semibold uppercase tracking-widest bg-[#1A1A1A] text-white px-2 py-1 rounded-full flex-shrink-0">
                          {product.tag}
                        </span>
                      )}
                    </button>
                  );
                })}
                {/* See all results */}
                <button type="submit" onClick={handleSearchSubmit}
                  className="w-full px-6 py-4 text-sm font-semibold text-[#1A1A1A] hover:bg-[#F5F5F5] transition-colors text-left border-t border-gray-100 flex items-center gap-2"
                >
                  <Search className="w-4 h-4 text-gray-400" />
                  See all results for <span className="underline underline-offset-2 ml-1">"{searchQuery}"</span>
                </button>
              </div>
            )}

            {/* No results */}
            {searchQuery.trim() && suggestions.length === 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-[20px] shadow-2xl border border-gray-100 px-6 py-5 z-[200]">
                <p className="text-sm text-gray-500 font-medium">
                  No products found for "<span className="text-[#1A1A1A] font-semibold">{searchQuery}</span>"
                </p>
              </div>
            )}
          </form>
        </div>

        {/* Nav links */}
        <nav className={`flex items-center gap-6 md:gap-10 text-[#1A1A1A] transition-all duration-300 ${
          searchOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}>

          <Link to="/shop" className={`${navLinkClass} ${location.pathname === '/shop' ? 'border-b-2 border-[#1A1A1A] pb-0.5' : ''}`}>
            SHOP
          </Link>

          {currentUser && (
            <>
              <Link to="/orders" className={`${navLinkClass} ${location.pathname === '/orders' ? 'border-b-2 border-[#1A1A1A] pb-0.5' : ''}`}>
                <Package className="w-5 h-5 mb-0.5" strokeWidth={1.5} />
                <span className="hidden md:inline">ORDERS</span>
              </Link>
              <Link to="/profile" className={`${navLinkClass} ${location.pathname === '/profile' ? 'border-b-2 border-[#1A1A1A] pb-0.5' : ''}`}>
                <User className="w-5 h-5 mb-0.5" strokeWidth={1.5} />
                <span className="hidden md:inline">PROFILE</span>
              </Link>
            </>
          )}

          {/* ✅ Search Icon */}
          <button
            onClick={() => { setSearchOpen(true); if (location.pathname !== '/shop') navigate('/shop'); }}
            className={navLinkClass}
            title="Search products"
          >
            <Search className="w-5 h-5 mb-0.5" strokeWidth={1.5} />
            <span className="hidden md:inline">SEARCH</span>
          </button>

          <Link to="/cart" className={`${navLinkClass} ${location.pathname === '/cart' ? 'border-b-2 border-[#1A1A1A] pb-0.5' : ''}`}>
            <div className="relative">
              <ShoppingBag className="w-5 h-5 mb-0.5" strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[#1A1A1A] text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="hidden md:inline">CART</span>
          </Link>

          {currentUser ? (
            <button onClick={handleLogout} className={navLinkClass}>
              <LogOut className="w-5 h-5 mb-0.5" strokeWidth={1.5} />
              <span className="hidden md:inline">LOGOUT</span>
            </button>
          ) : (
            <Link to="/login" className={`${navLinkClass} ${location.pathname === '/login' || location.pathname === '/signup' ? 'border-b-2 border-[#1A1A1A] pb-0.5' : ''}`}>
              <User className="w-5 h-5 mb-0.5" strokeWidth={1.5} />
              <span className="hidden md:inline">LOGIN</span>
            </Link>
          )}
        </nav>

        {/* X button when search is open */}
        {searchOpen && (
          <button onClick={closeSearch} aria-label="Close Search" className="absolute right-6 md:right-12 z-10 p-2 rounded-full hover:bg-black/5 transition-colors">
            <X className="w-6 h-6 text-[#1A1A1A]" strokeWidth={1.5} />
          </button>
        )}
      </header>

      {/* Backdrop overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-[90] bg-black/10 backdrop-blur-sm" onClick={closeSearch} />
      )}
    </>
  );
};

export default Navbar;