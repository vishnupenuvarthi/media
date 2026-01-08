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
  if (process.env.BACKEND_URL) {
    return process.env.BACKEND_URL;
  }
  const port = env.port || 5001;
  return `http://localhost:${port}`;
};

const baseUrl = getBaseUrl();

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
    passport.use(
      'apple',
      new AppleStrategy(
        {
          clientID: process.env.APPLE_CLIENT_ID,
          teamID: process.env.APPLE_TEAM_ID,
          keyID: process.env.APPLE_KEY_ID,
          privateKey: process.env.APPLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          callbackURL: `${baseUrl}/api/auth/apple/callback`
        },
        async (accessToken, refreshToken, idToken, profile, done) => {
          try {
            // Apple provides minimal info, decode idToken for email
            const userProfile = {
              id: profile.id || idToken?.sub || 'apple_user',
              email: profile.email || idToken?.email,
              name: profile.name || 'Apple User',
              picture: null
            };
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
          scope: ['user.read']
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const userProfile = {
              id: profile.id,
              email: profile.emails?.[0]?.value || profile._json?.mail || profile._json?.userPrincipalName,
              name: profile.displayName || (profile.name?.givenName + ' ' + profile.name?.familyName) || 'Microsoft User',
              picture: null
            };
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

