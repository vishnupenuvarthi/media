# 📰 Bharat Bulletin - News Application

A modern, full-stack news application built with React, Node.js, and MongoDB.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB Atlas account (free tier available)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd media
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   cp env.example .env
   # Edit .env with your MongoDB connection string
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Visit** `http://localhost:5174`

## 📦 Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed free deployment instructions using Render and Vercel.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, TailwindCSS, React Query
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Authentication**: JWT, Passport.js
- **Deployment**: Render (Backend), Vercel (Frontend)

## 📝 Features

- 📰 News aggregation from RSS feeds
- 🔐 User authentication and authorization
- 📅 Calendar events management
- 🎥 YouTube integration
- 🌐 Multi-language support (English/Telugu)
- 📱 Responsive design
- 🖼️ Real news images (no placeholders)

## 📚 Documentation

- [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [Backend API Documentation](./backend/API_DOCUMENTATION.md)
- [Authentication Setup](./AUTH_AND_CALENDAR_SETUP.md)

## 📄 License

MIT

