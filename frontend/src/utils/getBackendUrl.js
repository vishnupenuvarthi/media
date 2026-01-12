/**
 * Get the backend URL for OAuth redirects
 * OAuth must redirect directly to backend, not through Vite proxy
 */
export const getBackendUrl = () => {
  // Production: use environment variable
  if (import.meta.env.VITE_API_URL) {
    const apiUrl = import.meta.env.VITE_API_URL;
    // If it's a full URL, use it; if it's just /api, construct from window.location
    if (apiUrl.startsWith('http')) {
      return apiUrl.replace('/api', '');
    }
  }
  
  // Development: use localhost with port 5001
  if (import.meta.env.DEV) {
    return 'http://localhost:5001';
  }
  
  // Fallback: try to construct from current location
  if (typeof window !== 'undefined') {
    const host = window.location.host;
    // If on localhost, use port 5001
    if (host.includes('localhost') || host.includes('127.0.0.1')) {
      return 'http://localhost:5001';
    }
    // Otherwise, use same host but assume backend is on same domain
    return `${window.location.protocol}//${host.replace(':5174', ':5001').replace(':5173', ':5001')}`;
  }
  
  // Last resort
  return 'http://localhost:5001';
};


