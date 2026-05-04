# Paragon FC - Full Stack Football Team Website

## Quick Start Guide

### 1. Install MongoDB
Download and install MongoDB from: https://www.mongodb.com/try/download/community

Or use Docker:
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 2. Install Backend Dependencies
```bash
cd backend
npm install
```

### 3. Start the Backend Server
```bash
cd backend
npm run dev
```

### 4. Create Admin User (First Time Only)
```bash
cd backend
node createAdmin.js
```
- Username: admin
- Password: admin123

### 5. Open the Website
- Open `frontend/index.html` in your browser
- Admin Dashboard: `frontend/admin.html`

## Project Structure
```
paragon-fc/
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── .env
│   └── createAdmin.js
├── frontend/
│   ├── index.html
│   └── admin.html
└── uploads/
```

## API Endpoints
- GET  /api/players     - Get all players
- POST /api/players     - Add new player (admin)
- GET  /api/standings   - Get league standings
- GET  /api/news        - Get news articles
- POST /api/register    - Submit player registration
- POST /api/auth/login  - Admin login

## Troubleshooting

**Port 5000 already in use:**
Edit `backend/.env` and change the PORT value

**MongoDB connection error:**
Make sure MongoDB is running: `mongod`

**CORS errors:**
Ensure backend is running on http://localhost:5000

## Features
- ✅ Complete backend API
- ✅ MongoDB database integration
- ✅ Admin authentication with JWT
- ✅ Player management
- ✅ Registration system
- ✅ League standings
- ✅ News management
- ✅ File upload support
