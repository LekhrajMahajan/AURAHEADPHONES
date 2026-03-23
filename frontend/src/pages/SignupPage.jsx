import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from 'firebase/auth';
import { auth } from '../config/firebase';
import { Headphones, ArrowRight, MailCheck, Eye, EyeOff } from 'lucide-react';

const SignupPage = ({ setCurrentUser }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth, formData.email, formData.password
      );

      await updateProfile(userCredential.user, {
        displayName: formData.name,
      });

      await sendEmailVerification(userCredential.user);

      await auth.signOut();

      setVerificationSent(true);

    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please login.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password must be at least 6 characters.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (verificationSent) {
    return (
      <div className="min-h-screen bg-[#EAE8E3] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-12 px-12 shadow-2xl rounded-[30px] border border-gray-100 flex flex-col items-center text-center">

            {/* Icon */}
            <div className="w-20 h-20 bg-[#EAE8E3] rounded-full flex items-center justify-center mb-6">
              <MailCheck className="w-10 h-10 text-[#1A1A1A]" strokeWidth={1.5} />
            </div>

            <h2 className="text-3xl font-medium text-[#1A1A1A] tracking-tight mb-3">
              Verify Your Email
            </h2>
            <p className="text-gray-500 font-light mb-2">
              We've sent a verification link to:
            </p>
            <p className="text-[#1A1A1A] font-semibold mb-8 text-sm tracking-wide">
              {formData.email}
            </p>

            <div className="w-full h-[1px] bg-gray-100 mb-8"></div>

            <p className="text-gray-500 text-sm font-light mb-10 leading-relaxed">
              Please check your inbox and click the verification link before logging in.
              Check your<b> spam folder </b>if you don't see it.
            </p>

            <button
              onClick={() => navigate('/login')}
              className="w-full flex justify-center items-center gap-2 py-4 rounded-full text-sm font-semibold uppercase tracking-widest text-white bg-[#1A1A1A] hover:bg-[#333] transition-colors"
            >
              Go to Login <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-xs text-gray-400 mt-6 font-light">
              Didn't receive the email?{' '}
              <button
                onClick={async () => {
                  try {
                    const { signInWithEmailAndPassword } = await import('firebase/auth');
                    const cred = await signInWithEmailAndPassword(auth, formData.email, formData.password);
                    await sendEmailVerification(cred.user);
                    await auth.signOut();
                    alert('Verification email resent!');
                  } catch {
                    alert('Could not resend. Please try signing up again.');
                  }
                }}
                className="text-[#1A1A1A] font-semibold hover:opacity-70 transition-opacity underline underline-offset-2"
              >
                Resend email
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EAE8E3] flex flex-col justify-center py-12 sm:px-6 lg:px-8 animate-[fade-in_0.5s_ease-out]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
        <Headphones className="w-10 h-10 md:w-12 md:h-12 text-[#1A1A1A] mb-4" strokeWidth={1.5} />
        <h2 className="text-center text-4xl md:text-[3.5rem] font-medium tracking-tight text-[#1A1A1A] leading-none mb-2">
          Join Aura
        </h2>
        <p className="text-center text-sm text-gray-500 uppercase tracking-widest font-semibold">
          Create your account
        </p>
      </div>

      <div className="mt-8 md:mt-10 sm:mx-auto sm:w-full sm:max-w-md w-full px-4 sm:px-0">
        <div className="bg-white py-8 px-6 md:py-10 md:px-12 shadow-2xl rounded-[20px] md:rounded-[30px] border border-gray-100">
          <form className="space-y-6" onSubmit={handleSignup}>

            {error && (
              <div className="text-red-500 text-sm font-medium text-center bg-red-50 p-3 rounded-xl">
                {error}
              </div>
            )}

            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500 mb-2">
                Full Name
              </label>
              <input
                type="text" required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="block w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:border-[#1A1A1A] focus:ring-1 focus:ring-[#1A1A1A] transition-colors"
                placeholder="John Doe"
              />
            </div>

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
                  placeholder="Min. 6 characters"
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
              type="submit" disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-4 rounded-full text-sm font-semibold uppercase tracking-widest text-white bg-[#1A1A1A] hover:bg-[#333] transition-colors disabled:opacity-60"
            >
              {loading ? 'Creating Account...' : <> Create Account <ArrowRight className="w-4 h-4" /> </>}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-[#1A1A1A] hover:opacity-70">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;