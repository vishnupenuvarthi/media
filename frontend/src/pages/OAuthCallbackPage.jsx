import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

export const OAuthCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = searchParams.get('token');
    const refreshToken = searchParams.get('refreshToken');
    const userStr = searchParams.get('user');
    const errorParam = searchParams.get('error');
    const reason = searchParams.get('reason');
    const message = searchParams.get('message');

    if (errorParam) {
      const errorMessage = message 
        ? decodeURIComponent(message) 
        : reason 
          ? `OAuth failed: ${reason}` 
          : 'OAuth authentication failed. Please try again.';
      setError(errorMessage);
      setTimeout(() => {
        navigate(`/login?error=${encodeURIComponent(errorMessage)}`, { replace: true });
      }, 3000);
      return;
    }

    if (!token) {
      const errorMsg = 'Missing authentication token. Please try signing in again.';
      setError(errorMsg);
      setTimeout(() => {
        navigate(`/login?error=${encodeURIComponent(errorMsg)}`, { replace: true });
      }, 3000);
      return;
    }

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        setAuth({
          user,
          accessToken: token,
          refreshToken: refreshToken || ''
        });
        
        // Small delay to ensure state is set
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 100);
      } catch (err) {
        console.error('OAuth callback parsing error:', err);
        const errorMsg = 'Failed to process authentication data. Please try again.';
        setError(errorMsg);
        setTimeout(() => {
          navigate(`/login?error=${encodeURIComponent(errorMsg)}`, { replace: true });
        }, 3000);
      }
    } else {
      const errorMsg = 'Incomplete authentication data. Please try signing in again.';
      setError(errorMsg);
      setTimeout(() => {
        navigate(`/login?error=${encodeURIComponent(errorMsg)}`, { replace: true });
      }, 3000);
    }
  }, [searchParams, navigate, setAuth]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md">
          <div className="mb-4">
            <svg className="w-16 h-16 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">Authentication Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">Redirecting to login page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">Completing sign in...</p>
        <p className="text-sm text-gray-500 mt-2">Please wait while we authenticate you</p>
      </div>
    </div>
  );
};



