# ✅ Deployment Checklist

Use this checklist to ensure everything is set up correctly before deploying.

## Pre-Deployment

- [ ] Code is pushed to GitHub
- [ ] MongoDB Atlas account created
- [ ] MongoDB cluster created (FREE tier)
- [ ] Database user created with read/write permissions
- [ ] IP whitelist configured (allow `0.0.0.0/0` for development)
- [ ] MongoDB connection string copied and saved

## Backend Deployment (Render)

- [ ] Render account created
- [ ] GitHub repository connected to Render
- [ ] New Web Service created
- [ ] Root directory set to `backend`
- [ ] Build command: `npm install`
- [ ] Start command: `npm start`
- [ ] Environment variables added:
  - [ ] `NODE_ENV=production`
  - [ ] `PORT=10000` (or leave empty - Render auto-assigns)
  - [ ] `MONGO_URI` (your MongoDB connection string)
  - [ ] `JWT_SECRET` (random secure string)
  - [ ] `JWT_REFRESH_SECRET` (random secure string)
  - [ ] `FRONTEND_URL` (will update after frontend deploy)
  - [ ] `CLIENT_URL` (will update after frontend deploy)
- [ ] Service deployed successfully
- [ ] Backend URL copied (e.g., `https://newsroom-backend.onrender.com`)

## Frontend Deployment (Vercel)

- [ ] Vercel account created
- [ ] GitHub repository imported
- [ ] Root directory set to `frontend`
- [ ] Framework preset: `Vite`
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] Environment variable added:
  - [ ] `VITE_API_URL` = `https://your-backend-url.onrender.com/api`
- [ ] Frontend deployed successfully
- [ ] Frontend URL copied (e.g., `https://your-app.vercel.app`)

## Post-Deployment

- [ ] Backend `FRONTEND_URL` updated with Vercel URL
- [ ] Backend `CLIENT_URL` updated with Vercel URL
- [ ] Backend redeployed after URL update
- [ ] Frontend tested:
  - [ ] Homepage loads
  - [ ] Articles display
  - [ ] Images load
  - [ ] Registration works
  - [ ] Login works
  - [ ] Navigation works
- [ ] No console errors in browser
- [ ] No CORS errors

## Testing Checklist

- [ ] Visit frontend URL - homepage loads
- [ ] Click on article - article page loads
- [ ] Try registration - account created
- [ ] Try login - login successful
- [ ] Check images - real images display (not placeholders)
- [ ] Test calendar - calendar page loads
- [ ] Test categories - category pages load
- [ ] Test search - search works (if implemented)

## Troubleshooting

If something doesn't work:

1. **Check Render logs**: Dashboard → Your service → Logs
2. **Check Vercel logs**: Dashboard → Your project → Deployments → View logs
3. **Check browser console**: F12 → Console tab
4. **Check network tab**: F12 → Network tab → Look for failed requests
5. **Verify environment variables**: Make sure all are set correctly
6. **Check MongoDB connection**: Verify connection string is correct
7. **Check CORS**: Ensure `FRONTEND_URL` in backend matches Vercel URL exactly

## Quick Commands

### Generate JWT Secrets:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Test Backend Health:
```bash
curl https://your-backend-url.onrender.com/api/health
```

Should return: `{"status":"ok"}`

### Test Frontend API:
Open browser console on your frontend URL and check for API errors.

---

**Once all items are checked, your app is live! 🎉**

