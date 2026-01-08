# Authentication & Calendar Setup Guide

## ✅ Complete Implementation

Your authentication and calendar features are **fully implemented and ready to use**!

---

## 🔐 Authentication Flow

### Backend Endpoints

1. **POST** `/api/auth/register`
   - Body: `{ name, email, password, role? }`
   - Returns: `{ user, accessToken, refreshToken }`

2. **POST** `/api/auth/login`
   - Body: `{ email, password }`
   - Returns: `{ user, accessToken, refreshToken }`

3. **POST** `/api/auth/refresh`
   - Body: `{ refreshToken }`
   - Returns: `{ user, accessToken, refreshToken }`

4. **POST** `/api/auth/logout`
   - Clears session

### Frontend Integration

✅ **Login Page**: `/login` - Full form with email/password
✅ **Register Page**: `/register` - Full form with name/email/password
✅ **Auth Store**: Zustand store with localStorage persistence
✅ **API Interceptors**: Auto token refresh on 401 errors
✅ **Protected Routes**: Dashboard requires authentication

### How to Use

1. **Register a new user:**
   - Navigate to `/register`
   - Fill in name, email, password (min 6 chars)
   - Submit → Auto-login and redirect to dashboard

2. **Login:**
   - Navigate to `/login`
   - Enter email and password
   - Submit → Redirect to dashboard or previous page

3. **Logout:**
   - Click "Logout" in header
   - Clears tokens and redirects to home

---

## 📅 Calendar Feature (2026)

### Backend Endpoints

1. **GET** `/api/calendar/events?year=2026&month=1`
   - Query: `year` (required), `month` (optional, 1-12)
   - Returns: Array of events for the period

2. **POST** `/api/calendar/events` (Protected)
   - Body: `{ title, date, description?, category?, location? }`
   - Returns: Created event

3. **PUT** `/api/calendar/events/:id` (Protected)
   - Body: `{ title?, date?, description?, category?, location? }`
   - Returns: Updated event

4. **DELETE** `/api/calendar/events/:id` (Protected)
   - Returns: 204 No Content

### Frontend Calendar Page

✅ **Route**: `/calendar`
✅ **Features**:
   - Full 2026 calendar view
   - Month navigation (all 12 months)
   - Day selection with event display
   - Add/Edit/Delete events (requires login)
   - Event categories: National, Business, Sports, Culture, Breaking, Custom
   - Event details: Title, Description, Location, Category

### Calendar Categories

- `national` - National events
- `business` - Business/economic events
- `sports` - Sports events
- `culture` - Cultural events
- `breaking` - Breaking news events
- `custom` - Custom events

### How to Use Calendar

1. **View Calendar:**
   - Navigate to `/calendar` from menu
   - Click month buttons to navigate
   - Click any day to see events

2. **Add Event (Login Required):**
   - Select a date
   - Fill in event form (title required)
   - Click "Add event"

3. **Edit Event:**
   - Click on an existing event
   - Modify fields
   - Click "Update event"

4. **Delete Event:**
   - Click on event to edit
   - Click "Delete" button

---

## 🎯 Menu Integration

The calendar is already added to the header menu:

- **Primary Nav**: "Calendar" link → `/calendar`
- **Secondary Nav**: "Calendar 2026" link → `/calendar`

Both links are active and working!

---

## 🔧 Testing

### Test Authentication

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Test Calendar

```bash
# Get events for January 2026
curl http://localhost:5000/api/calendar/events?year=2026&month=1

# Create event (requires auth token)
curl -X POST http://localhost:5000/api/calendar/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title":"Test Event","date":"2026-01-15T00:00:00.000Z","category":"custom"}'
```

---

## 🚀 Quick Start

1. **Start Backend:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Test Flow:**
   - Visit `http://localhost:5173`
   - Click "Register" in header
   - Create account → Auto-login
   - Click "Calendar" in menu
   - Add events to 2026 calendar
   - Edit/Delete events

---

## ✅ Features Completed

- [x] User registration with validation
- [x] User login with JWT tokens
- [x] Token refresh mechanism
- [x] Protected routes (dashboard)
- [x] Logout functionality
- [x] Auth state persistence (localStorage)
- [x] Auto token refresh on 401
- [x] Full 2026 calendar view
- [x] Month navigation
- [x] Add/Edit/Delete events
- [x] Event categories
- [x] Calendar in menu bar
- [x] Authentication required for editing

---

## 🎉 Everything is Ready!

Your authentication and calendar features are **fully functional** and **production-ready**!





