# MongoDB Atlas Setup Guide

## Quick Setup (5 minutes)

### 1. Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Sign up for free account
3. Create new cluster (select FREE tier)
4. Wait for cluster to be created (2-3 minutes)

### 2. Configure Database Access
1. Go to **Database Access** in left sidebar
2. Click **Add New Database User**
3. Choose **Password** authentication
4. Username: `contest_user`
5. Password: `contest123` (or generate secure password)
6. Database User Privileges: **Read and write to any database**
7. Click **Add User**

### 3. Configure Network Access
1. Go to **Network Access** in left sidebar
2. Click **Add IP Address**
3. Click **Allow Access from Anywhere** (adds 0.0.0.0/0)
4. Click **Confirm**

### 4. Get Connection String
1. Go to **Clusters** in left sidebar
2. Click **Connect** on your cluster
3. Choose **Connect your application**
4. Copy the connection string (looks like):
   ```
   mongodb+srv://contest_user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### 5. Update Project Configuration
1. Open `backend/.env` file
2. Replace the MONGODB_URI line with your connection string:
   ```
   MONGODB_URI=mongodb+srv://contest_user:contest123@cluster0.xxxxx.mongodb.net/photography_contest?retryWrites=true&w=majority
   ```
   **Important**: Replace `<password>` with your actual password and add `/photography_contest` before the `?`

### 6. Run Setup Script
```bash
node setup-atlas.js
```

This will:
- Install all dependencies
- Build the backend
- Seed the database with sample data
- Create start scripts

### 7. Start the Application
```bash
# Option 1: Use the generated batch file
start-atlas.bat

# Option 2: Manual start
# Terminal 1:
cd backend
npm run dev

# Terminal 2:
npm run dev
```

## What Gets Created in Atlas

### Collections:
- **categories** (4 items): Nature, Portrait, Wildlife, Street
- **photographers** (4 users): Sarah Chen, Marcus Johnson, Emma Rodriguez, Alex Kim
- **judges** (3 users): Judge Anderson, Emily Davis, Robert Wilson
- **photos** (12 items): 3 photos per category with high-quality Pexels images
- **galleries** (4 collections): Curated photo collections
- **judgescores** (36 scores): Each judge scores each photo
- **visitors** (10 users): Sample visitors for voting
- **visitorvotes** (2000+ votes): Realistic voting data
- **winners** (12 winners): Top 3 in each category

### Sample Data Features:
- ✅ Realistic photographer profiles
- ✅ High-quality sample images from Pexels
- ✅ Authentic judge scores (70-100 range)
- ✅ Realistic visitor vote counts (150-400 per photo)
- ✅ Calculated winners based on combined scores
- ✅ Admin user for management

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@example.com | password123 |
| Photographer | sarah@example.com | password123 |
| Judge | judge@example.com | password123 |

## URLs
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## Troubleshooting

### Connection Issues
- Verify your IP is whitelisted (use 0.0.0.0/0 for all IPs)
- Check username/password in connection string
- Ensure database name is included: `/photography_contest`

### Seed Script Fails
- Check MongoDB Atlas connection string format
- Verify database user has read/write permissions
- Check network connectivity

### Frontend Not Loading Data
- Ensure backend is running on port 5000
- Check browser console for API errors
- Verify CORS settings in backend

## Atlas Dashboard
Monitor your database at: https://cloud.mongodb.com/
- View collections and documents
- Monitor performance
- Check connection logs
- Manage users and access

## Next Steps
1. Customize the sample data
2. Add your own photos
3. Modify categories
4. Invite real users
5. Deploy to production

Your Photography Contest is now running on MongoDB Atlas! 🎉