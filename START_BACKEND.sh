#!/bin/bash

# Backend Startup Script
# This script starts the backend server and keeps it running

cd "$(dirname "$0")/backend"

echo "🚀 Starting backend server..."
echo "📁 Directory: $(pwd)"
echo ""

# Check if backend is already running
if lsof -ti:5001 > /dev/null 2>&1; then
    echo "⚠️  Backend is already running on port 5001"
    echo "   To stop it, run: pkill -f 'nodemon.*server.js'"
    exit 1
fi

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "   Please create .env file with required variables"
    exit 1
fi

# Start backend
echo "✅ Starting backend server..."
npm run dev





