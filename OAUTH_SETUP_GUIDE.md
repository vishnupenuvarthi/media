# OAuth Authentication Setup Guide

This guide will help you set up Google, Microsoft, and Apple OAuth authentication for NLR LIVE NEWS.

## Prerequisites

- Backend server running
- Frontend application running
- Access to OAuth provider developer consoles

---

## 1. Google OAuth Setup

### Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. Choose **Web application**
6. Add authorized redirect URIs:
   - Development: `http://localhost:5001/api/auth/google/callback`
   - Production: `https://your-backend-domain.com/api/auth/google/callback`
7. Copy the **Client ID** and **Client Secret**

### Step 2: Add to Backend Environment

Add to your `.env` file:

```env
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Step 3: Test

1. Restart your backend server
2. Click "Continue with Google" on the login page
3. You should be redirected to Google's consent screen
4. After approval, you'll be redirected back and logged in

---

## 2. Microsoft OAuth Setup

### Step 1: Register Application in Azure

1. Go to [Azure Portal](https://portal.azure.com/)
2. Navigate to **Azure Active Directory** > **App registrations**
3. Click **New registration**
4. Fill in:
   - **Name**: NLR LIVE NEWS
   - **Supported account types**: Accounts in any organizational directory and personal Microsoft accounts
   - **Redirect URI**: 
     - Development: `http://localhost:5001/api/auth/microsoft/callback`
     - Production: `https://your-backend-domain.com/api/auth/microsoft/callback`
     - Type: **Web**
5. Click **Register**
6. Go to **Certificates & secrets** > **New client secret**
7. Copy the **Value** (this is your client secret - save it immediately!)
8. Go to **Overview** and copy the **Application (client) ID**

### Step 2: Configure API Permissions

1. Go to **API permissions**
2. Click **Add a permission** > **Microsoft Graph** > **Delegated permissions**
3. Add:
   - `user.read`
   - `email`
   - `profile`
4. Click **Add permissions**
5. Click **Grant admin consent** (if you have admin rights)

### Step 3: Add to Backend Environment

Add to your `.env` file:

```env
MICROSOFT_CLIENT_ID=your-microsoft-application-id
MICROSOFT_CLIENT_SECRET=your-microsoft-client-secret
```

### Step 4: Test

1. Restart your backend server
2. Click "Continue with Microsoft" on the login page
3. You should be redirected to Microsoft's login screen
4. After login, you'll be redirected back and logged in

---

## 3. Apple OAuth Setup

### Step 1: Create Apple App ID and Service ID

1. Go to [Apple Developer Portal](https://developer.apple.com/)
2. Navigate to **Certificates, Identifiers & Profiles**
3. Create an **App ID** (if you don't have one)
4. Create a **Services ID**:
   - **Description**: NLR LIVE NEWS
   - **Identifier**: `com.nlrlivenews.web` (use your domain)
   - Enable **Sign in with Apple**
   - Configure:
     - **Primary App ID**: Select your App ID
     - **Website URLs**:
       - Domains: `your-domain.com`
       - Return URLs: 
         - Development: `http://localhost:5001/api/auth/apple/callback`
         - Production: `https://your-backend-domain.com/api/auth/apple/callback`

### Step 2: Create a Key

1. Go to **Keys**
2. Click **+** to create a new key
3. Name it: "NLR LIVE NEWS Sign in with Apple"
4. Enable **Sign in with Apple**
5. Click **Configure** and select your Primary App ID
6. Click **Save** > **Continue** > **Register**
7. **Download the key file** (`.p8` file) - you can only download it once!
8. Note the **Key ID**

### Step 3: Get Your Team ID

1. Go to **Membership** in Apple Developer Portal
2. Copy your **Team ID**

### Step 4: Add to Backend Environment

Add to your `.env` file:

```env
APPLE_CLIENT_ID=com.nlrlivenews.web
APPLE_TEAM_ID=your-team-id
APPLE_KEY_ID=your-key-id
APPLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_CONTENT\n-----END PRIVATE KEY-----"
```

**Important**: 
- The private key should be the entire content of the `.p8` file
- Keep the `\n` characters or use actual newlines
- Wrap in quotes if it contains special characters

### Step 5: Test

1. Restart your backend server
2. Click "Continue with Apple" on the login page
3. You should be redirected to Apple's sign-in screen
4. After approval, you'll be redirected back and logged in

---

## 4. Environment Variables Summary

Add all OAuth credentials to your `.env` file:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Microsoft OAuth
MICROSOFT_CLIENT_ID=your-microsoft-application-id
MICROSOFT_CLIENT_SECRET=your-microsoft-client-secret

# Apple OAuth
APPLE_CLIENT_ID=com.nlrlivenews.web
APPLE_TEAM_ID=your-team-id
APPLE_KEY_ID=your-key-id
APPLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----"

# Frontend URL (for OAuth callbacks)
FRONTEND_URL=http://localhost:5174
CLIENT_URL=http://localhost:5174

# Backend URL (for OAuth callbacks)
BACKEND_URL=http://localhost:5001
```

---

## 5. Production Setup

### Update Redirect URIs

For production, update redirect URIs in each provider:

1. **Google**: Add `https://your-backend-domain.com/api/auth/google/callback`
2. **Microsoft**: Add `https://your-backend-domain.com/api/auth/microsoft/callback`
3. **Apple**: Add `https://your-backend-domain.com/api/auth/apple/callback`

### Update Environment Variables

Set these in your hosting platform (Render, Heroku, etc.):

```env
FRONTEND_URL=https://your-frontend-domain.com
BACKEND_URL=https://your-backend-domain.com
```

---

## 6. Troubleshooting

### Google OAuth Issues

- **Error: redirect_uri_mismatch**: Check that the redirect URI in Google Console matches exactly
- **Error: invalid_client**: Verify CLIENT_ID and CLIENT_SECRET are correct

### Microsoft OAuth Issues

- **Error: AADSTS50011**: Redirect URI mismatch - check Azure portal settings
- **Error: invalid_client**: Verify CLIENT_ID and CLIENT_SECRET
- **No email returned**: Ensure `email` and `profile` scopes are granted

### Apple OAuth Issues

- **Error: invalid_client**: Check APPLE_CLIENT_ID matches your Services ID
- **Error: invalid_key**: Verify APPLE_PRIVATE_KEY format (must include BEGIN/END markers)
- **No email on subsequent logins**: This is normal for Apple - the system handles it

### General Issues

- **OAuth not working**: Check backend logs for strategy registration messages
- **Redirect loop**: Verify FRONTEND_URL is set correctly
- **CORS errors**: Ensure CORS is configured for your frontend domain

---

## 7. Testing Checklist

- [ ] Google OAuth works in development
- [ ] Microsoft OAuth works in development
- [ ] Apple OAuth works in development
- [ ] All OAuth providers work in production
- [ ] Users can sign in with existing accounts
- [ ] New users are created automatically
- [ ] User profile information is saved correctly
- [ ] Tokens are generated and stored properly

---

## 8. Security Notes

1. **Never commit** `.env` files to git
2. **Rotate secrets** if they're exposed
3. **Use HTTPS** in production
4. **Validate redirect URIs** match exactly
5. **Keep private keys secure** - especially Apple's `.p8` file

---

## Support

If you encounter issues:

1. Check backend logs for error messages
2. Verify all environment variables are set
3. Test each provider individually
4. Check OAuth provider dashboards for errors
5. Ensure redirect URIs match exactly (including http/https and trailing slashes)

