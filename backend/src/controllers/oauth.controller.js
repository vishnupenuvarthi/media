import { asyncHandler } from '../utils/asyncHandler.js';
import { env } from '../config/env.js';

export const oauthCallback = asyncHandler(async (req, res) => {
  const authData = req.user;
  
  if (!authData || !authData.accessToken) {
    console.error('OAuth callback: Missing auth data', { hasUser: !!req.user, hasAccessToken: !!authData?.accessToken });
    return res.redirect(`${env.frontendUrl}/login?error=oauth_failed`);
  }

  try {
    // Redirect to frontend with tokens in URL
    const redirectUrl = new URL(`${env.frontendUrl}/auth/callback`);
    redirectUrl.searchParams.set('token', authData.accessToken);
    redirectUrl.searchParams.set('refreshToken', authData.refreshToken);
    redirectUrl.searchParams.set('user', JSON.stringify(authData.user));
    
    res.redirect(redirectUrl.toString());
  } catch (error) {
    console.error('OAuth callback error:', error);
    res.redirect(`${env.frontendUrl}/login?error=oauth_error`);
  }
});

