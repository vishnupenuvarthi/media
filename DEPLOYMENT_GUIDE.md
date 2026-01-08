# 🚀 Free Deployment Guide

This guide will help you deploy your news application for **FREE** using:
- **Render** (Backend) - Free tier
- **Vercel** (Frontend) - Free tier
- **MongoDB Atlas** (Database) - Free tier (512MB)

---

## 📋 Prerequisites

1. **GitHub Account** - Free
2. **Render Account** - Free at [render.com](https://render.com)
3. **Vercel Account** - Free at [vercel.com](https://vercel.com)
4. **MongoDB Atlas Account** - Free at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)

---

## 🗄️ Step 1: Setup MongoDB Atlas (Database)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for free account
3. Create a new cluster (choose FREE tier)
4. Create a database user:
   - Go to "Database Access" → "Add New Database User"
   - Username: `newsroom-user` (or your choice)
   - Password: Generate secure password (save it!)
   - Database User Privileges: "Read and write to any database"
5. Whitelist IP addresses:
   - Go to "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (for development) or add specific IPs
6. Get connection string:
   - Go to "Database" → "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Example: `mongodb+srv://newsroom-user:yourpassword@cluster0.xxxxx.mongodb.net/newsroom?retryWrites=true&w=majority`

**Save this connection string - you'll need it!**

---

## 🔧 Step 2: Prepare Your Code

### 2.1 Push to GitHub

If you haven't already, push your code to GitHub:

```bash
cd /Users/vishnupenuvarthi/Desktop/media

# Initialize git if not already done
git init
git add .
git commit -m "Initial commit - ready for deployment"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

---

## 🖥️ Step 3: Deploy Backend to Render

1. **Go to [Render Dashboard](https://dashboard.render.com)**
2. **Click "New +" → "Web Service"**
3. **Connect your GitHub repository**
4. **Configure the service:**
   - **Name**: `newsroom-backend` (or your choice)
   - **Environment**: `Node`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`

5. **Add Environment Variables:**
   Click "Advanced" → "Add Environment Variable" and add:

   ```
   NODE_ENV=production
   PORT=10000
   MONGO_URI=your_mongodb_connection_string_here
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_REFRESH_SECRET=your_super_secret_refresh_key_here
   FRONTEND_URL=https://your-frontend-url.vercel.app
   CLIENT_URL=https://your-frontend-url.vercel.app
   ```

   **Important:**
   - Replace `your_mongodb_connection_string_here` with your MongoDB Atlas connection string
   - Generate secure random strings for `JWT_SECRET` and `JWT_REFRESH_SECRET`
   - For `FRONTEND_URL` and `CLIENT_URL`, you'll update these after deploying frontend

6. **Click "Create Web Service"**
7. **Wait for deployment** (takes 5-10 minutes)
8. **Copy your backend URL** (e.g., `https://newsroom-backend.onrender.com`)

**Note:** Free tier on Render spins down after 15 minutes of inactivity. First request after spin-down takes ~30 seconds.

---

## 🎨 Step 4: Deploy Frontend to Vercel

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**
2. **Click "Add New..." → "Project"**
3. **Import your GitHub repository**
4. **Configure the project:**
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. **Add Environment Variables:**
   Click "Environment Variables" and add:

   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```

   Replace `your-backend-url.onrender.com` with your actual Render backend URL

6. **Click "Deploy"**
7. **Wait for deployment** (takes 2-3 minutes)
8. **Copy your frontend URL** (e.g., `https://your-app.vercel.app`)

---

## 🔄 Step 5: Update Backend with Frontend URL

1. Go back to **Render Dashboard**
2. Click on your backend service
3. Go to "Environment" tab
4. Update these variables:
   ```
   FRONTEND_URL=https://your-frontend-url.vercel.app
   CLIENT_URL=https://your-frontend-url.vercel.app
   ```
5. Click "Save Changes" - this will trigger a redeploy

---

## 🔧 Step 6: Update Vercel Rewrites (Optional)

If you want to use `/api` proxy instead of full URL:

1. Go to **Vercel Dashboard** → Your project → **Settings** → **Functions**
2. Or update `vercel.json` in your frontend folder with your actual backend URL
3. Redeploy frontend

---

## ✅ Step 7: Verify Deployment

1. **Visit your frontend URL**: `https://your-app.vercel.app`
2. **Test the application:**
   - Homepage loads
   - Articles display
   - Can register/login
   - Images load correctly

---

## 🔐 Step 8: Update CORS (If Needed)

If you get CORS errors:

1. Go to **Render Dashboard** → Your backend service
2. Check that `FRONTEND_URL` matches your Vercel URL exactly
3. The backend already has CORS configured to use `FRONTEND_URL`

---

## 📝 Environment Variables Summary

### Backend (Render):
```
NODE_ENV=production
PORT=10000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
JWT_SECRET=random-secret-key-here
JWT_REFRESH_SECRET=random-refresh-key-here
FRONTEND_URL=https://your-app.vercel.app
CLIENT_URL=https://your-app.vercel.app
```

### Frontend (Vercel):
```
VITE_API_URL=https://your-backend.onrender.com/api
```

---

## 🐛 Troubleshooting

### Backend Issues:

1. **"Database connection failed"**
   - Check MongoDB Atlas IP whitelist includes `0.0.0.0/0`
   - Verify `MONGO_URI` is correct in Render environment variables
   - Check password in connection string is correct

2. **"Port already in use"**
   - Render uses port 10000 automatically - don't set PORT manually
   - Remove PORT from environment variables if you added it

3. **"Build failed"**
   - Check build logs in Render dashboard
   - Ensure `package.json` has correct `start` script
   - Verify all dependencies are in `dependencies`, not `devDependencies`

### Frontend Issues:

1. **"API calls failing"**
   - Check `VITE_API_URL` in Vercel environment variables
   - Verify backend URL is correct (include `/api` at the end)
   - Check browser console for CORS errors

2. **"Images not loading"**
   - Verify backend is running
   - Check network tab in browser DevTools
   - Ensure image URLs are absolute (not relative)

3. **"Build failed"**
   - Check build logs in Vercel dashboard
   - Ensure `vite.config.js` is correct
   - Verify all dependencies are installed

---

## 🚀 Quick Deploy Commands

### Generate JWT Secrets (for backend):
```bash
# Generate random secrets
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Run this twice to get two different secrets for `JWT_SECRET` and `JWT_REFRESH_SECRET`.

---

## 📊 Free Tier Limits

### Render (Backend):
- ✅ 750 hours/month free
- ⚠️ Spins down after 15 min inactivity (30s cold start)
- ✅ 512MB RAM
- ✅ Free SSL

### Vercel (Frontend):
- ✅ Unlimited deployments
- ✅ Free SSL
- ✅ Global CDN
- ✅ 100GB bandwidth/month

### MongoDB Atlas:
- ✅ 512MB storage
- ✅ Shared cluster
- ✅ Free forever

---

## 🎉 You're Done!

Your application is now live and accessible worldwide!

**Frontend**: `https://your-app.vercel.app`  
**Backend**: `https://your-backend.onrender.com`

---

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com)

---

## 🔄 Updating Your Deployment

After making code changes:

1. **Push to GitHub**: `git push origin main`
2. **Render** will auto-deploy backend
3. **Vercel** will auto-deploy frontend
4. Both platforms auto-detect changes and redeploy

---

**Need help?** Check the troubleshooting section or review the deployment logs in Render/Vercel dashboards.

