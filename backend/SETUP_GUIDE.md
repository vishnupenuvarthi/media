# Backend Setup & Integration Guide

## Prerequisites

- Node.js 18+ installed
- MongoDB running locally or MongoDB Atlas account
- Git (optional)

---

## Step 1: Install Dependencies

```bash
cd backend
npm install
```

---

## Step 2: Configure Environment

1. Copy the example env file:
```bash
cp env.example .env
```

2. Edit `.env` with your values:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/newsroom
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/newsroom

JWT_SECRET=generate-a-random-secret-key-here-min-32-chars
JWT_REFRESH_SECRET=generate-another-random-secret-key-here-min-32-chars
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

**Generate secure secrets:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Step 3: Seed Database (Optional)

Populate with sample data:

```bash
npm run seed
```

This creates:
- 4 categories (Politics, Business, Sports, Technology)
- 2 newsroom users (reporter/editor) with password **newsroom@123**
- 10 sample articles
- 1 live blog
- 3 calendar events for 2026

---

## Step 4: Start Backend Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm run build
npm start
```

Server will start on `http://localhost:5000`

---

## Step 5: Verify Backend is Running

Test the health endpoint:

```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{"status":"ok"}
```

---

## Frontend Integration

Your frontend is already configured to connect to this backend:

1. **API Base URL**: `/api` (proxied through Vite to `http://localhost:5000/api`)

2. **Frontend API Client**: Already set up in `frontend/src/lib/api.js`

3. **All endpoints match**: The backend routes exactly match what your frontend expects:
   - ✅ `GET /api/home` → Home feed
   - ✅ `GET /api/articles?flag=breaking` → Breaking news
   - ✅ `GET /api/articles/:slug` → Single article
   - ✅ `GET /api/categories/:slug` → Category page
   - ✅ `GET /api/live/:slug` → Live blog
   - ✅ `GET /api/newsroom/dashboard` → Dashboard
   - ✅ `POST /api/auth/*` → Register, login, refresh, logout
   - ✅ `GET/POST/PUT/DELETE /api/calendar/events` → Calendar 2026 planner

---

## Testing API Endpoints

### Using curl:

```bash
# Home feed
curl http://localhost:5000/api/home

# Breaking news
curl http://localhost:5000/api/articles?flag=breaking

# Single article (replace with actual slug)
curl http://localhost:5000/api/articles/major-development-1

# Category
curl http://localhost:5000/api/categories/politics

# Live blog
curl http://localhost:5000/api/live/election-results-live

# Auth (editor sample credentials)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"editor@bharatbulletin.com","password":"newsroom@123"}'

# Calendar events (January 2026)
curl "http://localhost:5000/api/calendar/events?year=2026&month=1"
```

### Using Postman/Insomnia:

1. Import the collection (create manually):
   - Base URL: `http://localhost:5000/api`
   - All GET endpoints listed above

---

## Production Deployment

### 1. Environment Variables

Set these in your hosting platform (Heroku, Render, Railway, etc.):

- `PORT` (auto-set by platform usually)
- `MONGO_URI` (MongoDB Atlas connection string)
- `JWT_SECRET` (generate secure random string)
- `JWT_REFRESH_SECRET` (generate secure random string)
- `FRONTEND_URL` (your frontend domain)
- `NODE_ENV=production`

### 2. Build & Deploy

```bash
npm run build
npm start
```

### 3. CORS Configuration

The backend already has CORS configured for your frontend URL. Update `FRONTEND_URL` in production.

---

## Troubleshooting

### MongoDB Connection Error

**Error:** `MongoServerError: connect ECONNREFUSED`

**Solution:**
- Ensure MongoDB is running: `mongod` or `brew services start mongodb-community`
- Check `MONGO_URI` in `.env` is correct
- For Atlas: Check IP whitelist and credentials

### Port Already in Use

**Error:** `EADDRINUSE: address already in use :::5000`

**Solution:**
```bash
# Find and kill process
lsof -ti:5000 | xargs kill -9

# Or change PORT in .env
```

### Missing Environment Variables

**Error:** `Missing environment variable: MONGO_URI`

**Solution:**
- Ensure `.env` file exists in `backend/` folder
- Check all required variables are set
- Restart the server after changing `.env`

---

## API Response Format

All successful responses return JSON:

```json
{
  "data": "..."
}
```

All errors return:

```json
{
  "message": "Error description"
}
```

---

## Security Features

✅ **Helmet** - Security headers
✅ **CORS** - Configured for frontend origin
✅ **Rate Limiting** - (Add if needed)
✅ **JWT Authentication** - For protected routes
✅ **Password Hashing** - bcryptjs
✅ **Input Validation** - express-validator
✅ **Error Handling** - Centralized error handler

---

## Next Steps

1. ✅ Backend is ready
2. ✅ Frontend is configured
3. Start both servers:
   ```bash
   # Terminal 1 - Backend
   cd backend && npm run dev
   
   # Terminal 2 - Frontend
   cd frontend && npm run dev
   ```
4. Visit `http://localhost:5173`

---

## Support

If you encounter issues:
1. Check server logs in terminal
2. Verify MongoDB connection
3. Check `.env` configuration
4. Ensure both frontend and backend are running

