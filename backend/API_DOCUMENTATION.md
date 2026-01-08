# Backend API Documentation

## Base URL
- Development: `http://localhost:5000/api`
- Production: `https://your-domain.com/api`

## Authentication
All endpoints use JWT tokens. Include in headers:
```
Authorization: Bearer <access_token>
```

---

## Public Endpoints

### 1. Home Feed
**GET** `/home`

Returns complete homepage data including hero stories, sections, latest, trending, videos, and photos.

**Response:**
```json
{
  "hero": [
    {
      "id": "string",
      "title": "string",
      "slug": "string",
      "category": "string",
      "summary": "string",
      "heroImage": "string",
      "author": {
        "name": "string"
      },
      "publishedAt": "ISO date string"
    }
  ],
  "sections": [
    {
      "category": {
        "id": "string",
        "title": "string",
        "slug": "string",
        "description": "string"
      },
      "stories": [
        {
          "id": "string",
          "title": "string",
          "slug": "string",
          "category": "string",
          "publishedAt": "ISO date string"
        }
      ]
    }
  ],
  "latest": [...],
  "trending": [...],
  "videos": [...],
  "photos": [...]
}
```

---

### 2. Breaking News
**GET** `/articles?flag=breaking`

Returns list of breaking news headlines.

**Query Parameters:**
- `flag` (required): `breaking`

**Response:**
```json
[
  {
    "id": "string",
    "title": "string",
    "slug": "string",
    "category": "string",
    "publishedAt": "ISO date string"
  }
]
```

---

### 3. Get Article by Slug
**GET** `/articles/:slug`

Returns full article details including related stories.

**URL Parameters:**
- `slug` (required): Article slug

**Response:**
```json
{
  "id": "string",
  "title": "string",
  "subtitle": "string",
  "slug": "string",
  "summary": "string",
  "body": "string (HTML)",
  "heroImage": "string",
  "category": "string",
  "tags": ["string"],
  "author": {
    "name": "string",
    "bio": "string"
  },
  "stats": {
    "views": 0,
    "readTime": 5
  },
  "publishedAt": "ISO date string",
  "updatedAt": "ISO date string",
  "related": [
    {
      "id": "string",
      "title": "string",
      "slug": "string",
      "category": "string",
      "publishedAt": "ISO date string"
    }
  ]
}
```

---

### 4. Get Category by Slug
**GET** `/categories/:slug`

Returns category page with featured story, latest stories, and related tags.

**URL Parameters:**
- `slug` (required): Category slug

**Response:**
```json
{
  "category": {
    "id": "string",
    "title": "string",
    "slug": "string",
    "description": "string",
    "heroImage": "string"
  },
  "featured": {
    "id": "string",
    "title": "string",
    "slug": "string",
    "category": "string",
    "subtitle": "string",
    "heroImage": "string"
  },
  "latest": [
    {
      "id": "string",
      "title": "string",
      "slug": "string",
      "category": "string",
      "subtitle": "string",
      "heroImage": "string"
    }
  ],
  "relatedTags": ["string"]
}
```

---

### 5. Get Live Blog
**GET** `/live/:slug`

Returns live blog with all entries. Auto-refreshes every 15 seconds on frontend.

**URL Parameters:**
- `slug` (required): Live blog slug

**Response:**
```json
{
  "id": "string",
  "slug": "string",
  "title": "string",
  "summary": "string",
  "status": "live" | "archived",
  "entries": [
    {
      "id": "string",
      "timestamp": "ISO date string",
      "content": "string (HTML)",
      "mediaUrl": "string (optional)"
    }
  ]
}
```

---

## Protected Endpoints (Newsroom)

### 6. Newsroom Dashboard
**GET** `/newsroom/dashboard`

Returns editorial dashboard stats and review queue.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "stats": {
    "drafts": 0,
    "inReview": 0,
    "scheduled": 0,
    "publishedToday": 0
  },
  "queue": [
    {
      "id": "string",
      "title": "string",
      "author": "string",
      "status": "review" | "scheduled",
      "updatedAt": "ISO date string"
    }
  ]
}
```

---

## Authentication Endpoints

### Register
**POST** `/auth/register`

**Body:**
```json
{
  "name": "Anita Rao",
  "email": "anita@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": "userId",
    "name": "Anita Rao",
    "email": "anita@example.com",
    "role": "reader"
  },
  "accessToken": "jwt",
  "refreshToken": "jwt"
}
```

### Login
**POST** `/auth/login`

Body identical to register (without name).

### Refresh Token
**POST** `/auth/refresh`

**Body:**
```json
{ "refreshToken": "jwt" }
```

Returns same structure as login.

### Logout
**POST** `/auth/logout`

Returns `204 No Content`.

---

## Calendar Endpoints

### List Events
**GET** `/calendar/events?year=2026&month=5`

- `year` (required)
- `month` (optional, 1-12). Without month returns entire year.

**Response:**
```json
[
  {
    "id": "eventId",
    "title": "Union Budget 2026",
    "description": "Coverage plan",
    "date": "2026-02-28T05:30:00.000Z",
    "category": "business",
    "location": "Parliament",
    "tags": ["budget"]
  }
]
```

### Create Event
**POST** `/calendar/events`

Headers: `Authorization: Bearer <token>`

**Body:**
```json
{
  "title": "Republic Day Parade",
  "description": "Photo team at Rajpath",
  "date": "2026-01-26T06:00:00.000Z",
  "category": "national",
  "location": "New Delhi",
  "tags": ["holiday"]
}
```

**Response:** Created event object.

### Update Event
**PUT** `/calendar/events/:id`

Same body as create (all fields optional).

### Delete Event
**DELETE** `/calendar/events/:id`

Returns `204 No Content`.

---

## Error Responses

All errors follow this format:

```json
{
  "message": "Error description",
  "details": {} // optional
}
```

**Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

---

## Frontend Integration Examples

### Using Axios (Already Configured)

```javascript
// Home feed
const { data } = await api.get('/home');

// Breaking news
const { data } = await api.get('/articles?flag=breaking');

// Single article
const { data } = await api.get(`/articles/${slug}`);

// Category page
const { data } = await api.get(`/categories/${slug}`);

// Live blog
const { data } = await api.get(`/live/${slug}`);

// Dashboard (protected)
const { data } = await api.get('/newsroom/dashboard');
```

---

## Environment Variables

Required in `.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/newsroom
JWT_SECRET=your-secret-key-here
JWT_REFRESH_SECRET=your-refresh-secret-here
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

---

## Database Models

### Article
- `title` (String, required)
- `subTitle` (String)
- `slug` (String, required, unique)
- `category` (ObjectId, ref: Category)
- `tags` (Array of Strings)
- `summary` (String)
- `heroImage` (String)
- `body` (String, required)
- `status` (Enum: draft, review, scheduled, published)
- `author` (ObjectId, ref: User)
- `editor` (ObjectId, ref: User)
- `stats.views` (Number, default: 0)
- `stats.readTime` (Number, default: 5)
- `flags.isBreaking` (Boolean, default: false)
- `flags.isTopHeadline` (Boolean, default: false)
- `publishedAt` (Date)
- `scheduledAt` (Date)
- `createdAt` (Date, auto)
- `updatedAt` (Date, auto)

### Category
- `title` (String, required)
- `slug` (String, required, unique)
- `description` (String)
- `heroImage` (String)
- `createdAt` (Date, auto)
- `updatedAt` (Date, auto)

### LiveBlog
- `slug` (String, required, unique)
- `title` (String, required)
- `summary` (String, required)
- `status` (Enum: live, archived, default: live)
- `entries` (Array of LiveEntry)
  - `timestamp` (Date, default: now)
  - `content` (String, required)
  - `mediaUrl` (String)
  - `author` (ObjectId, ref: User)
- `createdAt` (Date, auto)
- `updatedAt` (Date, auto)

### User
- `email` (String, required, unique)
- `passwordHash` (String, required)
- `role` (Enum: reader, reporter, editor, admin, default: reader)
- `profile.name` (String, required)
- `profile.bio` (String)
- `profile.avatar` (String)
- `status` (Enum: active, suspended, default: active)
- `createdAt` (Date, auto)
- `updatedAt` (Date, auto)

