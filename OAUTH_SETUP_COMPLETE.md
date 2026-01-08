# ✅ OAuth Authentication - Complete Setup Guide

## 🎉 What's Fixed

All OAuth authentication issues have been resolved:
- ✅ Passport strategies now register properly with error handling
- ✅ Callback URLs use full URLs instead of relative paths
- ✅ Routes handle missing OAuth configurations gracefully
- ✅ Frontend displays proper error messages
- ✅ OAuth buttons work correctly

---

## 🚀 Quick Setup Guide

### Step 1: Configure Environment Variables

Add OAuth credentials to your `backend/.env` file:

```env
# Required for all OAuth
BACKEND_URL=http://localhost:5001
FRONTEND_URL=http://localhost:5174

# Google OAuth (Required for Google login)
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Microsoft OAuth (Required for Microsoft login)
MICROSOFT_CLIENT_ID=your_microsoft_client_id_here
MICROSOFT_CLIENT_SECRET=your_microsoft_client_secret_here

# Apple OAuth (Required for Apple login)
APPLE_CLIENT_ID=your_apple_client_id_here
APPLE_TEAM_ID=your_apple_team_id_here
APPLE_KEY_ID=your_apple_key_id_here
APPLE_PRIVATE_KEY=your_apple_private_key_here
```

**Note:** You only need to configure the OAuth providers you want to use. If a provider is not configured, users will see an error message when trying to use it.

---

## 📋 Google OAuth Setup

### 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable **Google+ API** (or **Google Identity Services**)
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure the consent screen if prompted:
   - User Type: External
   - App name: NLR NEWS (or your app name)
   - Support email: your email
   - Developer contact: your email
6. Create OAuth 2.0 Client ID:
   - Application type: **Web application**
   - Name: NLR NEWS Web Client
   - Authorized redirect URIs:
     - `http://localhost:5001/api/auth/google/callback` (development)
     - `https://yourdomain.com/api/auth/google/callback` (production)
7. Copy the **Client ID** and **Client Secret**

### 2. Add to .env

```env
GOOGLE_CLIENT_ID=paste_your_client_id_here
GOOGLE_CLIENT_SECRET=paste_your_client_secret_here
```

---

## 📋 Microsoft OAuth Setup

### 1. Create Microsoft Azure App Registration

1. Go to [Azure Portal](https://portal.azure.com/)
2. Navigate to **Azure Active Directory** → **App registrations**
3. Click **New registration**
4. Fill in:
   - Name: NLR NEWS
   - Supported account types: Accounts in any organizational directory and personal Microsoft accounts
   - Redirect URI:
     - Platform: Web
     - URI: `http://localhost:5001/api/auth/microsoft/callback` (development)
     - Add another for production: `https://yourdomain.com/api/auth/microsoft/callback`
5. Click **Register**
6. Go to **Certificates & secrets** → **New client secret**
   - Description: Web Client Secret
   - Expires: 24 months (or your preference)
   - Click **Add**
   - **Copy the secret value immediately** (you won't see it again!)
7. Copy the **Application (client) ID** from the Overview page

### 2. Configure API Permissions

1. Go to **API permissions**
2. Click **Add a permission**
3. Select **Microsoft Graph**
4. Select **Delegated permissions**
5. Add: `User.Read`
6. Click **Add permissions**
7. Click **Grant admin consent** (if you have admin rights)

### 3. Add to .env

```env
MICROSOFT_CLIENT_ID=paste_your_application_id_here
MICROSOFT_CLIENT_SECRET=paste_your_client_secret_here
```

---

## 📋 Apple OAuth Setup

### 1. Create Apple App ID

1. Go to [Apple Developer Portal](https://developer.apple.com/)
2. Navigate to **Certificates, Identifiers & Profiles**
3. Go to **Identifiers** → **App IDs**
4. Click **+** to create new App ID
5. Fill in:
   - Description: NLR NEWS
   - Bundle ID: com.yourcompany.nlrnews (must be unique)
   - Enable **Sign in with Apple** capability
6. Click **Continue** → **Register**

### 2. Create Service ID

1. Go to **Identifiers** → **Services IDs**
2. Click **+** to create new Service ID
3. Fill in:
   - Description: NLR NEWS Web
   - Identifier: com.yourcompany.nlrnews.web (must be unique)
   - Enable **Sign in with Apple**
4. Click **Configure** next to Sign in with Apple:
   - Primary App ID: Select the App ID you created
   - Website URLs:
     - Domains: `localhost:5001` (development) and your production domain
     - Return URLs:
       - `http://localhost:5001/api/auth/apple/callback` (development)
       - `https://yourdomain.com/api/auth/apple/callback` (production)
5. Click **Save** → **Continue** → **Register**

### 3. Create Key

1. Go to **Keys**
2. Click **+** to create new key
3. Fill in:
   - Key Name: NLR NEWS Sign in with Apple Key
   - Enable **Sign in with Apple**
4. Click **Configure**:
   - Primary App ID: Select your App ID
5. Click **Save** → **Continue** → **Register**
6. **Download the .p8 key file** (you can only download once!)
7. Copy the **Key ID** (shown after creation)

### 4. Get Team ID

1. Go to **Membership** in Apple Developer Portal
2. Copy your **Team ID**

### 5. Add to .env

```env
APPLE_CLIENT_ID=com.yourcompany.nlrnews.web
APPLE_TEAM_ID=your_team_id_here
APPLE_KEY_ID=your_key_id_here
APPLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nYOUR_KEY_CONTENT_HERE\n-----END PRIVATE KEY-----
```

**Important:** 
- Replace newlines in the private key with `\n`
- Keep the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` markers
- The entire key should be on one line with `\n` for line breaks

---

## ✅ Testing OAuth

### 1. Start Backend

```bash
cd backend
npm run dev
```

You should see:
```
✅ Google OAuth strategy registered
✅ Microsoft OAuth strategy registered
✅ Apple OAuth strategy registered
```

If a strategy is not configured, you'll see:
```
⚠️  Google OAuth not configured (missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET)
```

### 2. Start Frontend

```bash
cd frontend
npm run dev
```

### 3. Test OAuth Login

1. Navigate to `http://localhost:5174/login`
2. Click on any OAuth button (Google, Apple, or Microsoft)
3. You'll be redirected to the provider's login page
4. Sign in with your provider account
5. You'll be redirected back to the app and automatically logged in

---

## 🐛 Troubleshooting

### Error: "Unknown authentication strategy 'google'"

**Solution:** 
- Check that `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set in `.env`
- Restart the backend server after adding environment variables
- Check backend console for registration messages

### Error: "OAuth provider is not configured"

**Solution:**
- The OAuth provider you're trying to use is not configured
- Add the required environment variables for that provider
- Restart the backend server

### Error: "redirect_uri_mismatch"

**Solution:**
- The callback URL in your OAuth provider settings doesn't match
- For Google: Check Authorized redirect URIs in Google Cloud Console
- For Microsoft: Check Redirect URIs in Azure App Registration
- For Apple: Check Return URLs in Service ID configuration
- Make sure URLs match exactly (including http/https and port)

### OAuth button doesn't work

**Solution:**
- Check browser console for errors
- Verify backend is running on port 5001
- Check that `/api/auth/google` (or other provider) is accessible
- Verify proxy configuration in `vite.config.js`

### OAuth callback fails

**Solution:**
- Check that `FRONTEND_URL` is set correctly in `.env`
- Verify the callback URL in OAuth provider settings
- Check backend console for error messages
- Ensure MongoDB is connected (OAuth users need to be saved)

---

## 📝 Important Notes

1. **Development vs Production:**
   - Use `http://localhost:5001` for development
   - Use your production domain for production
   - Update callback URLs in OAuth provider settings for both environments

2. **Security:**
   - Never commit `.env` file to version control
   - Use strong client secrets
   - Rotate secrets periodically
   - Use HTTPS in production

3. **User Accounts:**
   - OAuth users are automatically created in the database
   - If an email already exists, OAuth will link to that account
   - OAuth users don't need passwords

4. **Multiple Providers:**
   - Users can link multiple OAuth providers to the same account
   - The system matches by email address

---

## 🎉 You're All Set!

Once you've configured at least one OAuth provider, users can:
- Click the OAuth button on the login page
- Sign in with their Google/Apple/Microsoft account
- Be automatically logged into your application
- Have their account created automatically if it doesn't exist

Enjoy seamless OAuth authentication! 🚀

