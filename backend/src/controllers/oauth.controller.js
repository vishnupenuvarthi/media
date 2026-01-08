import { asyncHandler } from '../utils/asyncHandler.js';
import { env } from '../config/env.js';

export const oauthCallback = asyncHandler(async (req, res) => {
  const authData = req.user;
  
  if (!authData) {
    console.error('OAuth callback: No user data from passport', { 
      hasUser: !!req.user,
      userType: typeof req.user,
      userKeys: req.user ? Object.keys(req.user) : []
    });
    return res.redirect(`${env.frontendUrl}/login?error=oauth_failed&reason=no_user_data`);
  }

  if (!authData.accessToken) {
    console.error('OAuth callback: Missing access token', { 
      hasUser: !!req.user,
      hasAccessToken: !!authData?.accessToken,
      authDataKeys: Object.keys(authData || {})
    });
    return res.redirect(`${env.frontendUrl}/login?error=oauth_failed&reason=no_token`);
  }

  try {
    // Ensure frontend URL is properly formatted
    const frontendBase = env.frontendUrl || 'http://localhost:5174';
    const redirectUrl = new URL(`${frontendBase}/auth/callback`);
    
    // Add tokens and user data
    redirectUrl.searchParams.set('token', authData.accessToken);
    redirectUrl.searchParams.set('refreshToken', authData.refreshToken || '');
    redirectUrl.searchParams.set('user', JSON.stringify(authData.user || {}));
    redirectUrl.searchParams.set('provider', authData.provider || 'unknown');
    
    console.log('OAuth success:', { 
      provider: authData.provider,
      userId: authData.user?.id,
      email: authData.user?.email
    });
    
    res.redirect(redirectUrl.toString());
  } catch (error) {
    console.error('OAuth callback error:', error);
    const frontendBase = env.frontendUrl || 'http://localhost:5174';
    res.redirect(`${frontendBase}/login?error=oauth_error&message=${encodeURIComponent(error.message)}`);
  }
});

