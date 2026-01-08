# OAuth Setup Guide

This guide explains how to configure OAuth authentication (Google, Apple, Microsoft) for the NLR NEWS application.

## Prerequisites

- Backend server running on port 5001 (or configured port)
- Frontend running on port 5173 (or configured port)
- OAuth app credentials from each provider

## Environment Variables

Add the following variables to your `backend/.env` file:

```env
# OAuth Providers
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

MICROSOFT_CLIENT_ID=your_microsoft_client_id
MICROSOFT_CLIENT_SECRET=your_microsoft_client_secret

# Apple OAuth (requires additional setup)
APPLE_CLIENT_ID=your_apple_client_id
APPLE_TEAM_ID=your_apple_team_id
APPLE_KEY_ID=your_apple_key_id
APPLE_PRIVATE_KEY=your_apple_private_key
```

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure consent screen if prompted
6. Set application type to "Web application"
7. Add authorized redirect URIs:
   - `http://localhost:5001/api/auth/google/callback` (development)
   - `https://yourdomain.com/api/auth/google/callback` (production)
8. Copy the Client ID and Client Secret to your `.env` file

## Microsoft OAuth Setup

1. Go to [Azure Portal](https://portal.azure.com/)
2. Navigate to "Azure Active Directory" → "App registrations"
3. Click "New registration"
4. Set name and redirect URI:
   - `http://localhost:5001/api/auth/microsoft/callback` (development)
   - `https://yourdomain.com/api/auth/microsoft/callback` (production)
5. Go to "Certificates & secrets" → "New client secret"
6. Copy the Application (client) ID and client secret to your `.env` file
7. Add API permissions: `User.Read` (Microsoft Graph)

## Apple OAuth Setup

1. Go to [Apple Developer Portal](https://developer.apple.com/)
2. Create an App ID with "Sign in with Apple" capability
3. Create a Service ID
4. Configure redirect URLs:
   - `http://localhost:5001/api/auth/apple/callback` (development)
   - `https://yourdomain.com/api/auth/apple/callback` (production)
5. Create a Key with "Sign in with Apple" enabled
6. Download the `.p8` key file
7. Copy the following to your `.env`:
   - Client ID (Service ID)
   - Team ID
   - Key ID
   - Private Key (contents of `.p8` file, replace newlines with `\n`)

## Callback URLs

Make sure your OAuth providers have these callback URLs configured:

- **Google**: `/api/auth/google/callback`
- **Microsoft**: `/api/auth/microsoft/callback`
- **Apple**: `/api/auth/apple/callback`

## Testing

1. Start the backend server: `npm run dev`
2. Start the frontend: `npm run dev`
3. Navigate to `/login` or `/register`
4. Click on any OAuth provider button
5. Complete the OAuth flow
6. You should be redirected back to the application and logged in

## Notes

- OAuth users are automatically created in the database
- If an email already exists, OAuth will link to that account
- OAuth users don't require passwords
- The `oauthProvider` and `oauthId` fields are stored in the user model

## Troubleshooting

- **"OAuth failed" error**: Check that callback URLs match exactly in provider settings
- **"Invalid client" error**: Verify Client ID and Secret are correct
- **Redirect loop**: Ensure `FRONTEND_URL` is set correctly in `.env`
- **Apple OAuth not working**: Ensure private key is properly formatted with `\n` for newlines



