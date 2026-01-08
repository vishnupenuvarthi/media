# 🚀 Backend Server - Start Guide

## ✅ Backend is Now Running!

The backend server has been started and is now running on **port 5001**.

---

## 🔍 Verification

### Check Backend Status:
```bash
curl http://localhost:5001/api/health
```

Expected response: `{"status":"ok"}`

### Check if Backend is Running:
```bash
lsof -ti:5001
```

Should return a process ID if running.

---

## 🎯 How to Start Backend Manually

If you need to start the backend yourself:

### Step 1: Navigate to Backend Directory
```bash
cd backend
```

### Step 2: Start the Server
```bash
npm run dev
```

### Step 3: Verify It's Running
You should see:
```
✅ MongoDB connected successfully
Database: your_database_name
Server running on port 5001
```

---

## 🐛 Common Issues

### Issue 1: Port Already in Use
**Error:** `EADDRINUSE: address already in use :::5001`

**Solution:**
```bash
# Find and kill the process
lsof -ti:5001 | xargs kill -9

# Then restart
npm run dev
```

### Issue 2: MongoDB Connection Failed
**Error:** `Failed to connect to MongoDB`

**Solution:**
1. Check your `.env` file has correct `MONGO_URI`
2. Verify MongoDB Atlas connection string is correct
3. Check internet connection
4. Verify MongoDB Atlas IP whitelist includes your IP

### Issue 3: Missing Environment Variables
**Error:** `Missing environment variable: MONGO_URI`

**Solution:**
1. Create `.env` file in `backend/` directory
2. Add all required variables:
   ```env
   PORT=5001
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_REFRESH_SECRET=your_refresh_secret
   CLIENT_URL=http://localhost:5173
   NODE_ENV=development
   ```

---

## 📊 Backend Endpoints

Once running, these endpoints are available:

- `GET /api/health` - Health check
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh token
- `GET /api/home` - Homepage data
- `GET /api/articles` - List articles
- `GET /api/categories/:slug` - Category data
- `GET /api/calendar/events` - Calendar events
- `GET /api/newsroom/dashboard` - Dashboard data

---

## 🔄 Auto-Start on System Boot (Optional)

If you want the backend to start automatically, you can use:

### PM2 (Recommended)
```bash
npm install -g pm2
pm2 start npm --name "newsroom-backend" -- run dev
pm2 save
pm2 startup
```

### Or use a process manager like `forever` or `nodemon` (already included)

---

## ✅ Current Status

- ✅ Backend running on port 5001
- ✅ MongoDB connected
- ✅ API endpoints responding
- ✅ Frontend proxy configured correctly

**The proxy errors should now be resolved!** 🎉

---

## 🧪 Test Registration

Now that the backend is running, try registering:

1. Go to `http://localhost:5173/register`
2. Fill in the form
3. Click "Create Account"
4. ✅ Should work now!

---

## 📝 Notes

- Backend must be running for the frontend to work
- If you close the terminal, the backend will stop
- Use `npm run dev` to start it again
- Check backend console for any errors

**Everything should work now!** 🚀





