# 🔧 Render Deployment Fix

## The Problem
Error: `Cannot find module '/opt/render/project/src/backend/server.js'`

Render is trying to run `node server.js` instead of `node src/server.js`

## Solution

### Option 1: Fix in Render Dashboard (Recommended)

1. Go to your Render dashboard
2. Click on your service (`nlrnews_back`)
3. Go to **Settings** tab
4. Scroll to **Build & Deploy** section
5. Update these fields:

   **Root Directory:** `backend`
   
   **Build Command:** `npm install`
   
   **Start Command:** `npm start` (NOT `node server.js`)

6. Click **Save Changes**
7. Go to **Events** tab and click **Manual Deploy** → **Deploy latest commit**

### Option 2: Verify render.yaml (If using Blueprint)

If you're using the `render.yaml` file, make sure:
- Root directory is set to `backend` in Render dashboard
- The yaml file is in the root of your repo (not in backend folder)

---

## Correct Configuration

**Root Directory:** `backend`  
**Build Command:** `npm install`  
**Start Command:** `npm start`  

The `npm start` command will run `node src/server.js` as defined in `package.json`.

---

## After Fixing

1. Save the changes in Render
2. The service will auto-redeploy
3. Check the logs - you should see: `🚀 Server running on port 10000`
4. Test: `https://your-service.onrender.com/api/health`

