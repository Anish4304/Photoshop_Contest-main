# 📷 Photography Contest Management System - Complete Guide

## 🎯 What Has Been Built

A **complete, production-ready backend system** for managing photography contests with:
- ✅ 56 REST API endpoints
- ✅ 9 MongoDB models
- ✅ JWT authentication
- ✅ Photo upload system
- ✅ 12 analytics aggregation queries
- ✅ Sample data seeding
- ✅ Comprehensive documentation

## 📁 Project Structure

```
Photoshop_Contest/
├── backend/               # ✅ COMPLETE BACKEND SYSTEM
│   ├── src/              # TypeScript source code
│   ├── dist/             # Compiled JavaScript
│   ├── uploads/          # Photo storage
│   ├── .env              # Environment config (ready to use)
│   ├── package.json      # Dependencies (installed)
│   ├── README.md         # Full API documentation
│   ├── SETUP.md          # Quick start guide
│   ├── API_TESTING.md    # Testing guide
│   ├── PROJECT_SUMMARY.md # What was built
│   └── FRONTEND_INTEGRATION.md # How to connect frontend
│
└── src/                   # Frontend (existing React app)
    ├── components/
    ├── pages/
    ├── context/
    └── ...
```

## 🚀 Quick Start (5 Minutes)

### 1. Prerequisites
```bash
# Check Node.js
node --version  # Should be v16+

# Check MongoDB
Get-Service MongoDB  # Should be "Running"
```

### 2. Start Backend
```bash
cd backend

# Install dependencies (if not already installed)
npm install

# Seed database with sample data
npm run seed

# Start server
npm run dev
```

Server will run at: **http://localhost:5000**

### 3. Test Backend
Open browser: http://localhost:5000/api/health

Or use PowerShell:
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/categories"
```

### 4. Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@contest.com | admin123 |
| Photographer | john@photographer.com | password123 |
| Judge | emily@judge.com | password123 |

## 📡 API Endpoints Overview

Base URL: `http://localhost:5000/api`

### Main Resources
- `/auth/*` - Authentication (register, login)
- `/photographers/*` - Photographer management
- `/categories/*` - Category CRUD
- `/photos/*` - Photo submissions & management
- `/galleries/*` - Gallery management
- `/judges/*` - Judge management
- `/scores/*` - Judge scoring
- `/votes/*` - Visitor voting
- `/winners/*` - Winner declaration
- `/analytics/*` - 12 analytics queries

**Total: 56 endpoints**

## 🎓 Documentation Quick Links

All documentation is in the `backend/` directory:

1. **[README.md](backend/README.md)** - Complete API documentation
   - All endpoints with examples
   - Database schemas
   - Installation guide
   - Security features

2. **[SETUP.md](backend/SETUP.md)** - Quick start guide
   - Step-by-step installation
   - Troubleshooting
   - Test credentials

3. **[API_TESTING.md](backend/API_TESTING.md)** - Testing guide
   - cURL examples
   - Postman collection
   - Testing workflow

4. **[PROJECT_SUMMARY.md](backend/PROJECT_SUMMARY.md)** - What was built
   - Complete feature list
   - File structure
   - Technical stack

5. **[FRONTEND_INTEGRATION.md](backend/FRONTEND_INTEGRATION.md)** - Connect frontend
   - API integration examples
   - React hooks
   - TypeScript types
   - Authentication setup

## 🔗 Connecting Frontend to Backend

### Update Frontend API Configuration

1. **Create API config file:**
```typescript
// src/config/api.ts
export const API_BASE_URL = 'http://localhost:5000/api';
export const IMAGE_BASE_URL = 'http://localhost:5000';
```

2. **Update your existing components to use the backend:**

```typescript
// Example: Login
const login = async (email: string, password: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  localStorage.setItem('token', data.data.token);
  return data;
};

// Example: Get Photos
const getPhotos = async () => {
  const response = await fetch(`${API_BASE_URL}/photos`);
  const data = await response.json();
  return data.data;
};

// Example: Upload Photo
const uploadPhoto = async (formData: FormData) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/photos`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData,
  });
  return response.json();
};
```

See **[FRONTEND_INTEGRATION.md](backend/FRONTEND_INTEGRATION.md)** for complete examples.

## 📊 Backend Features

### ✅ Authentication System
- JWT token-based authentication
- Password hashing with bcrypt
- Role-based authorization (photographer, judge, admin)
- Protected routes

### ✅ Photo Management
- Upload photos with Multer
- File validation (jpg, jpeg, png, gif, webp)
- 5MB file size limit
- CRUD operations
- Gallery linking (many-to-many)

### ✅ Scoring & Voting
- Judges score photos (0-10 scale)
- Visitors vote for photos
- 1 vote per visitor per photo
- Combined score calculation

### ✅ Analytics (12 Endpoints)
1. Photographers in multiple categories
2. Highest scored photo
3. Categories with high submissions
4. Judges with high activity
5. Average votes per category
6. Photos in multiple galleries
7. Photographers with multiple wins
8. Categories without winners
9. Visitors with high engagement
10. Category with most submissions
11. Top winners by category
12. High scores but no awards

### ✅ Database Models (9)
- Photographer
- Judge
- Category
- Photo
- Gallery
- JudgeScore
- Visitor
- VisitorVote
- Winner

## 🧪 Testing the API

### Using PowerShell
```powershell
# Get all categories
Invoke-RestMethod -Uri "http://localhost:5000/api/categories"

# Get all photos
Invoke-RestMethod -Uri "http://localhost:5000/api/photos"

# Get highest scored photo
Invoke-RestMethod -Uri "http://localhost:5000/api/analytics/highest-scored-photo"
```

### Using cURL
```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@photographer.com","password":"password123"}'

# Get categories
curl http://localhost:5000/api/categories
```

### Using Browser
- Categories: http://localhost:5000/api/categories
- Photos: http://localhost:5000/api/photos
- Winners: http://localhost:5000/api/winners
- Analytics: http://localhost:5000/api/analytics/highest-scored-photo

## 🛠️ Technology Stack

| Component | Technology |
|-----------|-----------|
| Backend | Node.js + Express.js |
| Language | TypeScript |
| Database | MongoDB + Mongoose |
| Authentication | JWT |
| File Upload | Multer |
| Frontend | React + TypeScript |
| Styling | Tailwind CSS |

## 📋 Sample Data (After Seeding)

The `npm run seed` command creates:
- ✅ 4 categories (Nature, Portrait, Wildlife, Street)
- ✅ 5 photographers
- ✅ 3 judges
- ✅ 11 photos
- ✅ 3 galleries
- ✅ 33 judge scores (3 judges × 11 photos)
- ✅ 8 visitors
- ✅ 60+ visitor votes
- ✅ 12 winners (3 per category)

## 🚦 Common Tasks

### Starting the Backend
```bash
cd backend
npm run dev
```

### Reseeding the Database
```bash
cd backend
npm run seed
```

### Building for Production
```bash
cd backend
npm run build
npm start
```

### Checking MongoDB Status
```powershell
Get-Service MongoDB
```

### Starting MongoDB
```powershell
net start MongoDB
```

## 🔧 Troubleshooting

### MongoDB Not Running
```powershell
net start MongoDB
```

### Port 5000 Already in Use
Change PORT in `backend/.env`:
```
PORT=3000
```

### Cannot Upload Photos
Ensure `backend/uploads/` directory exists:
```powershell
cd backend
New-Item -ItemType Directory -Path uploads -Force
```

### TypeScript Errors
```bash
cd backend
npm run build
```

## 📚 Next Steps

### For Backend Development
1. ✅ Backend is complete and ready
2. ✅ All endpoints are working
3. ✅ Sample data is available
4. 📖 Read [README.md](backend/README.md) for API details

### For Frontend Integration
1. 📖 Read [FRONTEND_INTEGRATION.md](backend/FRONTEND_INTEGRATION.md)
2. Update API base URL in frontend
3. Implement authentication context
4. Connect existing pages to backend
5. Test all features

### For Testing
1. 📖 Read [API_TESTING.md](backend/API_TESTING.md)
2. Test with Postman/cURL
3. Verify all endpoints work
4. Test photo uploads

## ✅ What's Ready

- [x] Complete backend API (56 endpoints)
- [x] Database models (9 schemas)
- [x] Authentication system
- [x] Photo upload system
- [x] Analytics queries (12)
- [x] Sample data seeding
- [x] Full documentation
- [x] TypeScript compiled
- [x] Dependencies installed
- [x] Environment configured
- [x] Ready to run

## 🎉 Success!

Your Photography Contest Management System backend is **100% complete and ready to use!**

### Quick Commands
```bash
# Start backend
cd backend && npm run dev

# Reseed database
cd backend && npm run seed

# Test API
curl http://localhost:5000/api/health
```

### Server Info
- **URL:** http://localhost:5000
- **Health Check:** http://localhost:5000/api/health
- **API Base:** http://localhost:5000/api

### Login
- **Admin:** admin@contest.com / admin123
- **Photographer:** john@photographer.com / password123
- **Judge:** emily@judge.com / password123

---

**Happy Coding! 📷✨**

For detailed documentation, see the `backend/` directory files.
