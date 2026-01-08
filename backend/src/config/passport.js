import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as AppleStrategy } from 'passport-apple';
import { Strategy as MicrosoftStrategy } from 'passport-microsoft';
import { findOrCreateOAuthUser } from '../services/oauth.service.js';
import { env } from './env.js';

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Get base URL for callbacks
const getBaseUrl = () => {
  // Production: use BACKEND_URL or construct from domain
  if (process.env.BACKEND_URL) {
    return process.env.BACKEND_URL;
  }
  // Development: use localhost with port
  if (env.nodeEnv === 'development') {
    const port = env.port || 5001;
    return `http://localhost:${port}`;
  }
  // Fallback: try to construct from FRONTEND_URL (for Render/Vercel)
  if (env.frontendUrl && env.frontendUrl.includes('onrender.com')) {
    return env.frontendUrl.replace('onrender.com', 'onrender.com');
  }
  // Default fallback
  const port = env.port || 5001;
  return `http://localhost:${port}`;
};

const baseUrl = getBaseUrl();
const frontendUrl = env.frontendUrl || 'http://localhost:5174';

// Google Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  try {
    passport.use(
      'google',
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: `${baseUrl}/api/auth/google/callback`
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const userProfile = {
              id: profile.id,
              email: profile.emails?.[0]?.value,
              name: profile.displayName || (profile.name?.givenName + ' ' + profile.name?.familyName) || 'Google User',
              picture: profile.photos?.[0]?.value
            };
            const authData = await findOrCreateOAuthUser('google', userProfile);
            done(null, { provider: 'google', ...authData });
          } catch (error) {
            console.error('Google OAuth error:', error);
            done(error, null);
          }
        }
      )
    );
    console.log('✅ Google OAuth strategy registered');
  } catch (error) {
    console.error('❌ Failed to register Google OAuth strategy:', error.message);
  }
} else {
  console.warn('⚠️  Google OAuth not configured (missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET)');
}

// Apple Strategy
if (process.env.APPLE_CLIENT_ID && process.env.APPLE_TEAM_ID && process.env.APPLE_KEY_ID && process.env.APPLE_PRIVATE_KEY) {
  try {
    // Handle private key - support both escaped and raw formats
    let privateKey = process.env.APPLE_PRIVATE_KEY;
    if (privateKey && !privateKey.includes('-----BEGIN')) {
      // If it's a single line, try to format it
      privateKey = privateKey.replace(/\\n/g, '\n');
    }
    
    passport.use(
      'apple',
      new AppleStrategy(
        {
          clientID: process.env.APPLE_CLIENT_ID,
          teamID: process.env.APPLE_TEAM_ID,
          keyID: process.env.APPLE_KEY_ID,
          privateKey: privateKey,
          callbackURL: `${baseUrl}/api/auth/apple/callback`,
          scope: ['name', 'email']
        },
        async (accessToken, refreshToken, idToken, profile, done) => {
          try {
            // Apple provides minimal info - decode idToken if needed
            let email = profile.email;
            let name = profile.name;
            let userId = profile.id;
            
            // If email/name not in profile, try to get from idToken
            if (idToken && typeof idToken === 'object') {
              email = email || idToken.email;
              userId = userId || idToken.sub;
            }
            
            // Handle name object from Apple (first time only)
            if (profile.name && typeof profile.name === 'object') {
              const firstName = profile.name.firstName || '';
              const lastName = profile.name.lastName || '';
              name = `${firstName} ${lastName}`.trim() || 'Apple User';
            }
            
            const userProfile = {
              id: userId || idToken?.sub || 'apple_user_' + Date.now(),
              email: email,
              name: name || 'Apple User',
              picture: null // Apple doesn't provide profile pictures
            };
            
            if (!userProfile.email) {
              console.warn('Apple OAuth: No email found, using fallback');
              // Apple sometimes doesn't provide email on subsequent logins
              // Try to find user by oauthId instead
            }
            
            const authData = await findOrCreateOAuthUser('apple', userProfile);
            done(null, { provider: 'apple', ...authData });
          } catch (error) {
            console.error('Apple OAuth error:', error);
            done(error, null);
          }
        }
      )
    );
    console.log('✅ Apple OAuth strategy registered');
  } catch (error) {
    console.error('❌ Failed to register Apple OAuth strategy:', error.message);
  }
} else {
  console.warn('⚠️  Apple OAuth not configured (missing APPLE_CLIENT_ID, APPLE_TEAM_ID, APPLE_KEY_ID, or APPLE_PRIVATE_KEY)');
}

// Microsoft Strategy
if (process.env.MICROSOFT_CLIENT_ID && process.env.MICROSOFT_CLIENT_SECRET) {
  try {
    passport.use(
      'microsoft',
      new MicrosoftStrategy(
        {
          clientID: process.env.MICROSOFT_CLIENT_ID,
          clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
          callbackURL: `${baseUrl}/api/auth/microsoft/callback`,
          scope: ['user.read', 'email', 'profile'],
          tenant: 'common' // Allow both personal and work/school accounts
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            // Microsoft profile structure
            const email = profile.emails?.[0]?.value || 
                         profile._json?.mail || 
                         profile._json?.userPrincipalName ||
                         profile._json?.email;
            
            const name = profile.displayName || 
                        (profile.name?.givenName && profile.name?.familyName 
                          ? `${profile.name.givenName} ${profile.name.familyName}`.trim()
                          : profile.name?.givenName || profile.name?.familyName || 'Microsoft User');
            
            const userProfile = {
              id: profile.id || profile._json?.id || profile._json?.sub,
              email: email,
              name: name,
              picture: profile.photos?.[0]?.value || profile._json?.photo || null
            };
            
            if (!userProfile.email) {
              console.error('Microsoft OAuth: No email found in profile', profile);
              return done(new Error('Email not provided by Microsoft'), null);
            }
            
            const authData = await findOrCreateOAuthUser('microsoft', userProfile);
            done(null, { provider: 'microsoft', ...authData });
          } catch (error) {
            console.error('Microsoft OAuth error:', error);
            done(error, null);
          }
        }
      )
    );
    console.log('✅ Microsoft OAuth strategy registered');
  } catch (error) {
    console.error('❌ Failed to register Microsoft OAuth strategy:', error.message);
  }
} else {
  console.warn('⚠️  Microsoft OAuth not configured (missing MICROSOFT_CLIENT_ID or MICROSOFT_CLIENT_SECRET)');
}

export default passport;

