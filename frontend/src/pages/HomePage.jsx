import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Headphones, ShoppingBag, Activity, Plus, Minus, Sparkles, Loader2, X, CheckCircle2 } from 'lucide-react';
import { auth } from '../config/firebase';

// ============================================================================
// PRODUCT DATA — price as number, Indian format
// ============================================================================
const PRODUCTS = [
  { id: 1, name: 'Aura Pro Studio', color: 'Ivory White', price: 3490, img: 'image8.jpg', tag: 'Bestseller' },
  { id: 2, name: 'Aura Elite ANC', color: 'Obsidian Black', price: 3990, img: 'image9.jpg', tag: 'New' },
  { id: 3, name: 'Aura Lite Wireless', color: 'Rose Quartz', price: 1990, img: 'image3.jpg', tag: null },
  { id: 4, name: 'Aura Play Gaming', color: 'Stealth Black', price: 2490, img: 'image4.jpg', tag: null },
  { id: 5, name: 'Aura Classic', color: 'Pearl White', price: 2990, img: 'image6.png', tag: null },
  { id: 6, name: 'Aura Command X', color: 'Carbon Chrome', price: 4490, img: 'image2.jpg', tag: 'Premium' },
  { id: 7, name: 'Aura DJ Master', color: 'Platinum Silver', price: 3290, img: 'image7.jpg', tag: null },
  { id: 8, name: 'Aura Air Minimalist', color: 'Bone White', price: 1790, img: 'image5.jpg', tag: null },
];

const ACCORDION_DATA = [
  { id: 'anc', title: 'Absolute Silence', content: 'Our proprietary Active Noise Cancellation adapts to your environment 100,000 times per second. Whether you are on a roaring flight or in a bustling cafe, experience nothing but pure, unadulterated sound.', img: 'image9.jpg' },
  { id: 'battery', title: 'Endless Playback', content: 'Engineered for the long haul. A single charge delivers up to 60 hours of high-fidelity listening. Need a quick boost? Just 5 minutes of charging provides 5 hours of continuous playback.', img: 'image7.jpg' },
  { id: 'materials', title: 'Premium Craftsmanship', content: 'Wrapped in ultra-soft memory foam and finished with aerospace-grade brushed aluminum. The ergonomic chassis distributes weight perfectly, ensuring you forget you are even wearing them.', img: 'image2.jpg' },
  { id: 'lifestyle', title: 'Expressive Design', content: 'Sound that matches your style. Available in a spectrum of meticulously curated colorways designed to make a statement while seamlessly integrating into your daily aesthetic.', img: 'image3.jpg' },
];

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

const AnimatedEqualizer = () => {
  return (
    <div className="w-24 md:w-32 h-[350px] md:h-[450px] border-4 border-white/60 rounded-[100px] p-6 flex items-end justify-center gap-2 relative shadow-lg bg-[#EAE8E3]/50 backdrop-blur-sm overflow-hidden">
      {[1, 2, 3, 4, 5].map((bar) => (
        <div
          key={bar}
          className="w-full bg-[#1A1A1A]/80 rounded-t-full rounded-b-sm"
          style={{
            height: '40%',
            animation: `eq-bar-${bar} ${1.2 + bar * 0.18}s ease-in-out infinite alternate`,
          }}
        />
      ))}
      <style>{`
        @keyframes eq-bar-1 { from { height: 20% } to { height: 80% } }
        @keyframes eq-bar-2 { from { height: 35% } to { height: 65% } }
        @keyframes eq-bar-3 { from { height: 55% } to { height: 90% } }
        @keyframes eq-bar-4 { from { height: 25% } to { height: 70% } }
        @keyframes eq-bar-5 { from { height: 15% } to { height: 60% } }
      `}</style>
      <div className="absolute top-8 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full border-[3px] border-[#1A1A1A]/20 flex items-center justify-center">
        <Activity className="w-4 h-4 text-[#1A1A1A]/50" />
      </div>
    </div>
  );
};

const FeatureAccordion = ({ activeItem, setActiveItem }) => {
  const [internalActive, setInternalActive] = useState('anc');
  const active = activeItem !== undefined ? activeItem : internalActive;
  const setActive = setActiveItem !== undefined ? setActiveItem : setInternalActive;

  const activeData = ACCORDION_DATA.find(item => item.id === active) || ACCORDION_DATA[0];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="border-b border-[#D6D5D0] pb-6 mb-10">
        <h4 className="text-[10px] md:text-xs font-semibold tracking-[0.2em] uppercase text-gray-500">The Aura Advantage</h4>
      </div>
      <div className="w-full h-[40vh] md:h-[65vh] mb-12 overflow-hidden rounded-[20px] md:rounded-[40px] shadow-lg bg-[#F5F5F5]">
        <img key={activeData.img} src={activeData.img} alt={activeData.title} loading="lazy" decoding="async" className="w-full h-full object-cover animate-[fade-in_0.5s_ease-out] mix-blend-multiply" />
      </div>
      <div className="flex flex-col">
        {ACCORDION_DATA.map((item) => (
          <div key={item.id} className="border-b border-[#D6D5D0]">
            <button className="w-full py-6 md:py-8 flex justify-between items-center text-left group cursor-pointer" onClick={() => setActive(item.id === active ? null : item.id)}>
              <span className={`text-3xl md:text-[3.5rem] font-semibold transition-colors duration-300 tracking-tight ${active === item.id ? 'text-[#1A1A1A]' : 'text-[#A8B0BB] group-hover:text-[#888D96]'}`}>
                {item.title}
              </span>
              <span className={`transition-transform duration-500 flex-shrink-0 ${active === item.id ? 'text-[#1A1A1A]' : 'text-[#A8B0BB]'}`}>
                {active === item.id ? <Minus className="w-8 h-8 md:w-10 md:h-10" strokeWidth={1} /> : <Plus className="w-8 h-8 md:w-10 md:h-10" strokeWidth={1} />}
              </span>
            </button>
            <div className={`grid transition-all duration-500 ease-in-out ${active === item.id ? 'grid-rows-[1fr] opacity-100 pb-8 md:pb-10' : 'grid-rows-[0fr] opacity-0 pb-0'}`}>
              <div className="overflow-hidden">
                <p className="text-gray-500 text-base md:text-lg leading-relaxed md:w-4/5">{item.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// MAIN HOME PAGE
// ============================================================================
const HomePage = ({ products = [] }) => {
  const navigate = useNavigate();

  // Refs for imperative parallax 
  const heroImgRef = useRef(null);
  const heroTextLRef = useRef(null);
  const heroTextRRef = useRef(null);
  const parallaxImgRef = useRef(null);

  // AI Modal States
  const [isPlannerOpen, setIsPlannerOpen] = useState(false);
  const [plannerPrompt, setPlannerPrompt] = useState('');
  const [plannerResult, setPlannerResult] = useState(null);
  const [isPlannerLoading, setIsPlannerLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  // Accordion state
  const [activeAccordion, setActiveAccordion] = useState('anc');

  // Toast state
  const [toast, setToast] = useState({ show: false, message: '' });
  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

  // Imperative scroll handler — mutates DOM directly, zero React re-renders
  useEffect(() => {
    let rafId;
    const handleScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const y = window.scrollY;
        if (heroImgRef.current) {
          heroImgRef.current.style.transform = `scale(${1 + y * 0.001}) translateY(${y * 0.08}px)`;
        }
        if (heroTextLRef.current) {
          heroTextLRef.current.style.transform = `translateY(${y * -0.05}px)`;
        }
        if (heroTextRRef.current) {
          heroTextRRef.current.style.transform = `translateY(${y * -0.05}px)`;
        }
        if (parallaxImgRef.current) {
          parallaxImgRef.current.style.transform = `translateY(${(y - 1500) * 0.15}px)`;
        }
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const handleAIConcierge = async () => {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) {
      showToast('Please login first to use AI Audiophile.');
      setTimeout(() => { setIsPlannerOpen(false); navigate('/login'); }, 1500);
      return;
    }

    if (!plannerPrompt.trim()) return;

    setIsPlannerLoading(true);
    setAiError('');

    try {
      const token = await firebaseUser.getIdToken();

      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/ai/recommend`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ prompt: plannerPrompt }),
        }
      );

      if (!response.ok) throw new Error('AI request failed');

      const result = await response.json();

      const matchedProduct = products.find(p =>
        p.name.toLowerCase() === result.modelRecommendation?.toLowerCase()
      ) || products[0] || PRODUCTS[0];

      setPlannerResult({ ...result, matchedProduct });

    } catch (err) {
      console.error('AI Error:', err);
      setAiError('Could not get AI recommendation. Please try again.');
    } finally {
      setIsPlannerLoading(false);
    }
  };

  return (
    <div className="animate-[fade-in_0.5s_ease-out]">

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes marquee { 0% { transform: translateX(0%); } 100% { transform: translateX(-50%); } }
        .animate-marquee { display: flex; flex-direction: row; width: fit-content; animation: marquee 35s linear infinite; }
        .animate-marquee:hover { animation-play-state: paused; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

      {/* ── HERO SECTION ─────────────────────────────────────── */}
      <section className="relative bg-[#EAE8E3] pt-32 md:pt-0 min-h-[100svh] flex items-center overflow-hidden">
        <div className="w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between z-10 py-12 md:py-0">

          <div ref={heroTextLRef} className="w-full md:w-1/3 flex flex-col items-center md:items-start text-center md:text-left mb-12 md:mb-0 order-2 md:order-1 min-h-[180px] md:min-h-[240px]">
            <h1 className="text-[3.5rem] md:text-[4.5rem] lg:text-[5.5rem] font-medium leading-[1] mb-6 text-[#1A1A1A] tracking-tight">
              Aura Pro<br />Studio
            </h1>
            <p className="text-gray-600 text-lg md:text-xl font-light leading-relaxed max-w-xs">
              Immerse yourself in pure resonance. Engineered with aerospace-grade materials and custom 50mm neodymium drivers for an acoustic experience unlike any other.
            </p>
          </div>

          <div className="w-full md:w-1/3 flex justify-center items-center relative h-[40vh] md:h-[70vh] order-1 md:order-2 mb-12 md:mb-0">
            <img ref={heroImgRef} src="image1.png" alt="Aura Pro Studio Headphones"
              className="w-[110%] md:w-[140%] max-w-none h-auto object-contain mix-blend-multiply drop-shadow-2xl will-change-transform"
            />
          </div>

          <div ref={heroTextRRef} className="w-full md:w-1/3 flex flex-col items-center md:items-end text-center md:text-right mt-4 md:mt-0 order-3">
            <div className="inline-block px-5 py-2 bg-[#1A1A1A] text-white text-[10px] md:text-xs uppercase tracking-widest font-semibold rounded-full mb-8 shadow-md">Bestseller</div>
            <ul className="space-y-4 mb-10 text-gray-700 text-sm md:text-base font-medium w-full md:w-auto">
              {['Adaptive Noise Cancellation', '60-Hour Battery Life', 'Lossless Bluetooth 5.3', 'Ultra-Soft Memory Foam'].map(f => (
                <li key={f} className="flex items-center gap-3 justify-center md:justify-end">
                  <span className="md:hidden w-1.5 h-1.5 bg-[#1A1A1A] rounded-full"></span>
                  {f}
                  <span className="hidden md:block w-1.5 h-1.5 bg-[#1A1A1A] rounded-full"></span>
                </li>
              ))}
            </ul>
            <button onClick={() => navigate('/shop')} className="pointer-events-auto px-8 md:px-10 py-4 bg-[#1A1A1A] text-white rounded-full uppercase tracking-widest text-xs md:text-sm font-semibold hover:bg-black transition-all hover:scale-105 shadow-xl flex items-center justify-center gap-3 w-full md:w-auto">
              <ShoppingBag className="w-4 h-4 md:w-5 md:h-5" /> Shop Collection
            </button>
          </div>
        </div>
      </section>

      {/* ── AI ASSISTANT BANNER ──────────────────────────────────── */}
      <section className="bg-[#EAE8E3] px-6 md:px-16 pt-16">
        <div className="max-w-7xl mx-auto w-full bg-[#1A1A1A] rounded-[30px] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 text-white shadow-2xl">
          <div className="flex-1">
            <h3 className="text-2xl md:text-4xl font-medium mb-4 flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-[#4a80b4]" /> Not sure which to pick?
            </h3>
            <p className="text-white/70 text-lg font-light leading-relaxed">
              Let our AI Audiophile analyze your listening habits and find your perfect match.
            </p>
          </div>
          <button
            onClick={() => { setIsPlannerOpen(true); setPlannerResult(null); setPlannerPrompt(''); setAiError(''); }}
            className="px-8 py-4 bg-white text-[#1A1A1A] rounded-full uppercase tracking-widest text-sm font-semibold hover:scale-105 transition-transform whitespace-nowrap"
          >
            Find My Match
          </button>
        </div>
      </section>

      {/* ── ABOUT SECTION ─────────────────────────────────────── */}
      <section className="bg-[#1A1A1A] text-white px-6 py-24 md:px-16 md:py-40 relative z-20 mt-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-[2.2rem] md:text-[4.5rem] lg:text-[5.5rem] leading-[1.05] font-medium mb-16 md:mb-32 tracking-tight max-w-[90%] md:max-w-[85%] text-white/90">
            Aura Headphones<span className="text-[1rem] md:text-[2rem] align-top relative -top-2 md:-top-6 text-white/50">®</span> is engineered for the purists. With over 10,000 hours of acoustic refinement, our headphones are trusted by multi-platinum producers and audiophiles worldwide.
          </h2>
          <div className="flex items-center gap-6 mb-20 md:mb-32 border-b border-white/10 pb-12">
            <div className="flex items-center gap-3">
              <Headphones className="w-8 h-8 md:w-12 md:h-12 opacity-60" strokeWidth={1.5} />
              <div className="text-3xl md:text-5xl font-medium tracking-tight opacity-90">Aura</div>
            </div>
            <div className="flex flex-col opacity-60 ml-4 border-l border-white/20 pl-6">
              <span className="text-[10px] md:text-xs uppercase font-medium tracking-[0.2em] leading-relaxed">Designed in<br />Los Angeles</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32">
            <div>
              <h3 className="text-3xl md:text-[2.5rem] font-medium mb-6 md:mb-8 leading-tight">Studio Quality<br />Delivered to You</h3>
              <div className="w-8 h-[2px] bg-white mb-8 md:mb-10 opacity-60"></div>
              <p className="text-white/60 text-lg md:text-[1.3rem] leading-relaxed font-light">Break free from the studio without leaving the sound behind. Browse our online boutique and have our custom 50mm neodymium drivers shipped directly to your door.</p>
            </div>
            <div>
              <h3 className="text-3xl md:text-[2.5rem] font-medium mb-6 md:mb-8 leading-tight">Your Soundtrack,<br />Your Rules</h3>
              <div className="w-8 h-[2px] bg-white mb-8 md:mb-10 opacity-60"></div>
              <p className="text-white/60 text-lg md:text-[1.3rem] leading-relaxed font-light">We value your immersion above all else. Buying an Aura headset gives you the freedom to move, create, and escape on terms dictated only by you — without acoustic compromise.</p>
            </div>
          </div>
        </div>
      </section>

      {/* E-COMMERCE FOCUS SECTION */}
      <section className="bg-[#EAE8E3] pt-24 md:pt-40 pb-16 px-6 md:px-16 overflow-hidden relative z-20">
        <div className="max-w-7xl mx-auto relative flex flex-col">
          <div className="relative z-20 mb-10 md:mb-0">
            <h2 className="text-[4rem] md:text-[8.5rem] lg:text-[11rem] leading-[0.85] font-medium tracking-tighter text-[#1A1A1A]">
              Elevate Your<br />Sound
            </h2>
          </div>

          <div className="relative w-full flex justify-center mt-0 md:-mt-[10%] mb-20 md:mb-32 z-10 pointer-events-none">
            <img
              ref={parallaxImgRef}
              src="image8.jpg"
              alt="Aura Headphones Front View"
              loading="lazy"
              decoding="async"
              className="w-[120%] md:w-[90%] max-w-4xl h-auto object-cover rounded-[30px] md:rounded-[50px] mix-blend-multiply will-change-transform"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-end pb-12 border-b border-[#D6D5D0]">
            <div className="md:col-span-5">
              <h3 className="text-3xl md:text-5xl font-medium leading-tight text-[#1A1A1A]">Invest in<br />Acoustic<br />Brilliance</h3>
            </div>
            <div className="md:col-span-7 flex justify-between text-xs md:text-sm font-semibold tracking-[0.2em] uppercase text-gray-500 w-full">
              <div>AURA AUDIO</div>
              <div>ONLINE BOUTIQUE</div>
            </div>
          </div>

          <div className="mt-8 md:mt-12 text-lg md:text-[1.3rem] text-gray-600 max-w-4xl leading-relaxed font-light">
            Browse our meticulously engineered collection of high-fidelity headphones. From studio monitoring to casual wireless listening, find the perfect companion for your daily soundtrack. Experience premium materials, industry-leading noise cancellation, and unparalleled comfort with every purchase.
          </div>
        </div>
      </section>

      {/* SPECS SECTION */}
      <section className="bg-[#EAE8E3] px-6 py-20 md:py-32 md:px-16 relative z-20">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 md:gap-32 relative">
          <div className="lg:w-5/12">
            <div className="lg:sticky lg:top-32 h-[50vh] md:h-[70vh] flex items-center justify-center bg-[#DFDDD7] rounded-[40px] md:rounded-[60px] p-8">
              <AnimatedEqualizer />
            </div>
          </div>

          <div className="lg:w-7/12 flex flex-col justify-center">
            <h2 className="text-[2.5rem] md:text-[4rem] font-medium mb-12 leading-[1.1]">High-Fidelity<br />Architecture</h2>
            <h4 className="text-[10px] md:text-xs font-semibold tracking-[0.2em] uppercase mb-8 text-gray-500">Direct Access to Pure Sound</h4>
            <p className="text-xl md:text-[1.7rem] leading-relaxed mb-16 font-light text-[#1A1A1A]">
              A true time-stopping machine. It brings the recording studio directly to your ears, revealing textures and layers in your music that standard drivers simply cannot reproduce.
            </p>

            <div className="w-full h-[1px] bg-[#D6D5D0] mb-12"></div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-16 text-sm">
              <div>
                <div className="text-gray-500 uppercase tracking-[0.15em] mb-3 text-[10px] md:text-xs font-semibold">Frequency Response</div>
                <div className="font-medium text-lg md:text-xl">5 Hz - 40,000 Hz</div>
              </div>
              <div>
                <div className="text-gray-500 uppercase tracking-[0.15em] mb-3 text-[10px] md:text-xs font-semibold">Impedance</div>
                <div className="font-medium text-lg md:text-xl">32 OHMS</div>
              </div>
              <div>
                <div className="text-gray-500 uppercase tracking-[0.15em] mb-3 text-[10px] md:text-xs font-semibold">Driver Configuration</div>
                <div className="font-medium text-lg md:text-xl pr-4 leading-snug">50MM CUSTOM NEODYMIUM</div>
              </div>
              <div>
                <div className="text-gray-500 uppercase tracking-[0.15em] mb-3 text-[10px] md:text-xs font-semibold">Connectivity</div>
                <div className="font-medium text-lg md:text-xl pr-4 leading-snug">BLUETOOTH 5.3 / WIRED 3.5MM</div>
              </div>
            </div>

            <div className="mt-20 border-t border-[#D6D5D0] pt-12">
              <div className="text-gray-500 uppercase tracking-[0.15em] mb-8 text-[10px] md:text-xs font-semibold">Physical Specs</div>
              <div className="grid grid-cols-2 gap-y-6 text-sm md:text-base font-medium">
                <div>WEIGHT</div><div className="text-right">250 G</div>
                <div className="w-full h-[1px] bg-[#D6D5D0] col-span-2"></div>
                <div>CLAMPING FORCE</div><div className="text-right">4.5 N</div>
                <div className="w-full h-[1px] bg-[#D6D5D0] col-span-2"></div>
                <div>BATTERY LIFE</div><div className="text-right">60 HOURS</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE ACCORDION SECTION */}
      <section className="bg-[#EAE8E3] px-6 py-20 md:py-32 md:px-16 border-t border-[#D6D5D0] relative z-20">
        <FeatureAccordion activeItem={activeAccordion} setActiveItem={setActiveAccordion} />
      </section>

      {/* 6. MARQUEE & STATS SECTION */}
      <section className="bg-[#0A0A0A] text-white px-6 py-24 md:py-48 md:px-16 relative overflow-hidden z-20">
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
          <div className="w-[150%] h-[150%] rounded-full border-[100px] border-white blur-[20px]"></div>
          <div className="absolute w-[100%] h-[100%] rounded-full border-[50px] border-white blur-[10px]"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start mb-32 md:mb-56">
            <div className="flex gap-16 md:gap-32 text-sm mb-20 md:mb-0">
              <div>
                <div className="text-gray-500 uppercase tracking-[0.2em] mb-4 text-[10px] md:text-xs font-semibold">Global Users</div>
                <div className="font-medium text-4xl md:text-5xl tracking-tight">100K+</div>
              </div>
              <div>
                <div className="text-gray-500 uppercase tracking-[0.2em] mb-4 text-[10px] md:text-xs font-semibold">Avg. Playtime</div>
                <div className="font-medium text-4xl md:text-5xl tracking-tight mb-4">5.2H</div>
                <div className="text-[10px] md:text-xs text-gray-500 font-semibold tracking-[0.2em] uppercase">Per Day</div>
              </div>
            </div>

            <div className="bg-[#1A1A1A] text-white border border-white/10 p-10 md:p-14 max-w-sm rounded-[30px] shadow-2xl md:-translate-y-10">
              <h3 className="text-6xl md:text-[5rem] font-medium tracking-tighter mb-6 leading-none">10K+<br />Reviews</h3>
              <div className="w-12 h-[2px] bg-white/20 mb-8"></div>
              <div className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-8 border-b border-white/10 pb-6">Five Star Ratings</div>
              <p className="text-sm md:text-base leading-relaxed text-gray-400 font-light">
                Each pair reflects years of expertise, precision, and trust. From studio monitoring to casual listening — Aura ensures immersion, comfort, and excellence in every track.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center pt-10 text-center w-full overflow-hidden">
            <h2 className="text-3xl md:text-5xl font-medium mb-16">Experience</h2>
            <Headphones className="w-6 h-6 md:w-8 md:h-8 text-gray-600 mb-20 md:mb-32" strokeWidth={1} />

            <div className="w-[100vw] relative left-1/2 -translate-x-1/2 overflow-hidden flex">
              <div className="animate-marquee gap-16 md:gap-32 pr-16 md:pr-32 text-5xl md:text-[6rem] font-medium text-gray-700 whitespace-nowrap">
                {Array(2).fill(['Spatial Audio', 'Deep Bass', 'Zero Latency', 'Lossless Bluetooth', 'Pure Silence']).flat().map((feature, i) => (
                  <span key={i} className={`relative flex items-center gap-8 md:gap-16 ${['Deep Bass', 'Lossless Bluetooth'].includes(feature) ? 'text-white' : 'opacity-40'}`}>
                    {feature}
                    {['Deep Bass', 'Lossless Bluetooth'].includes(feature) && <div className="w-3 h-3 md:w-4 md:h-4 bg-white rounded-full"></div>}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── AI SOUND MATCH MODAL ─────────────────────────────────── */}
      <div className={`fixed inset-0 bg-[#EAE8E3]/95 backdrop-blur-2xl z-[150] flex items-center justify-center transition-all duration-700 overflow-y-auto py-10 px-4 md:py-16 ${isPlannerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <button onClick={() => setIsPlannerOpen(false)} aria-label="Close AI Audiophile" className="absolute top-6 right-6 p-3.5 rounded-full bg-black/5 hover:bg-black/10 transition-colors z-10">
          <X className="w-6 h-6 text-black" strokeWidth={1.5} />
        </button>

        <div className="w-full max-w-4xl my-auto">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-4xl md:text-[4rem] font-medium tracking-tight mb-6 flex items-center justify-center gap-4">
              <Sparkles className="w-8 h-8 md:w-12 md:h-12 text-[#1A1A1A]" /> AI Audiophile
            </h2>
            <p className="text-gray-500 text-base md:text-xl max-w-2xl mx-auto px-4 font-light leading-relaxed">
              Describe how you listen. Our AI will analyze your habits and recommend the perfect Aura model for your specific sound profile.
            </p>
          </div>

          {/* Input State */}
          {!plannerResult ? (
            <div className="flex flex-col gap-6 md:gap-10 max-w-3xl mx-auto">
              <textarea
                value={plannerPrompt}
                onChange={(e) => setPlannerPrompt(e.target.value)}
                placeholder="E.g., I listen to bass-heavy EDM while commuting, I need long battery life and noise cancellation. Budget around ₹3000..."
                className="w-full bg-white p-8 md:p-10 rounded-[30px] text-xl md:text-2xl outline-none focus:ring-2 focus:ring-[#1A1A1A] transition-all min-h-[200px] md:min-h-[250px] resize-none hide-scrollbar font-light shadow-sm"
              />

              {/* Error */}
              {aiError && (
                <div className="bg-red-50 text-red-500 p-4 rounded-2xl text-center text-sm font-medium">
                  {aiError}
                </div>
              )}

              <button
                onClick={handleAIConcierge}
                disabled={isPlannerLoading || !plannerPrompt.trim()}
                className="bg-[#1A1A1A] text-white py-4 px-8 md:py-6 md:px-12 rounded-full text-lg md:text-xl font-medium tracking-wide hover:bg-[#333] transition-colors disabled:opacity-50 flex items-center justify-center gap-3 w-full md:w-auto md:mx-auto shadow-xl"
              >
                {isPlannerLoading
                  ? <><Loader2 className="w-6 h-6 animate-spin" /> Analyzing your sound profile...</>
                  : <><Sparkles className="w-6 h-6" /> Find My Sound</>
                }
              </button>
            </div>
          ) : (
            /* Result State */
            <div className="bg-white rounded-[30px] md:rounded-[40px] p-8 md:p-16 shadow-2xl animate-[fade-in_0.5s_ease-out]">

              {/* Product Image + Name */}
              <div className="flex flex-col md:flex-row gap-8 md:gap-16 mb-10 md:mb-16 pb-10 md:pb-16 border-b border-[#D6D5D0]">
                {plannerResult.matchedProduct && (
                  <div className="w-full md:w-48 h-48 bg-[#F5F5F5] rounded-[24px] flex items-center justify-center p-6 flex-shrink-0 mx-auto md:mx-0">
                    <img
                      src={`/${plannerResult.matchedProduct.img}`}
                      alt={plannerResult.modelRecommendation}
                      className="w-full h-full object-cover mix-blend-multiply"
                    />
                  </div>
                )}
                <div className="flex flex-col justify-center">
                  <h3 className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 mb-3">
                    ✦ AI Recommended
                  </h3>
                  <h4 className="text-3xl md:text-[3rem] font-medium mb-4 text-[#1A1A1A] leading-tight">
                    {plannerResult.modelRecommendation}
                  </h4>
                  {plannerResult.matchedProduct && (
                    <p className="text-2xl font-medium text-[#1A1A1A] mb-4">
                      ₹{plannerResult.matchedProduct.price.toLocaleString('en-IN')}
                    </p>
                  )}
                  <p className="text-gray-600 text-base md:text-lg leading-relaxed font-light">
                    {plannerResult.reason}
                  </p>
                </div>
              </div>

              {/* Profile Match */}
              <h3 className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 mb-8 md:mb-10">
                Your Acoustic Profile Match
              </h3>
              <div className="space-y-6 md:space-y-8">
                {plannerResult.profile?.map((prof, idx) => (
                  <div key={idx} className="flex flex-col md:flex-row gap-2 md:gap-6 items-start">
                    <div className="md:w-1/3 text-base md:text-lg font-medium text-[#1A1A1A]">{prof.attribute}</div>
                    <div className="md:w-2/3 text-gray-600 text-base md:text-lg font-light leading-relaxed">{prof.detail}</div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="mt-12 md:mt-16 pt-8 md:pt-10 border-t border-[#D6D5D0] flex flex-col md:flex-row gap-4 justify-end">
                <button
                  onClick={() => { setPlannerResult(null); setAiError(''); }}
                  className="px-8 py-4 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors font-medium text-base text-center"
                >
                  Try Again
                </button>
                <button
                  onClick={() => {
                    setIsPlannerOpen(false);
                    navigate(`/product/${plannerResult.matchedProduct?._id || plannerResult.matchedProduct?.id || ''}`);
                  }}
                  className="px-8 py-4 rounded-full bg-[#1A1A1A] text-white hover:bg-[#333] transition-colors font-medium flex items-center justify-center gap-3 text-base shadow-xl"
                >
                  <ShoppingBag className="w-5 h-5" /> View Product
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── TOAST NOTIFICATION ───────────────────────────────────── */}
      <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 bg-[#1A1A1A] text-white px-6 py-4 rounded-2xl shadow-2xl border border-white/10 transition-all duration-500 ${toast.show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}>
        <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
        <p className="text-sm font-medium">{toast.message}</p>
      </div>

    </div>
  );
};

export default React.memo(HomePage);