import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { translate } from '@/utils/translator';
import { EyeIcon, EyeSlashIcon, XCircleIcon } from '@heroicons/react/24/outline';

export const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useAuthStore((state) => state.setAuth);
  const language = useLanguageStore((state) => state.language);
  const t = (key, replacements) => translate(language, `auth.login.${key}`, replacements);
  const errors = (key) => translate(language, `auth.errors.${key}`);

  // Check for OAuth errors in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const oauthError = urlParams.get('error');
    if (oauthError) {
      const errorMessages = {
        'oauth_failed': 'OAuth authentication failed. Please try again.',
        'oauth_not_configured': 'OAuth is not configured on the server. Please contact support.',
        'oauth_error': 'An error occurred during OAuth authentication.',
        'oauth_missing_data': 'Incomplete authentication data received.'
      };
      setError(errorMessages[oauthError] || decodeURIComponent(oauthError));
    }
  }, [location.search]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (!form.email.trim()) {
      setError(errors('emailInvalid'));
      return;
    }
    if (!form.password) {
      setError(errors('passwordRequired'));
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', {
        email: form.email.trim().toLowerCase(),
        password: form.password
      });
      
      setAuth(data);
      const redirectPath = location.state?.from ?? '/';
      navigate(redirectPath, { replace: true });
    } catch (err) {
      let errorMessage = 'Login failed. Please try again.';
      
      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.message) {
        errorMessage = err.message;
      } else if (err?.code === 'ERR_NETWORK' || err?.message?.includes('Network Error')) {
        errorMessage = 'Network error. Please check if the backend server is running on port 5001.';
      } else if (err?.code === 'ECONNREFUSED') {
        errorMessage = 'Cannot connect to server. Please check if the backend is running on port 5001.';
      } else if (err?.response?.status === 503) {
        errorMessage = 'Database connection error. Please try again in a moment.';
      } else if (err?.response?.status === 401) {
        errorMessage = 'Invalid email or password. Please check your credentials and try again.';
      }
      
      console.error('Login error:', {
        message: errorMessage,
        status: err?.response?.status,
        data: err?.response?.data
      });
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-primary text-white p-8 text-center">
            <div className="text-4xl font-serif font-bold mb-2">NLR LIVE NEWS</div>
            <h1 className="text-2xl font-serif font-semibold mb-2">{t('title')}</h1>
            <p className="text-primary-100 text-sm">{t('subtitle')}</p>
          </div>

          <div className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-800">
                <XCircleIcon className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            {/* OAuth Buttons */}
            <div className="mb-6 space-y-3">
              <button
                type="button"
                onClick={() => {
                  window.location.href = '/api/auth/google';
                }}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
              <button
                type="button"
                onClick={() => {
                  window.location.href = '/api/auth/apple';
                }}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                Continue with Apple
              </button>
              <button
                type="button"
                onClick={() => {
                  window.location.href = '/api/auth/microsoft';
                }}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" viewBox="0 0 23 23" fill="none">
                  <path fill="#F25022" d="M0 0h11v11H0z"/>
                  <path fill="#00A4EF" d="M12 0h11v11H12z"/>
                  <path fill="#7FBA00" d="M0 12h11v11H0z"/>
                  <path fill="#FFB900" d="M12 12h11v11H12z"/>
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
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition"
                  placeholder="your.email@example.com"
                  required
                  autoComplete="email"
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    {t('password')} <span className="text-red-500">*</span>
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-primary hover:underline"
                  >
                    {t('forgot')}
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-primary transition"
                    placeholder={language === 'te' ? 'మీ పాస్‌వర్డ్‌ను నమోదు చేయండి' : 'Enter your password'}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Submit */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="text-sm text-gray-600">{t('remember')}</span>
                </label>
              </div>

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
                    {t('submit')}
                  </>
                ) : (
                  t('submit')
                )}
              </button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">{t('noAccount')}</span>
                </div>
              </div>

              <p className="mt-6 text-center text-sm text-gray-600">
                {t('noAccount')}{' '}
                <Link to="/register" className="text-primary font-semibold hover:underline">
                  {t('create')}
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </div>
  );
};
