# 🎨 Frontend Setup & Access Guide

## 🚀 Quick Start - Run Frontend Locally

### Step 1: Navigate to Frontend Directory
```bash
cd /Users/vishnupenuvarthi/Desktop/media/frontend
```

### Step 2: Install Dependencies (if not already done)
```bash
npm install
```

### Step 3: Start Frontend Development Server
```bash
npm run dev
```

### Step 4: Access Frontend
Open your browser and go to:
```
http://localhost:5174
```

The frontend will automatically proxy API requests to your backend at `http://localhost:5001`.

---

## 🌐 Deploy Frontend to Vercel (Production)

### Step 1: Push Code to GitHub
Make sure your code is pushed:
```bash
cd /Users/vishnupenuvarthi/Desktop/media
git add .
git commit -m "Ready for frontend deployment"
git push origin main
```

### Step 2: Deploy to Vercel

1. **Go to Vercel**: https://vercel.com
2. **Sign up/Login** (use GitHub to connect)
3. **Click "Add New..." → "Project"**
4. **Import your GitHub repository**: `vishnupenuvarthi/media`
5. **Configure Project**:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend` ⚠️ Important!
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

6. **Add Environment Variable**:
   - Click **"Environment Variables"**
   - Add:
     ```
     VITE_API_URL=https://your-backend-url.onrender.com/api
     ```
   - Replace `your-backend-url.onrender.com` with your actual Render backend URL
   - Example: `https://nlrnews-backend.onrender.com/api`

7. **Click "Deploy"**
8. **Wait 2-3 minutes** for deployment
9. **Copy your frontend URL** (e.g., `https://media.vercel.app`)

---

## 🔧 Frontend Configuration

### Local Development
- **Port**: `5174`
- **Backend Proxy**: Automatically proxies `/api` to `http://localhost:5001`
- **No environment variables needed** for local development

### Production (Vercel)
- **Environment Variable Required**: `VITE_API_URL`
- **Format**: `https://your-backend.onrender.com/api`
- **Auto-deploys** when you push to GitHub

---

## 📝 Current Frontend Setup

- **Framework**: React + Vite
- **Styling**: TailwindCSS
- **State Management**: Zustand
- **API Client**: Axios (configured in `src/lib/api.js`)
- **Routing**: React Router

---

## 🐛 Troubleshooting

### Frontend won't start locally
```bash
# Make sure backend is running first
cd ../backend
npm run dev

# Then start frontend in another terminal
cd ../frontend
npm run dev
```

### API calls failing
- Check backend is running on `http://localhost:5001`
- Check browser console for errors
- Verify backend health: `curl http://localhost:5001/api/health`

### Vercel deployment fails
- Check build logs in Vercel dashboard
- Verify `VITE_API_URL` is set correctly
- Make sure Root Directory is set to `frontend`

---

## ✅ Quick Commands

```bash
# Start frontend locally
cd frontend
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Lint code
npm run lint
```

---

## 🌍 Access Your Deployed Frontend

Once deployed to Vercel:
1. Go to Vercel Dashboard
2. Click on your project
3. Copy the deployment URL (e.g., `https://media.vercel.app`)
4. Share with users!

---

**Your frontend is ready! 🎉**


