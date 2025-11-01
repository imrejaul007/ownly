'use client';

import { useState, useEffect, Suspense } from 'react';
import { authAPI, referralAPI } from '@/lib/api';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'investor',
    referralCode: '',
  });
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [referralBonus, setReferralBonus] = useState(false);

  useEffect(() => {
    // Get referral code from URL if exists
    const refCode = searchParams?.get('ref');
    if (refCode) {
      setFormData((prev) => ({ ...prev, referralCode: refCode }));
      setReferralBonus(true);
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev: any) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.name || formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.phone || formData.phone.length < 10) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      // Sign up
      const signupResponse = await authAPI.signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: formData.role,
      });

      // Apply referral code if provided
      if (formData.referralCode) {
        try {
          await referralAPI.applyReferralCode({
            referralCode: formData.referralCode,
          });
        } catch (referralError) {
          console.warn('Referral code application failed:', referralError);
        }
      }

      // Store token and user
      if (signupResponse.data.data.token) {
        localStorage.setItem('token', signupResponse.data.data.token);
        localStorage.setItem('user', JSON.stringify(signupResponse.data.data.user));
      }

      // Show success message
      alert('✅ Account created successfully! Welcome to OWNLY!');

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Signup error:', error);
      alert(error.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Animated Gradient Orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="max-w-md w-full relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-2">
            OWNLY
          </h1>
          <p className="text-purple-200 text-lg">
            Own the world, one deal at a time
          </p>
        </div>

        {/* Referral Bonus Banner */}
        {referralBonus && (
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-xl border border-green-400/30 text-white rounded-2xl p-4 mb-6 text-center shadow-lg shadow-green-500/20">
            <div className="text-3xl mb-2">🎉</div>
            <div className="font-bold text-green-300 text-lg">You've been referred!</div>
            <div className="text-sm text-green-200">Get AED 50 welcome bonus after signup</div>
          </div>
        )}

        {/* Signup Form */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl p-8">
          <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Create Your Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-purple-200">Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ahmed Al Mansouri"
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.name ? 'border-red-500/50 bg-red-500/5' : 'border-white/10 bg-white/5'
                } backdrop-blur-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all`}
              />
              {errors.name && <p className="text-red-400 text-sm mt-1 flex items-center gap-1">⚠️ {errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-purple-200">Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="ahmed@example.ae"
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.email ? 'border-red-500/50 bg-red-500/5' : 'border-white/10 bg-white/5'
                } backdrop-blur-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all`}
              />
              {errors.email && <p className="text-red-400 text-sm mt-1 flex items-center gap-1">⚠️ {errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-purple-200">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+971 50 123 4567"
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.phone ? 'border-red-500/50 bg-red-500/5' : 'border-white/10 bg-white/5'
                } backdrop-blur-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all`}
              />
              {errors.phone && <p className="text-red-400 text-sm mt-1 flex items-center gap-1">⚠️ {errors.phone}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-purple-200">Password *</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 6 characters"
                  className={`w-full px-4 py-3 pr-12 rounded-xl border ${
                    errors.password ? 'border-red-500/50 bg-red-500/5' : 'border-white/10 bg-white/5'
                  } backdrop-blur-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-purple-300 transition-colors"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-sm mt-1 flex items-center gap-1">⚠️ {errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-purple-200">Confirm Password *</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  className={`w-full px-4 py-3 pr-12 rounded-xl border ${
                    errors.confirmPassword ? 'border-red-500/50 bg-red-500/5' : 'border-white/10 bg-white/5'
                  } backdrop-blur-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-purple-300 transition-colors"
                >
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-400 text-sm mt-1 flex items-center gap-1">⚠️ {errors.confirmPassword}</p>}
            </div>

            {/* Account Type */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-purple-200">Account Type *</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23a78bfa' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                  backgroundPosition: 'right 0.5rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.5em 1.5em',
                  paddingRight: '2.5rem'
                }}
              >
                <option value="investor" className="bg-slate-900">Investor - Retail (Min: AED 1,000)</option>
                <option value="investor_hni" className="bg-slate-900">Investor - HNI (Min: AED 50,000)</option>
                <option value="agent" className="bg-slate-900">Agent - Earn Commissions</option>
              </select>
            </div>

            {/* Referral Code */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-purple-200">
                Referral Code (Optional) 🎁
              </label>
              <input
                type="text"
                name="referralCode"
                value={formData.referralCode}
                onChange={handleChange}
                placeholder="Enter referral code"
                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all uppercase"
              />
              {formData.referralCode && (
                <p className="text-green-400 text-sm mt-1 flex items-center gap-1">
                  ✓ Get AED 50 welcome bonus!
                </p>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="terms"
                required
                className="mt-1 w-4 h-4 rounded border-white/20 bg-white/5 text-purple-500 focus:ring-purple-500/50 focus:ring-offset-slate-950"
              />
              <label htmlFor="terms" className="text-sm text-purple-200">
                I agree to OWNLY's{' '}
                <a href="#" className="text-purple-400 hover:text-purple-300 underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-purple-400 hover:text-purple-300 underline">
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Creating Account...</span>
                </>
              ) : (
                <span>Create Account</span>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-purple-200">
              Already have an account?{' '}
              <Link href="/login" className="text-purple-400 font-semibold hover:text-purple-300 transition-colors">
                Sign In →
              </Link>
            </p>
          </div>
        </div>

        {/* Features Grid - 8 Investment Categories */}
        <div className="mt-8 grid grid-cols-4 gap-3 text-center text-xs">
          <div className="bg-white/5 backdrop-blur-xl rounded-xl p-3 border border-white/10 hover:bg-white/10 transition-all">
            <div className="text-2xl mb-1">🚗</div>
            <div className="text-purple-200 font-semibold">Mobility</div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-xl p-3 border border-white/10 hover:bg-white/10 transition-all">
            <div className="text-2xl mb-1">🏢</div>
            <div className="text-purple-200 font-semibold">Workspace</div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-xl p-3 border border-white/10 hover:bg-white/10 transition-all">
            <div className="text-2xl mb-1">💆‍♀️</div>
            <div className="text-purple-200 font-semibold">Lifestyle</div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-xl p-3 border border-white/10 hover:bg-white/10 transition-all">
            <div className="text-2xl mb-1">🛍️</div>
            <div className="text-purple-200 font-semibold">Retail</div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-xl p-3 border border-white/10 hover:bg-white/10 transition-all">
            <div className="text-2xl mb-1">☕</div>
            <div className="text-purple-200 font-semibold">Hospitality</div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-xl p-3 border border-white/10 hover:bg-white/10 transition-all">
            <div className="text-2xl mb-1">🏠</div>
            <div className="text-purple-200 font-semibold">Real Estate</div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-xl p-3 border border-white/10 hover:bg-white/10 transition-all">
            <div className="text-2xl mb-1">🏕️</div>
            <div className="text-purple-200 font-semibold">Experience</div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-xl p-3 border border-white/10 hover:bg-white/10 transition-all">
            <div className="text-2xl mb-1">💎</div>
            <div className="text-purple-200 font-semibold">Luxury</div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-6 flex justify-center gap-6 text-xs text-purple-300">
          <div className="flex items-center gap-1">
            <span>🔒</span>
            <span>Bank-Grade Security</span>
          </div>
          <div className="flex items-center gap-1">
            <span>✓</span>
            <span>5,000+ Investors</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-purple-300">Loading signup...</p>
        </div>
      </div>
    }>
      <SignupContent />
    </Suspense>
  );
}
