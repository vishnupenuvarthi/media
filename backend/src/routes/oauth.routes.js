import express from 'express';
import passport from '../config/passport.js';
import { oauthCallback } from '../controllers/oauth.controller.js';
import { env } from '../config/env.js';

const router = express.Router();

// Helper to check if strategy is registered
const isStrategyRegistered = (strategyName) => {
  return passport._strategies && passport._strategies[strategyName];
};

// Google OAuth
router.get('/google', (req, res, next) => {
  if (!isStrategyRegistered('google')) {
    return res.status(503).json({
      success: false,
      message: 'Google OAuth is not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in environment variables.'
    });
  }
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

router.get(
  '/google/callback',
  (req, res, next) => {
    if (!isStrategyRegistered('google')) {
      return res.redirect(`${env.frontendUrl}/login?error=oauth_not_configured`);
    }
    passport.authenticate('google', { session: false, failureRedirect: `${env.frontendUrl}/login?error=oauth_failed` })(req, res, next);
  },
  oauthCallback
);

// Apple OAuth
router.get('/apple', (req, res, next) => {
  if (!isStrategyRegistered('apple')) {
    return res.status(503).json({
      success: false,
      message: 'Apple OAuth is not configured. Please set APPLE_CLIENT_ID, APPLE_TEAM_ID, APPLE_KEY_ID, and APPLE_PRIVATE_KEY in environment variables.'
    });
  }
  passport.authenticate('apple', { scope: ['name', 'email'] })(req, res, next);
});

router.get(
  '/apple/callback',
  (req, res, next) => {
    if (!isStrategyRegistered('apple')) {
      return res.redirect(`${env.frontendUrl}/login?error=oauth_not_configured`);
    }
    passport.authenticate('apple', { session: false, failureRedirect: `${env.frontendUrl}/login?error=oauth_failed` })(req, res, next);
  },
  oauthCallback
);

// Microsoft OAuth
router.get('/microsoft', (req, res, next) => {
  if (!isStrategyRegistered('microsoft')) {
    return res.status(503).json({
      success: false,
      message: 'Microsoft OAuth is not configured. Please set MICROSOFT_CLIENT_ID and MICROSOFT_CLIENT_SECRET in environment variables.'
    });
  }
  passport.authenticate('microsoft', { scope: ['user.read', 'email', 'profile'] })(req, res, next);
});

router.get(
  '/microsoft/callback',
  (req, res, next) => {
    if (!isStrategyRegistered('microsoft')) {
      return res.redirect(`${env.frontendUrl}/login?error=oauth_not_configured`);
    }
    passport.authenticate('microsoft', { session: false, failureRedirect: `${env.frontendUrl}/login?error=oauth_failed` })(req, res, next);
  },
  oauthCallback
);

export default router;

