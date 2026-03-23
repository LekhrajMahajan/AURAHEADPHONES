import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  signInWithEmailAndPassword,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { syncUserWithBackend } from '../services/api';
import { Headphones, ArrowRight, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import ToastNotification from '../components/ToastNotification';

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const LoginPage = ({ setCurrentUser }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [unverifiedUser, setUnverifiedUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);


  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const showToastMsg = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
  };

  // ── Email/Password Login ──────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setUnverifiedUser(null);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth, formData.email, formData.password
      );
      const firebaseUser = userCredential.user;

      // Email verified check
      if (!firebaseUser.emailVerified) {
        setUnverifiedUser(firebaseUser);
        await auth.signOut();
        setError('Please verify your email before logging in. Check your inbox.');
        setLoading(false);
        return;
      }

      const backendUser = await syncUserWithBackend(firebaseUser);
      setCurrentUser(backendUser);
      navigate('/shop');

    } catch (err) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Invalid email or password.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many failed attempts. Please try again later.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else if (err.code === 'auth/user-disabled') {
        setError('This account has been disabled. Contact support.');
      } else {
        setError(err.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Google OAuth Login (Popup) ────────────────────────────
  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const backendUser = await syncUserWithBackend(result.user);
      setCurrentUser(backendUser);
      showToastMsg(`Welcome, ${result.user.displayName}!`);
      setTimeout(() => navigate('/shop'), 800);
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
        // User closed the popup — no need to show error
      } else if (err.code === 'auth/unauthorized-domain') {
        setError('Firebase Error: Domain not authorized. You must add this Vercel URL to your Firebase Console -> Authentication -> Settings -> Authorized Domains list.');
      } else {
        setError(err.message || 'Google login failed. Please try again.');
      }
    } finally {
      setGoogleLoading(false);
    }
  };
  // ── Resend Verification ───────────────────────────────────
  const handleResendVerification = async () => {
    if (!unverifiedUser) return;
    try {
      await sendEmailVerification(unverifiedUser);
      showToastMsg(`Verification email sent to ${formData.email}`);
    } catch (err) {
      showToastMsg('Could not resend. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#EAE8E3] flex flex-col justify-center py-12 sm:px-6 lg:px-8 animate-[fade-in_0.5s_ease-out]">

      {/* Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
        <Headphones className="w-12 h-12 text-[#1A1A1A] mb-4" strokeWidth={1.5} />
        <h2 className="text-center text-[3.5rem] font-medium tracking-tight text-[#1A1A1A] leading-none mb-2">
          Welcome Back
        </h2>
        <p className="text-center text-sm text-gray-500 uppercase tracking-widest font-semibold">
          Login to your account
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-12 shadow-2xl rounded-[30px] border border-gray-100">

          {/* Google Login Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading || loading}
            className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-full border-2 border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all text-sm font-semibold text-[#1A1A1A] disabled:opacity-60 disabled:cursor-not-allowed mb-6 shadow-sm"
          >
            {googleLoading ? (
              <div className="w-5 h-5 border-2 border-gray-300 border-t-[#1A1A1A] rounded-full animate-spin" />
            ) : (
              <GoogleIcon />
            )}
            {googleLoading ? 'Connecting...' : 'Continue with Google'}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-[1px] bg-gray-200"></div>
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">or</span>
            <div className="flex-1 h-[1px] bg-gray-200"></div>
          </div>

          {/* Email/Password Form */}
          <form className="space-y-6" onSubmit={handleLogin}>

            {/* Error */}
            {error && (
              <div className="bg-red-50 p-4 rounded-xl">
                <p className="text-red-500 text-sm font-medium text-center">{error}</p>
                {unverifiedUser && (
                  <button
                    type="button"
                    onClick={handleResendVerification}
                    className="w-full mt-3 text-xs font-semibold uppercase tracking-widest text-[#1A1A1A] underline underline-offset-2 hover:opacity-70 transition-opacity"
                  >
                    Resend Verification Email
                  </button>
                )}
              </div>
            )}

            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500 mb-2">
                Email Address
              </label>
              <input
                type="email" required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="block w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:border-[#1A1A1A] focus:ring-1 focus:ring-[#1A1A1A] transition-colors"
                placeholder="hello@example.com"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'} required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="block w-full px-4 py-4 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:border-[#1A1A1A] focus:ring-1 focus:ring-[#1A1A1A] transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1A1A1A] transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit" disabled={loading || googleLoading}
              className="w-full flex justify-center items-center gap-2 py-4 rounded-full text-sm font-semibold uppercase tracking-widest text-white bg-[#1A1A1A] hover:bg-[#333] transition-colors disabled:opacity-60"
            >
              {loading
                ? 'Signing in...'
                : <><ShieldCheck className="w-4 h-4" /> Sign In <ArrowRight className="w-4 h-4" /></>
              }
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 mb-3">
              Don't have an account?
            </p>
            <Link to="/signup" className="inline-block px-8 py-3 rounded-full border border-gray-200 text-sm font-semibold uppercase tracking-widest text-[#1A1A1A] hover:bg-gray-50 transition-colors">
              Create an Account
            </Link>
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

export default LoginPage;