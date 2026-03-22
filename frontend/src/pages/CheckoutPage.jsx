import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Wallet, Truck, ChevronLeft, ShieldCheck, Loader2, Lock } from 'lucide-react';
import { placeOrder } from '../services/api';

// ── Card Field Formatters ──────────────────────────────────────

// Card number: 16 digits, groups of 4 — "1234 5678 9012 3456"
const formatCardNumber = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(.{4})/g, '$1 ').trim();
};

// Expiry: MM/YY format — auto slash insert
const formatExpiry = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  if (digits.length === 2 && value.length > 2) {
    return `${digits}/`;
  }
  return digits;
};

// CVV: exactly 3 digits
const formatCVV = (value) => value.replace(/\D/g, '').slice(0, 3);

// Detect card type from first digits
const getCardType = (number) => {
  const digits = number.replace(/\D/g, '');
  if (/^4/.test(digits))        return 'visa';
  if (/^5[1-5]/.test(digits))   return 'mastercard';
  if (/^3[47]/.test(digits))    return 'amex';
  if (/^6/.test(digits))        return 'rupay';
  return null;
};

const CardTypeBadge = ({ type }) => {
  if (!type) return null;
  const labels = { visa: 'VISA', mastercard: 'MC', amex: 'AMEX', rupay: 'RuPay' };
  return (
    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold tracking-widest text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
      {labels[type]}
    </span>
  );
};

// ── Main Component ─────────────────────────────────────────────

const CheckoutPage = ({ cartItems, onOrderComplete }) => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing,  setIsProcessing]  = useState(false);
  const [orderError,    setOrderError]    = useState('');

  // Card fields state
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV,    setCardCVV]    = useState('');
  const [cardName,   setCardName]   = useState('');
  const [cardErrors, setCardErrors] = useState({});

  // Shipping refs
  const fullNameRef = useRef();
  const emailRef    = useRef();
  const streetRef   = useRef();
  const cityRef     = useRef();
  const pincodeRef  = useRef();

  const cardType = getCardType(cardNumber);

  const subtotal = cartItems.reduce((sum, item) => {
    const price    = parseFloat(String(item.price).replace(/\D/g, '')) || 0;
    const quantity = item.quantity || 1;
    return sum + price * quantity;
  }, 0);

  // ── Card Validation ────────────────────────────────────────
  const validateCard = () => {
    const errors = {};
    const rawNumber = cardNumber.replace(/\s/g, '');

    if (!cardName.trim()) {
      errors.name = 'Cardholder name required';
    }
    if (rawNumber.length !== 16) {
      errors.number = 'Card number must be 16 digits';
    }
    if (cardExpiry.length !== 5) {
      errors.expiry = 'Enter valid expiry (MM/YY)';
    } else {
      const [mm, yy] = cardExpiry.split('/');
      const month = parseInt(mm, 10);
      const year  = parseInt(`20${yy}`, 10);
      const now   = new Date();
      if (month < 1 || month > 12) {
        errors.expiry = 'Invalid month';
      } else if (year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth() + 1)) {
        errors.expiry = 'Card has expired';
      }
    }
    if (cardCVV.length !== 3) {
      errors.cvv = 'CVV must be 3 digits';
    }

    setCardErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ── Handle Payment ─────────────────────────────────────────
  const handlePayment = async (e) => {
    e.preventDefault();

    // Validate card fields if card payment
    if (paymentMethod === 'card' && !validateCard()) return;

    setIsProcessing(true);
    setOrderError('');

    try {
      const orderData = {
        items: cartItems.map(item => ({
          ...(item._id ? { product: item._id } : {}),
          name:     item.name,
          img:      item.img,
          price:    parseFloat(String(item.price).replace(/\D/g, '')) || 0,
          quantity: item.quantity,
        })),
        total:           Math.round(subtotal),
        paymentMethod,
        shippingAddress: {
          street:  streetRef.current?.value  || '',
          city:    cityRef.current?.value    || '',
          pincode: pincodeRef.current?.value || '',
        },
      };

      await placeOrder(orderData);
      if (onOrderComplete) onOrderComplete();
      navigate('/orders');

    } catch (err) {
      console.error('Order failed:', err);
      setOrderError('An error occurred while placing the order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EAE8E3] pt-32 pb-32 animate-[fade-in_0.5s_ease-out]">
      <div className="max-w-7xl mx-auto px-6 md:px-16">

        <button
          onClick={() => navigate('/cart')}
          className="flex items-center gap-2 text-gray-500 hover:text-[#1A1A1A] transition-colors mb-12 text-sm font-semibold uppercase tracking-widest"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Cart
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

          {/* ── Left: Checkout Form ── */}
          <div className="lg:col-span-7">
            <h1 className="text-5xl font-medium tracking-tighter text-[#1A1A1A] mb-12">Checkout</h1>

            {orderError && (
              <div className="bg-red-50 text-red-500 p-4 rounded-2xl mb-8 text-sm font-medium">
                {orderError}
              </div>
            )}

            <form onSubmit={handlePayment} className="space-y-10">

              {/* Shipping */}
              <section>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-6">
                  Shipping Address
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input ref={fullNameRef} type="text" placeholder="Full Name" required
                    className="bg-white border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-[#1A1A1A] transition-all" />
                  <input ref={emailRef} type="email" placeholder="Email Address" required
                    className="bg-white border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-[#1A1A1A] transition-all" />
                  <input ref={streetRef} type="text" placeholder="Street Address" required
                    className="md:col-span-2 bg-white border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-[#1A1A1A] transition-all" />
                  <input ref={cityRef} type="text" placeholder="City" required
                    className="bg-white border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-[#1A1A1A] transition-all" />
                  <input ref={pincodeRef} type="text" placeholder="PIN Code" required
                    maxLength={6} pattern="\d{6}"
                    className="bg-white border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-[#1A1A1A] transition-all" />
                </div>
              </section>

              {/* Payment Method */}
              <section>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-6">
                  Payment Method
                </h3>
                <div className="space-y-4">
                  {[
                    { value: 'card', label: 'Credit / Debit Card',          icon: CreditCard },
                    { value: 'upi',  label: 'UPI (GPay / PhonePe / Paytm)', icon: Wallet     },
                    { value: 'cod',  label: 'Cash on Delivery',             icon: Truck      },
                  ].map(({ value, label, icon: Icon }) => (
                    <label key={value}
                      className={`flex items-center justify-between p-6 rounded-3xl border-2 transition-all cursor-pointer ${
                        paymentMethod === value ? 'border-[#1A1A1A] bg-white' : 'border-transparent bg-white/50 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-full ${paymentMethod === value ? 'bg-[#1A1A1A] text-white' : 'bg-gray-200 text-gray-500'}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="font-medium">{label}</span>
                      </div>
                      <input type="radio" name="payment" value={value}
                        checked={paymentMethod === value}
                        onChange={() => { setPaymentMethod(value); setCardErrors({}); }}
                        className="w-5 h-5 accent-[#1A1A1A]"
                      />
                    </label>
                  ))}
                </div>
              </section>

              {/* Card Input Section */}
              {paymentMethod === 'card' && (
                <div className="bg-white p-8 rounded-[30px] space-y-6 animate-[fade-in_0.3s_ease-out] border border-gray-100 shadow-sm">

                  {/* Card preview strip */}
                  <div className="bg-gradient-to-r from-[#1A1A1A] to-[#333] rounded-2xl p-5 text-white flex justify-between items-center mb-2">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-white/50 mb-1">Card Number</p>
                      <p className="font-mono text-lg tracking-[0.15em]">
                        {cardNumber || '•••• •••• •••• ••••'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-widest text-white/50 mb-1">Expires</p>
                      <p className="font-mono text-base">{cardExpiry || 'MM/YY'}</p>
                    </div>
                  </div>

                  {/* Cardholder Name */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value.toUpperCase())}
                      placeholder="JOHN DOE"
                      maxLength={26}
                      className={`w-full border-b py-3 outline-none transition-colors font-mono tracking-widest text-sm ${
                        cardErrors.name ? 'border-red-400' : 'border-gray-200 focus:border-[#1A1A1A]'
                      }`}
                    />
                    {cardErrors.name && <p className="text-red-500 text-xs">{cardErrors.name}</p>}
                  </div>

                  {/* Card Number — 16 digits, grouped as 4-4-4-4 */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">
                      Card Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        inputMode="numeric"
                        value={cardNumber}
                        onChange={(e) => {
                          setCardNumber(formatCardNumber(e.target.value));
                          setCardErrors(prev => ({ ...prev, number: '' }));
                        }}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19} // 16 digits + 3 spaces
                        className={`w-full border-b py-3 outline-none transition-colors font-mono tracking-widest text-sm pr-16 ${
                          cardErrors.number ? 'border-red-400' : 'border-gray-200 focus:border-[#1A1A1A]'
                        }`}
                      />
                      <CardTypeBadge type={cardType} />
                    </div>
                    <div className="flex justify-between items-center">
                      {cardErrors.number
                        ? <p className="text-red-500 text-xs">{cardErrors.number}</p>
                        : <p className="text-gray-400 text-xs">16 digits on front of card</p>
                      }
                      <p className={`text-xs font-mono ${cardNumber.replace(/\s/g, '').length === 16 ? 'text-green-500' : 'text-gray-300'}`}>
                        {cardNumber.replace(/\s/g, '').length}/16
                      </p>
                    </div>
                  </div>

                  {/* Expiry (MM/YY) + CVV (3 digits) side by side */}
                  <div className="grid grid-cols-2 gap-6">

                    {/* Expiry */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={cardExpiry}
                        onChange={(e) => {
                          setCardExpiry(formatExpiry(e.target.value));
                          setCardErrors(prev => ({ ...prev, expiry: '' }));
                        }}
                        placeholder="MM/YY"
                        maxLength={5} // MM/YY = 5 chars
                        className={`w-full border-b py-3 outline-none transition-colors font-mono tracking-widest text-sm text-center ${
                          cardErrors.expiry ? 'border-red-400' : 'border-gray-200 focus:border-[#1A1A1A]'
                        }`}
                      />
                      {cardErrors.expiry && <p className="text-red-500 text-xs">{cardErrors.expiry}</p>}
                    </div>

                    {/* CVV — exactly 3 digits, hidden */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500 flex items-center gap-1">
                        CVV <Lock className="w-3 h-3 text-gray-400" />
                      </label>
                      <input
                        type="password" // Hidden for security
                        inputMode="numeric"
                        value={cardCVV}
                        onChange={(e) => {
                          setCardCVV(formatCVV(e.target.value));
                          setCardErrors(prev => ({ ...prev, cvv: '' }));
                        }}
                        placeholder="•••"
                        maxLength={3} // Exactly 3 digits
                        className={`w-full border-b py-3 outline-none transition-colors font-mono tracking-[0.4em] text-sm text-center ${
                          cardErrors.cvv ? 'border-red-400' : 'border-gray-200 focus:border-[#1A1A1A]'
                        }`}
                      />
                      {cardErrors.cvv
                        ? <p className="text-red-500 text-xs">{cardErrors.cvv}</p>
                        : <p className="text-gray-400 text-xs text-center">3 digits on back</p>
                      }
                    </div>
                  </div>

                  {/* Security note */}
                  <div className="flex items-center gap-2 pt-2 text-gray-400">
                    <ShieldCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <p className="text-xs">Your payment information is encrypted and secure.</p>
                  </div>
                </div>
              )}

              {/* UPI Input */}
              {paymentMethod === 'upi' && (
                <div className="bg-white p-8 rounded-[30px] animate-[fade-in_0.3s_ease-out] border border-gray-100">
                  <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500 mb-3">
                    UPI ID
                  </label>
                  <input
                    type="text"
                    placeholder="username@okaxis"
                    className="w-full border-b border-gray-200 py-3 outline-none focus:border-[#1A1A1A] transition-colors text-sm"
                  />
                  <p className="text-gray-400 text-xs mt-2">e.g. mobilenumber@upi, name@okicici</p>
                </div>
              )}

              {/* Pay Button */}
              <button
                disabled={isProcessing || cartItems.length === 0}
                className="w-full py-6 bg-[#1A1A1A] text-white rounded-full text-sm font-semibold uppercase tracking-widest shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isProcessing
                  ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                  : <><ShieldCheck className="w-5 h-5" /> Pay ₹{Math.round(subtotal).toLocaleString('en-IN')}</>
                }
              </button>
            </form>
          </div>

          {/* ── Right: Order Summary ── */}
          <div className="lg:col-span-5">
            <div className="bg-white p-10 rounded-[40px] shadow-sm sticky top-32 border border-gray-100">
              <h3 className="text-2xl font-medium mb-8">Summary</h3>

              <div className="space-y-6 mb-10 max-h-[40vh] overflow-y-auto pr-2">
                {cartItems.map((item, idx) => {
                  const itemId    = item._id || item.id || idx;
                  const itemPrice = parseFloat(String(item.price).replace(/\D/g, '')) || 0;
                  return (
                    <div key={itemId} className="flex gap-4 items-center">
                      <div className="w-16 h-16 bg-[#F5F5F5] rounded-2xl p-2 flex-shrink-0">
                        <img src={item.img?.startsWith('http') ? item.img : `/${item.img}`} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium truncate">{item.name}</h4>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-sm font-medium flex-shrink-0">
                        ₹{(itemPrice * (item.quantity || 1)).toLocaleString('en-IN')}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-4 pt-8 border-t border-gray-100">
                <div className="flex justify-between text-gray-500 font-light">
                  <span>Subtotal</span>
                  <span>₹{Math.round(subtotal).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-500 font-light">
                  <span>Shipping</span>
                  <span className="text-green-600 font-semibold tracking-widest text-[10px] uppercase">Free</span>
                </div>
                <div className="flex justify-between items-end pt-4">
                  <span className="text-lg font-medium">Order Total</span>
                  <span className="text-3xl font-medium tracking-tighter">
                    ₹{Math.round(subtotal).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;