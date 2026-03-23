import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingBag, Star, ArrowLeft, Check } from 'lucide-react';
import useScrollSmoother from '../utils/useScrollSmoother';
import ToastNotification from '../components/ToastNotification';
import { getOptimizedUrl } from '../utils/cloudinary';

const ProductDetailsPage = ({ currentUser, addToCart, products = [] }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  useScrollSmoother();

  const product = useMemo(() => {
    return products.find(p => String(p._id) === id || String(p.id) === id) || null;
  }, [products, id]);

  const [added, setAdded] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [reviews, setReviews] = useState([
    { id: 1, user: 'Alex M.', rating: 5, comment: 'Absolutely incredible sound quality. The bass is deep and the highs are crystal clear. Best purchase this year.' },
    { id: 2, user: 'Sarah J.', rating: 4, comment: 'Very comfortable for long studio sessions. The active noise cancellation is top tier.' },
  ]);

  const handleAddToCart = () => {
    if (!currentUser) {
      setToastMessage('Please login first to add products to cart.');
      setShowToast(true);
      setTimeout(() => navigate('/login'), 1500);
      return;
    }
    if (addToCart) addToCart(product);
    setToastMessage(`${product.name} added to cart!`);
    setShowToast(true);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!currentUser) {
      setToastMessage('Please login first to submit a review.');
      setShowToast(true);
      setTimeout(() => navigate('/login'), 1500);
      return;
    }
    if (!newReviewText.trim()) return;

    setReviews([{
      id: Date.now(),
      user: currentUser.name || 'Aura User',
      rating: newReviewRating,
      comment: newReviewText,
    }, ...reviews]);

    setToastMessage('Review submitted successfully!');
    setShowToast(true);
    setNewReviewText('');
    setNewReviewRating(5);
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-[#EAE8E3] flex flex-col items-center justify-center gap-6">
        <h2 className="text-3xl font-medium text-[#1A1A1A]">Product Not Found</h2>
        <button
          onClick={() => navigate('/shop')}
          className="px-6 py-3 bg-[#1A1A1A] text-white rounded-full uppercase text-xs font-semibold tracking-widest hover:bg-[#333] transition-colors"
        >
          Back to Shop
        </button>
      </div>
    );
  }

  const displayPrice = typeof product.price === 'number'
    ? `₹${product.price.toLocaleString('en-IN')}`
    : product.price;

  return (
    <div className="min-h-screen bg-[#EAE8E3] pt-32 pb-32 animate-[fade-in_0.5s_ease-out]">
      <div className="max-w-7xl mx-auto px-6 md:px-16">

        {/* Back Button */}
        <button
          onClick={() => navigate('/shop')}
          className="flex items-center gap-2 text-gray-500 hover:text-[#1A1A1A] transition-colors mb-10 text-sm font-semibold uppercase tracking-widest"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Collection
        </button>

        {/* Product Details */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 mb-24">

          {/* Image — eager load, already cached */}
          <div className="lg:w-1/2 w-full aspect-square bg-[#F5F5F5] rounded-[30px] md:rounded-[40px] flex items-center justify-center p-6 md:p-12 shadow-inner relative transform-gpu">
            {product.tag && (
              <div className="absolute top-8 left-8 px-4 py-2 bg-[#1A1A1A] text-white text-xs uppercase tracking-widest font-semibold rounded-full z-10">
                {product.tag}
              </div>
            )}
            <img
              src={getOptimizedUrl(product.img, { width: 1200 })}
              alt={product.name}
              loading="eager"
              decoding="sync"
              className="w-full h-full object-cover mix-blend-multiply transition-transform duration-700 hover:scale-105 transform-gpu will-change-transform"
            />
          </div>

          {/* Info */}
          <div className="mt-8 lg:mt-0 lg:w-1/2 flex flex-col justify-center">
            <h1 className="text-[2.5rem] md:text-[4.5rem] font-medium leading-[1] text-[#1A1A1A] tracking-tight mb-4">
              {product.name}
            </h1>
            <p className="text-gray-500 uppercase tracking-[0.2em] text-sm font-semibold mb-8">
              {product.color}
            </p>
            <div className="text-2xl md:text-3xl font-medium text-[#1A1A1A] mb-8 md:mb-10">{displayPrice}</div>

            <p className="text-gray-600 text-base md:text-lg leading-relaxed font-light mb-8 md:mb-12">
              Experience studio-quality sound with the {product.name}. Engineered with custom neodymium
              drivers and precision-tuned acoustics to deliver pure resonance, deep bass, and crystal-clear
              highs. Wrapped in ultra-soft memory foam for all-day comfort.
            </p>

            <button
              onClick={handleAddToCart}
              className="py-4 md:py-5 bg-[#1A1A1A] text-white rounded-full flex items-center justify-center gap-3 hover:bg-[#333] transition-colors text-xs md:text-sm font-semibold uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 duration-200 transform-gpu"
            >
              {added ? <Check className="w-5 h-5 text-green-400" /> : <ShoppingBag className="w-5 h-5" />}
              {added ? 'Added to Cart' : 'Add to Cart'}
            </button>

            {/* Quick Specs */}
            <div className="mt-16 grid grid-cols-2 gap-8 border-t border-[#D6D5D0] pt-10">
              <div>
                <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-[0.2em] mb-2">Connectivity</div>
                <div className="font-medium text-[#1A1A1A]">Bluetooth 5.3 / Wired</div>
              </div>
              <div>
                <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-[0.2em] mb-2">Battery Life</div>
                <div className="font-medium text-[#1A1A1A]">Up to 60 Hours</div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-[40px] p-8 md:p-16 shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
            <h2 className="text-3xl md:text-4xl font-medium text-[#1A1A1A] tracking-tight">
              Customer Reviews
            </h2>
            <div className="flex items-center gap-2 bg-[#F5F5F5] px-6 py-3 rounded-full">
              <Star className="w-5 h-5 fill-current text-yellow-400" />
              <span className="text-lg font-medium">4.8</span>
              <span className="text-sm text-gray-500 ml-2">({reviews.length} Reviews)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

            {/* Reviews List */}
            <div className="lg:col-span-7 flex flex-col gap-8">
              {reviews.map(review => (
                <div key={review.id} className="border-b border-gray-100 pb-8 last:border-0">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#EAE8E3] rounded-full flex items-center justify-center text-[#1A1A1A] font-semibold">
                        {review.user.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-medium text-[#1A1A1A]">{review.user}</h4>
                        <div className="flex gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current text-yellow-400' : 'text-gray-300'}`} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest">Verified</span>
                  </div>
                  <p className="text-gray-600 leading-relaxed font-light">{review.comment}</p>
                </div>
              ))}
            </div>

            {/* Write Review */}
            <div className="lg:col-span-5">
              <div className="bg-[#F9F9F8] p-8 rounded-[30px]">
                <h3 className="text-xl font-medium mb-6 text-[#1A1A1A]">Write a Review</h3>
                <form onSubmit={handleReviewSubmit} className="flex flex-col gap-6">
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500 mb-3">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button key={star} type="button" onClick={() => setNewReviewRating(star)} className="hover:scale-110 transition-transform">
                          <Star className={`w-8 h-8 ${star <= newReviewRating ? 'fill-current text-yellow-400' : 'text-gray-300'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500 mb-3">Your Experience</label>
                    <textarea
                      required value={newReviewText}
                      onChange={e => setNewReviewText(e.target.value)}
                      placeholder="Share your thoughts about this product..."
                      className="w-full bg-white px-5 py-4 rounded-[20px] outline-none focus:ring-2 focus:ring-[#1A1A1A] transition-all min-h-[120px] resize-none text-sm shadow-sm"
                    />
                  </div>
                  <button type="submit" className="w-full py-4 bg-[#1A1A1A] text-white rounded-full text-xs font-semibold uppercase tracking-widest hover:bg-[#333] transition-colors shadow-md">
                    Submit Review
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToastNotification
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
};

export default ProductDetailsPage;