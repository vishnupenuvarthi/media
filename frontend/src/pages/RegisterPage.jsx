import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { translate } from '@/utils/translator';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const ROLE_VALUES = ['user', 'developer', 'employer', 'owner'];
const CATEGORY_VALUES = ['national', 'business', 'sports', 'entertainment', 'technology', 'politics', 'world', 'lifestyle', 'health', 'education'];

export const RegisterPage = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    categories: []
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();
  const language = useLanguageStore((state) => state.language);
  const t = (key, replacements) => {
    const val = translate(language, `auth.register.${key}`, replacements);
    if (val) return val;

    const defaults = {
      title: 'Create Your Account',
      subtitle: 'Join NLR LIVE NEWS and stay informed',
      fullName: 'Full Name',
      email: 'Email Address',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      accountType: 'Account Type',
      interests: "Select the categories you're interested in",
      submit: 'Create Account',
      creating: 'Creating Account...',
      success: 'Account created successfully! Redirecting...',
      existing: 'Already have an account?',
      signIn: 'Sign in here'
    };
    return defaults[key] || '';
  };
  const err = (key) => {
    const val = translate(language, `auth.errors.${key}`);
    if (val) return val;
    const defaults = {
      nameRequired: 'Name must be at least 2 characters',
      emailInvalid: 'Please enter a valid email address',
      passwordRequired: 'Password must be at least 6 characters long',
      passwordMismatch: 'Passwords do not match'
    };
    return defaults[key] || '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleCategoryToggle = (category) => {
    setForm((prev) => {
      const categories = prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category];
      return { ...prev, categories };
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim() || form.name.trim().length < 2) {
      newErrors.name = err('nameRequired');
    }

    if (!form.email.trim()) {
      newErrors.email = err('emailInvalid');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = err('emailInvalid');
    }

    if (!form.password) {
      newErrors.password = err('passwordRequired');
    } else if (form.password.length < 6) {
      newErrors.password = err('passwordRequired');
    }

    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = err('passwordMismatch');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        role: form.role,
        categories: form.categories
      });

      setAuth(data);
      setSuccess(t('success') || 'Account created successfully!');

      setTimeout(() => {
        navigate('/', { replace: true });
      }, 1000);
    } catch (err) {
      console.error('Registration error:', err);
      console.error('Error type:', typeof err);
      console.error('Error keys:', Object.keys(err));
      console.error('Error response:', err.response);
      console.error('Error data:', err.response?.data);
      console.error('Error message:', err.message);

      // Extract error message from various possible locations
      let errorMessage = 'Unable to create account. Please try again.';

      // Try different error formats
      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.message) {
        errorMessage = err.message;
      } else if (err?.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (typeof err?.response?.data === 'string') {
        errorMessage = err.response.data;
      } else if (err?.response?.statusText) {
        errorMessage = err.response.statusText;
      } else if (err?.code === 'ERR_NETWORK' || err?.message?.includes('Network Error')) {
        errorMessage = 'Network error. Please check if the backend server is running on port 5001.';
      } else if (err?.code === 'ECONNREFUSED') {
        errorMessage = 'Cannot connect to server. Please check if the backend is running on port 5001.';
      } else if (err?.response?.status === 503) {
        errorMessage = 'Database connection error. Please try again in a moment.';
      } else if (err?.response?.status === 409) {
        errorMessage = 'Email address is already registered. Please use a different email or try logging in.';
      }

      console.error('Registration error:', {
        message: errorMessage,
        status: err?.response?.status,
        data: err?.response?.data,
        code: err?.code
      });
      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-red-900 to-slate-900 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/20">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-700 to-red-900 text-white p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <Link to="/" className="inline-block hover:scale-105 transition-transform duration-300">
              <div className="text-4xl font-serif font-black mb-2 tracking-tighter">NLR</div>
              <div className="text-xs uppercase tracking-[0.5em] font-medium opacity-90">Live News • Nellore</div>
            </Link>
            <h1 className="text-2xl font-serif font-semibold mt-6">{t('title')}</h1>
            <p className="text-red-100 text-sm mt-1">{t('subtitle')}</p>
          </div>

          <div className="p-8">
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-800">
                <CheckCircleIcon className="w-5 h-5" />
                <span className="text-sm font-medium">{success}</span>
              </div>
            )}

            {errors.submit && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-800">
                <XCircleIcon className="w-5 h-5" />
                <span className="text-sm font-medium">{errors.submit}</span>
              </div>
            )}

            {/* OAuth Buttons */}
            <div className="mb-6 space-y-3">
              <button
                type="button"
                onClick={() => window.location.href = '/api/auth/google'}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium text-gray-700"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </button>
              <button
                type="button"
                onClick={() => window.location.href = '/api/auth/apple'}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium text-gray-700"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
                Continue with Apple
              </button>
              <button
                type="button"
                onClick={() => window.location.href = '/api/auth/microsoft'}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium text-gray-700"
              >
                <svg className="w-5 h-5" viewBox="0 0 23 23" fill="none">
                  <path fill="#F25022" d="M0 0h11v11H0z" />
                  <path fill="#00A4EF" d="M12 0h11v11H12z" />
                  <path fill="#7FBA00" d="M0 12h11v11H0z" />
                  <path fill="#FFB900" d="M12 12h11v11H12z" />
                </svg>
                Continue with Microsoft
              </button>
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('fullName')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 transition ${errors.name
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-primary'
                    }`}
                  placeholder={language === 'te' ? 'మీ పూర్తి పేరు ఇవ్వండి' : 'Enter your full name'}
                  required
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('email')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 transition ${errors.email
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-primary'
                    }`}
                  placeholder="your.email@example.com"
                  required
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  {t('accountType')} <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ROLE_VALUES.map((value) => (
                    <label
                      key={value}
                      className={`relative flex items-start p-4 border-2 rounded-lg cursor-pointer transition ${form.role === value
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <input
                        type="radio"
                        name="role"
                        value={value}
                        checked={form.role === value}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">
                          {translate(language, `auth.register.roles.${value}.label`) || value.charAt(0).toUpperCase() + value.slice(1)}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {translate(language, `auth.register.roles.${value}.description`)}
                        </div>
                      </div>
                      {form.role === value && (
                        <CheckCircleIcon className="w-5 h-5 text-primary ml-2" />
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('password')} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className={`w-full border rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 transition ${errors.password
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-primary'
                      }`}
                    placeholder={language === 'te' ? 'బలమైన పాస్‌వర్డ్‌ను సృష్టించండి' : 'Create a strong password'}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (language === 'te' ? 'దాచు' : 'Hide') : language === 'te' ? 'చూపు' : 'Show'}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                {form.password && (
                  <div className="mt-2">
                    <div className={`flex items-center gap-2 text-xs ${form.password.length >= 6 ? 'text-green-600' : 'text-gray-400'}`}>
                      {form.password.length >= 6 ? <CheckCircleIcon className="w-4 h-4" /> : <XCircleIcon className="w-4 h-4" />}
                      {language === 'te' ? 'కనీసం 6 అక్షరాలు' : 'At least 6 characters'}
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('confirmPassword')} <span className="text-red-500">*</span>
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 transition ${errors.confirmPassword
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-primary'
                    }`}
                  placeholder={language === 'te' ? 'పాస్‌వర్డ్‌ని మళ్లీ నమోదు చేయండి' : 'Re-enter your password'}
                  required
                />
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
              </div>

              {/* Categories */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  {t('interests')}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CATEGORY_VALUES.map((value) => (
                    <label
                      key={value}
                      className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition ${form.categories.includes(value)
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <input
                        type="checkbox"
                        checked={form.categories.includes(value)}
                        onChange={() => handleCategoryToggle(value)}
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                      <span className="text-sm font-medium">
                        {translate(language, `auth.register.categories.${value}`) || value.charAt(0).toUpperCase() + value.slice(1)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {t('creating')}
                  </>
                ) : (
                  t('submit')
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              {t('existing')}{' '}
              <Link to="/login" className="text-primary font-semibold hover:underline">
                {t('signIn')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
