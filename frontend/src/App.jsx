import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './config/firebase';
import { syncUserWithBackend, fetchProducts } from './services/api';
import { PRODUCTS as STATIC_PRODUCTS } from './utils/data';
import useScrollSmoother from './utils/useScrollSmoother';
import { getOptimizedUrl } from './utils/cloudinary';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
const HomePage = lazy(() => import('./pages/HomePage'));
const ShopPage = lazy(() => import('./pages/ShopPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const OrderPage = lazy(() => import('./pages/OrderPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const ProductDetailsPage = lazy(() => import('./pages/ProductDetailsPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));

const getCartKey = (userId) => `aura_cart_${userId || 'guest'}`;

function AppWrapper() {
  const navigate = useNavigate();
  const location = useLocation();

  useScrollSmoother();

  const [cartItems, setCartItems] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [products, setProducts] = useState(STATIC_PRODUCTS);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const cartKeyRef = useRef(getCartKey(null));

  useEffect(() => {
    if (productsLoaded) return;
    fetchProducts()
      .then(data => { if (Array.isArray(data) && data.length > 0) setProducts(data); })
      .catch(() => { })
      .finally(() => setProductsLoaded(true));
  }, [productsLoaded]);

  useEffect(() => {
    products.forEach(product => {
      if (product.img) {
        const img = new Image();
        img.src = getOptimizedUrl(product.img, { width: 600 });
      }
    });
  }, [products]);

  // ── Firebase Auth ──────────────────────────────────────────
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        if (!firebaseUser.emailVerified) {
          await signOut(auth);
          setCurrentUser(null);
          setAuthLoading(false);
          return;
        }
        try {
          const backendUser = await syncUserWithBackend(firebaseUser);
          setCurrentUser(backendUser);

          const key = getCartKey(backendUser._id || firebaseUser.uid);
          cartKeyRef.current = key;
          const saved = localStorage.getItem(key);
          if (saved) {
            try { setCartItems(JSON.parse(saved)); } catch { setCartItems([]); }
          }
        } catch (err) {
          console.error('User sync failed:', err);
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
        cartKeyRef.current = getCartKey(null);
        setCartItems([]);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem(cartKeyRef.current, JSON.stringify(cartItems));
  }, [cartItems]);

  // ── Logout ────────────────────────────────────────────────
  const handleLogout = async () => {
    try { await signOut(auth); } catch (err) { console.error(err); }
    setCurrentUser(null);
    setCartItems([]);
    cartKeyRef.current = getCartKey(null);
    navigate('/');
  };

  // ── Cart Functions ─────────────────────────────────────────
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const addToCart = (product) => {
    setCartItems(prev => {
      const productId = product._id || product.id;
      const exists = prev.find(item => (item._id || item.id) === productId);
      if (exists) {
        return prev.map(item =>
          (item._id || item.id) === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, change) => {
    setCartItems(prev => prev.map(item => {
      const itemId = item._id || item.id;
      if (itemId === id) return { ...item, quantity: Math.max(1, item.quantity + change) };
      return item;
    }));
  };

  const removeItem = (id) => {
    setCartItems(prev => prev.filter(item => (item._id || item.id) !== id));
  };

  const handleOrderCreation = () => {
    setCartItems([]);
    localStorage.removeItem(cartKeyRef.current);
  };

  // ── Search ────────────────────────────────────────────────
  const handleSearch = (query) => setSearchQuery(query);

  const filteredProducts = searchQuery.trim()
    ? products.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.color.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.tag && p.tag.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    : products;

  // ── Scroll Effects ─────────────────────────────────────────
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [location.pathname]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#EAE8E3] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#1A1A1A] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div
      className="text-[#1A1A1A] antialiased bg-[#EAE8E3] min-h-screen selection:bg-[#1A1A1A] selection:text-white overflow-x-hidden"
      style={{ fontFamily: "'Outfit', sans-serif" }}
    >
      <Navbar
        cartCount={cartCount}
        currentUser={currentUser}
        handleLogout={handleLogout}
        products={products}
        onSearch={handleSearch}
      />

      <main>
        <Suspense fallback={<div className="min-h-screen bg-[#EAE8E3] flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#1A1A1A] border-t-transparent rounded-full animate-spin"></div></div>}>
          <Routes>
            <Route path="/" element={<HomePage products={products} />} />

            <Route path="/shop" element={
              <ShopPage
                currentUser={currentUser}
                addToCart={addToCart}
                products={filteredProducts}
                searchQuery={searchQuery}
              />
            } />

            <Route path="/product/:id" element={
              <ProductDetailsPage
                currentUser={currentUser}
                addToCart={addToCart}
                products={products}
              />
            } />

            <Route path="/cart" element={
              <CartPage
                cartItems={cartItems}
                updateQuantity={updateQuantity}
                removeItem={removeItem}
              />
            } />

            <Route path="/checkout" element={
              <CheckoutPage
                cartItems={cartItems}
                onOrderComplete={handleOrderCreation}
              />
            } />

            <Route path="/orders" element={<OrderPage />} />
            <Route path="/profile" element={<ProfilePage currentUser={currentUser} setCurrentUser={setCurrentUser} />} />
            <Route path="/login" element={<LoginPage setCurrentUser={setCurrentUser} />} />
            <Route path="/signup" element={<SignupPage setCurrentUser={setCurrentUser} />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />

      {/* Floating Cart Button */}
      {!['/cart', '/login', '/signup', '/checkout', '/orders', '/profile'].includes(location.pathname) && (
        <button
          onClick={() => navigate('/cart')}
          className="fixed bottom-6 right-6 md:bottom-12 md:right-12 z-40 w-14 h-14 md:w-20 md:h-20 bg-[#1A1A1A] text-white rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.3)] flex items-center justify-center hover:scale-110 transition-transform duration-300"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 md:w-7 md:h-7" strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 md:-top-2 md:-right-2 bg-white text-[#1A1A1A] text-[9px] md:text-[10px] font-bold w-4 h-4 md:w-5 md:h-5 flex items-center justify-center rounded-full shadow-sm">
                {cartCount}
              </span>
            )}
          </div>
        </button>
      )}
    </div>
  );
}

export default function App() {
  return <Router><AppWrapper /></Router>;
}