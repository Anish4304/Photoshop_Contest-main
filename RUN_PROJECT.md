# 🚀 Run the Photography Contest Project

## Quick Start

### Step 1: Start MongoDB
```powershell
# Check if MongoDB is running
Get-Service MongoDB

# If not running, start it
net start MongoDB
```

### Step 2: Start Backend (Terminal 1)
```powershell
cd backend
npm run seed    # Seed database with sample data (first time only)
npm run dev     # Start backend server
```
Backend will run at: **http://localhost:5000**

### Step 3: Start Frontend (Terminal 2)
```powershell
# Open a new terminal in project root
npm run dev     # Start frontend
```
Frontend will run at: **http://localhost:5173**

## Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Photographer | john@photographer.com | password123 |
| Judge | emily@judge.com | password123 |

## Verify Backend is Running

Open browser: http://localhost:5000/api/categories

You should see JSON with 4 categories (Nature, Portrait, Wildlife, Street)

## Common Issues

### Port Already in Use
- Backend (5000): Change PORT in `backend/.env`
- Frontend (5173): Vite will auto-assign next available port

### MongoDB Not Running
```powershell
net start MongoDB
```

### Categories Not Showing
- Make sure backend is running first
- Check browser console for API errors
- Verify: http://localhost:5000/api/categories returns data

## Project URLs

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health
- **Categories**: http://localhost:5000/api/categories
- **Photos**: http://localhost:5000/api/photos
