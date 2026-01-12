# Quick OAuth Setup Guide

## Current Status

Run this to check OAuth status:
```bash
curl http://localhost:5001/api/auth/status
```

## Required Environment Variables

Add these to `backend/.env`:

### Google OAuth (Easiest to set up)
```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
```

**Get credentials:**
1. Go to https://console.cloud.google.com/
2. Create project → APIs & Services → Credentials
3. Create OAuth 2.0 Client ID
4. Add redirect URI: `http://localhost:5001/api/auth/google/callback`

### Microsoft OAuth
```env
MICROSOFT_CLIENT_ID=your-application-id
MICROSOFT_CLIENT_SECRET=your-client-secret
```

**Get credentials:**
1. Go to https://portal.azure.com/
2. Azure Active Directory → App registrations → New registration
3. Add redirect URI: `http://localhost:5001/api/auth/microsoft/callback`
4. Create client secret in Certificates & secrets

### Apple OAuth (Most Complex)
```env
APPLE_CLIENT_ID=com.yourdomain.web
APPLE_TEAM_ID=your-team-id
APPLE_KEY_ID=your-key-id
APPLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY\n-----END PRIVATE KEY-----"
```

**Get credentials:**
1. Go to https://developer.apple.com/
2. Create Services ID
3. Enable Sign in with Apple
4. Create Key (.p8 file) - download immediately!
5. Copy Team ID from Membership page

## After Adding Credentials

1. **Restart backend server:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Check status:**
   ```bash
   curl http://localhost:5001/api/auth/status
   ```
   Should show `"google": true` if configured.

3. **Test OAuth:**
   - Go to login page
   - Click "Continue with Google"
   - Should redirect to Google login

## Troubleshooting

### OAuth button does nothing
- Check browser console for errors
- Verify backend is running on port 5001
- Check that OAuth credentials are in `.env` file

### "OAuth not configured" error
- Verify environment variables are set correctly
- Restart backend server after adding variables
- Check backend logs for strategy registration messages

### Redirect URI mismatch
- Ensure redirect URI in provider console matches exactly:
  - Development: `http://localhost:5001/api/auth/{provider}/callback`
  - Production: `https://your-backend-domain.com/api/auth/{provider}/callback`

### CORS errors
- Backend CORS is configured to allow OAuth redirects
- If issues persist, check `FRONTEND_URL` in backend `.env`


