# 🚀 Vercel Frontend Deployment - Quick Setup

## Your Backend URL
```
https://nlrnews-backend.onrender.com
```

---

## 📍 Where to Put the Backend URL

### Option 1: Vercel Environment Variable (Recommended) ✅

When deploying to Vercel:

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Click "Add New..." → "Project"**
3. **Import your repository**: `vishnupenuvarthi/media`
4. **Configure**:
   - Root Directory: `frontend`
   - Framework: `Vite`
5. **Before clicking Deploy, click "Environment Variables"**
6. **Add this variable**:
   ```
   Name:  VITE_API_URL
   Value: https://nlrnews-backend.onrender.com/api
   ```
7. **Click "Deploy"**

---

### Option 2: Already Updated in vercel.json ✅

I've already updated `vercel.json` with your backend URL. This will work for API rewrites.

**But you still need to add the environment variable in Vercel dashboard** for the frontend to use it.

---

## ✅ Complete Setup Steps

### 1. Deploy to Vercel

1. Go to: https://vercel.com
2. Sign up/Login with GitHub
3. Click **"Add New..." → "Project"**
4. Import: `vishnupenuvarthi/media`
5. Configure:
   - **Root Directory**: `frontend` ⚠️ Important!
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)

### 2. Add Environment Variable

**Before deploying**, click **"Environment Variables"** and add:

```
VITE_API_URL = https://nlrnews-backend.onrender.com/api
```

### 3. Deploy

Click **"Deploy"** and wait 2-3 minutes.

### 4. Get Your Frontend URL

After deployment, Vercel will give you a URL like:
```
https://media.vercel.app
```
or
```
https://media-xxxxx.vercel.app
```

---

## 🔄 Update Backend with Frontend URL

After you get your Vercel frontend URL:

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Click on your service**: `nlrnews_backend`
3. **Go to "Environment" tab**
4. **Update these variables**:
   ```
   FRONTEND_URL = https://your-frontend-url.vercel.app
   CLIENT_URL = https://your-frontend-url.vercel.app
   ```
5. **Save** - This will auto-redeploy your backend

---

## ✅ Summary

**Backend URL**: `https://nlrnews-backend.onrender.com`

**Where to put it:**
1. ✅ **Vercel Environment Variable**: `VITE_API_URL = https://nlrnews-backend.onrender.com/api`
2. ✅ **vercel.json**: Already updated (for API rewrites)
3. ✅ **Render Environment**: Update `FRONTEND_URL` after you get Vercel URL

---

## 🎯 Quick Checklist

- [ ] Deploy frontend to Vercel
- [ ] Add `VITE_API_URL` environment variable in Vercel
- [ ] Get your Vercel frontend URL
- [ ] Update `FRONTEND_URL` in Render backend
- [ ] Test your deployed frontend

---

**Your backend URL is configured! Now deploy to Vercel! 🚀**

