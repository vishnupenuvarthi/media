# 🚀 Quick Start Guide - Authentication & Calendar

## ✅ What's Been Completed

### 🔐 Authentication System
- ✅ User Registration (`/register`)
- ✅ User Login (`/login`)
- ✅ JWT Token Management (Access + Refresh)
- ✅ Auto Token Refresh on 401
- ✅ Protected Routes (Dashboard)
- ✅ Logout Functionality
- ✅ Auth State Persistence (localStorage)

### 📅 Calendar System (2026)
- ✅ Full 2026 Calendar View
- ✅ Month Navigation (All 12 months)
- ✅ Add/Edit/Delete Events
- ✅ Event Categories (National, Business, Sports, Culture, Breaking, Custom)
- ✅ Calendar in Menu Bar
- ✅ Authentication Required for Editing

---

## 🎯 How to Test

### 1. Start the Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend runs on: `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs on: `http://localhost:5173`

### 2. Test Registration

1. Open `http://localhost:5173`
2. Click **"Register"** in the header
3. Fill in:
   - Name: `Test User`
   - Email: `test@example.com`
   - Password: `password123` (min 6 chars)
4. Click **"Create account"**
5. ✅ Should auto-login and redirect to `/dashboard`

### 3. Test Login

1. Click **"Logout"** in header
2. Click **"Login"** in header
3. Enter:
   - Email: `test@example.com`
   - Password: `password123`
4. Click **"Sign in"**
5. ✅ Should redirect to `/dashboard`

### 4. Test Calendar

1. Click **"Calendar"** in the main menu (or "Calendar 2026" in secondary menu)
2. Navigate to any month (click month buttons)
3. Click on any day
4. ✅ Should see event form on the right
5. Fill in:
   - Title: `Test Event`
   - Description: `This is a test`
   - Category: `Custom`
   - Location: `Mumbai`
6. Click **"Add event"**
7. ✅ Event should appear on the calendar day
8. Click the event to edit/delete

### 5. Test Protected Routes

1. Click **"Logout"**
2. Try to visit `/dashboard` directly
3. ✅ Should redirect to `/login`
4. After login, should redirect back to `/dashboard`

---

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout

### Calendar
- `GET /api/calendar/events?year=2026&month=1` - List events
- `POST /api/calendar/events` - Create event (Auth required)
- `PUT /api/calendar/events/:id` - Update event (Auth required)
- `DELETE /api/calendar/events/:id` - Delete event (Auth required)

---

## 📝 Environment Variables

Make sure your `backend/.env` has:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
FRONTEND_URL=http://localhost:5173
PORT=5000
```

---

## 🎉 Everything Works!

Your authentication and calendar features are **fully functional** and ready to use!

**Menu Links:**
- Primary Nav: **"Calendar"** → `/calendar`
- Secondary Nav: **"Calendar 2026"** → `/calendar`
- Header: **"Login"** → `/login`
- Header: **"Register"** → `/register`

All features are integrated and working! 🚀





