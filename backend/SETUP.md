# 🚀 QUICK START GUIDE - Photography Contest Backend

## ✅ Prerequisites Checklist
- [ ] Node.js v16+ installed
- [ ] MongoDB installed and running
- [ ] Git (optional)

## 📦 Installation Steps (5 minutes)

### Step 1: Install MongoDB (if not installed)

**Windows:**
1. Download from: https://www.mongodb.com/try/download/community
2. Run installer (use default settings)
3. MongoDB will run as a Windows Service

**Verify MongoDB is running:**
```powershell
Get-Service MongoDB
```

If not running, start it:
```powershell
net start MongoDB
```

### Step 2: Navigate to Backend Directory
```bash
cd backend
```

### Step 3: Dependencies Already Installed ✅
Dependencies are already installed. If you need to reinstall:
```bash
npm install
```

### Step 4: Environment Configuration ✅
The `.env` file is already created. You can edit it if needed:
```bash
notepad .env
```

Default configuration (works out of the box):
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/photography_contest
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

### Step 5: Build the Project ✅
Already built! If you make changes, rebuild with:
```bash
npm run build
```

### Step 6: Seed Database with Sample Data
```bash
npm run seed
```

This creates:
- 4 categories
- 5 photographers
- 3 judges
- 11 photos
- 3 galleries
- Judge scores
- 8 visitors with votes
- Winners for each category

### Step 7: Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start at: **http://localhost:5000**

## 🎯 Quick Test

Open your browser or use curl:

```bash
curl http://localhost:5000/api/health
```

You should see:
```json
{
  "success": true,
  "message": "Photography Contest API is running"
}
```

## 🔐 Test Login Credentials

After running `npm run seed`:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@contest.com | admin123 |
| Photographer | john@photographer.com | password123 |
| Judge | emily@judge.com | password123 |

## 📡 API Endpoints

Base URL: `http://localhost:5000`

### Authentication
- `POST /api/auth/register/photographer` - Register photographer
- `POST /api/auth/register/judge` - Register judge
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Main Resources
- `/api/photographers` - Photographer management
- `/api/categories` - Category management
- `/api/photos` - Photo submissions
- `/api/galleries` - Gallery management
- `/api/judges` - Judge management
- `/api/scores` - Judge scoring
- `/api/votes` - Visitor voting
- `/api/winners` - Winner declaration

### Analytics (12 endpoints)
- `/api/analytics/*` - All analytics queries

## 🧪 Testing the API

### Method 1: Browser
Visit: http://localhost:5000/api/categories

### Method 2: PowerShell
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/categories"
```

### Method 3: cURL
```bash
curl http://localhost:5000/api/categories
```

### Method 4: Postman
1. Import the API endpoints
2. Set base URL to `http://localhost:5000`
3. Test endpoints

## 📂 Project Structure

```
backend/
├── src/                    # Source code
│   ├── controllers/       # Business logic (11 files)
│   ├── models/           # MongoDB schemas (9 models)
│   ├── routes/           # API routes (10 files)
│   ├── middleware/       # Auth middleware
│   ├── config/           # Database & Multer config
│   ├── utils/            # JWT utilities
│   ├── scripts/          # Seed script
│   └── server.ts         # Main entry point
├── dist/                  # Compiled JavaScript
├── uploads/              # Uploaded photos
├── .env                  # Environment variables
├── package.json          # Dependencies
└── tsconfig.json         # TypeScript config
```

## 🔧 Troubleshooting

### Issue: MongoDB Connection Error
**Solution:**
```powershell
# Check if MongoDB is running
Get-Service MongoDB

# Start MongoDB
net start MongoDB
```

### Issue: Port 5000 already in use
**Solution:**
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F
```

Or change PORT in `.env`:
```
PORT=3000
```

### Issue: Cannot upload photos
**Solution:**
Ensure `uploads/` directory exists:
```powershell
New-Item -ItemType Directory -Path uploads -Force
```

### Issue: TypeScript errors
**Solution:**
```bash
npm run build
```

## 🎓 Next Steps

1. **Test All Endpoints**
   - See `API_TESTING.md` for detailed examples

2. **Customize Categories**
   - Edit seed script or use admin endpoints

3. **Configure for Production**
   - Update JWT_SECRET in `.env`
   - Use MongoDB Atlas for cloud database
   - Set NODE_ENV=production

4. **Connect Frontend**
   - Update frontend API base URL to `http://localhost:5000`

## 📚 Documentation

- **Full API Documentation:** See `README.md`
- **API Testing Guide:** See `API_TESTING.md`
- **MongoDB Schemas:** Check `src/models/` directory

## 💡 Useful Commands

```bash
# Development
npm run dev              # Start with auto-reload

# Production
npm run build           # Compile TypeScript
npm start              # Run compiled code

# Database
npm run seed           # Seed with sample data

# Maintenance
npm install            # Install dependencies
```

## 🌟 Features Implemented

✅ JWT Authentication
✅ Role-based Authorization (photographer, judge, admin)
✅ Photo Upload with Multer
✅ CRUD for all resources
✅ MongoDB Aggregation Pipelines
✅ 12 Analytics Endpoints
✅ Judge Scoring System
✅ Visitor Voting System
✅ Winner Declaration
✅ Gallery Management
✅ Many-to-Many Photo-Gallery Relationships
✅ Sample Data Seeding

## 🆘 Need Help?

1. Check the console output for errors
2. Verify MongoDB is running
3. Check `.env` configuration
4. Review `README.md` for detailed docs
5. Test with `curl http://localhost:5000/api/health`

## 🎉 You're Ready!

Your Photography Contest Management System backend is now running!

**Server:** http://localhost:5000
**Health Check:** http://localhost:5000/api/health
**Categories:** http://localhost:5000/api/categories

Happy Coding! 📷✨
