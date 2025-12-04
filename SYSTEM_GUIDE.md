# Photography Contest System - Quick Start Guide

## 🚀 System Status: READY

Both frontend and backend are running and connected to MongoDB Atlas.

## 📍 Access URLs

- **Frontend**: http://localhost:5173/
- **Backend API**: http://localhost:5000/api

## 🔑 Login Credentials

### Photographers (Can Register & Login)
- **John Doe**: john@photographer.com / password123
- **Jane Smith**: jane@photographer.com / password123
- **Mike Johnson**: mike@photographer.com / password123
- **Sarah Williams**: sarah@photographer.com / password123
- **David Brown**: david@photographer.com / password123

### Judges (Login Only - Cannot Register)
- **Emily Davis**: emily@judge.com / password123
- **Robert Wilson**: robert@judge.com / password123
- **Lisa Anderson**: lisa@judge.com / password123

### Admin
- **Admin**: admin@contest.com / password123

## 🎯 Features

### For Photographers
1. **Register**: Create new account (only photographers can register)
2. **Login**: Access your dashboard with role selector
3. **Upload Photos**: Drag-and-drop or click to upload (5MB max)
4. **View Gallery**: Browse all submitted photos
5. **Check Winners**: See contest winners

### For Judges
1. **Login**: Access judging panel (cannot register - accounts are pre-created)
2. **Score Photos**: Rate photos on creativity, technical quality, composition, impact
3. **Announce Winners**: Declare winners for each category
4. **View Statistics**: See scoring data and submissions

### For Visitors
1. **Browse Gallery**: View all photos without login
2. **Vote**: Cast votes for favorite photos
3. **View Winners**: See announced winners

## 📁 Database Content

### Categories (4)
- Wildlife
- Landscape
- Portrait
- Abstract

### Sample Photos (11)
- Distributed across all categories
- Pre-scored by judges
- Has visitor votes

### Test Data
- 5 Photographers registered
- 3 Judges active
- 33 Judge Scores
- 53 Visitor Votes
- 11 Winners declared

## 🔧 Technical Setup

### Backend Stack
- Node.js + Express.js + TypeScript
- MongoDB Atlas (Cloud Database)
- JWT Authentication
- Multer File Upload
- Bcrypt Password Hashing

### Frontend Stack
- React + TypeScript
- Vite Build Tool
- Tailwind CSS
- Axios HTTP Client
- React Router v6

### API Endpoints (56 Total)
- `/api/auth/*` - Authentication
- `/api/photographers/*` - Photographer management
- `/api/judges/*` - Judge management
- `/api/photos/*` - Photo CRUD
- `/api/categories/*` - Categories
- `/api/scores/*` - Judge scoring
- `/api/votes/*` - Visitor voting
- `/api/winners/*` - Winner management
- `/api/statistics/*` - Analytics
- `/api/announcements/*` - System announcements

## 🎨 User Flow Examples

### Photographer Journey
1. Visit http://localhost:5173/
2. Click "Register" (top right)
3. Fill in registration form
4. Login with credentials
5. Select "Photographer" role
6. Access dashboard
7. Drag-and-drop photo upload
8. Add title, description, select category
9. Submit photo
10. View in gallery

### Judge Journey
1. Visit http://localhost:5173/
2. Click "Login" (top right)
3. Use judge credentials (e.g., emily@judge.com)
4. Select "Judge" role
5. Access judging panel
6. View photos in grid/single mode
7. Score photos (1-10) on 4 criteria
8. Submit scores
9. Announce winners (if authorized)

### Visitor Journey
1. Visit http://localhost:5173/
2. Browse gallery (no login needed)
3. View photo details
4. Cast votes for favorites
5. Check winners page

## 🛡️ Security Features

- JWT token authentication
- Password hashing with bcrypt
- Role-based access control
- Protected routes
- File upload validation (type, size)
- MongoDB injection prevention
- CORS enabled

## 🔄 Running the System

### Start Backend
```powershell
cd backend
npm install
npm run dev
```

### Start Frontend
```powershell
cd [project-root]
npm install
npm run dev
```

### Seed Database (if needed)
```powershell
cd backend
npm run seed
```

## 📊 MongoDB Atlas Connection
- Cluster: cluster0.3nayjji.mongodb.net
- Database: photography_contest
- Status: ✅ Connected
- IP Whitelisted: 152.57.57.167

## 🐛 Troubleshooting

### "Route not found" Error
✅ **FIXED**: Frontend now correctly calls `/api/auth/login` endpoint

### Login Not Working
- Check if backend is running (port 5000)
- Verify MongoDB connection
- Use correct credentials from list above
- Check browser console for errors

### Photo Upload Failing
- File must be image (jpg, jpeg, png, gif, webp)
- Max size: 5MB
- Must be logged in as photographer

### Database Empty
- Run seed script: `cd backend && npm run seed`
- Check MongoDB Atlas connection

## 📝 Notes

- Backend automatically determines user role (photographer/judge) based on email
- Judges cannot register - accounts are created by admin
- Photos are stored in `backend/uploads` directory
- JWT tokens expire in 7 days
- All API responses follow: `{ success: boolean, data/message: any }`

## 🎉 System is READY TO USE!

Open http://localhost:5173/ and start exploring!
