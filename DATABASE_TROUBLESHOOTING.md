# MongoDB Atlas Connection Troubleshooting Guide

## 🔴 Common Connection Issues & Solutions

### Issue 1: "ENOTFOUND" or "ETIMEDOUT" Error
**Symptom:** Cannot reach MongoDB server, connection times out

**Solutions:**
1. **Check Internet Connection**
   - Ensure stable internet connection
   - Try opening https://cloud.mongodb.com in browser

2. **Whitelist IP Address in MongoDB Atlas**
   - Go to https://cloud.mongodb.com
   - Login to your account
   - Select your cluster (Cluster0)
   - Click "Network Access" in left sidebar
   - Click "Add IP Address"
   - Choose one:
     - **Recommended for testing:** Add `0.0.0.0/0` (allows all IPs)
     - **For specific IP:** Add your friend's current IP address
   - Click "Confirm"
   - Wait 2-3 minutes for changes to propagate

3. **Check Firewall/Antivirus**
   - Windows Firewall might be blocking MongoDB port (27017)
   - Temporarily disable antivirus/firewall to test
   - Add Node.js to firewall exceptions

4. **Corporate Network/VPN**
   - Some networks block MongoDB Atlas connections
   - Try using mobile hotspot
   - Use a VPN service
   - Contact network administrator

### Issue 2: "Authentication Failed" Error
**Symptom:** Wrong username or password

**Solutions:**
1. **Verify .env File**
   - Check `backend/.env` file exists
   - Verify `MONGODB_URI` has correct credentials
   - Current URI: `mongodb+srv://anishapoojari432004_db_user:me5gkaY0xSNbUf0g@cluster0.3nayjji.mongodb.net/photography_contest`

2. **Reset Database Password**
   - Login to MongoDB Atlas
   - Go to "Database Access"
   - Click "Edit" on user `anishapoojari432004_db_user`
   - Click "Edit Password"
   - Generate new password or set custom password
   - Update `MONGODB_URI` in `.env` file with new password

### Issue 3: "MongoServerError" 
**Symptom:** MongoDB server issues

**Solutions:**
1. Check MongoDB Atlas cluster status
2. Verify cluster isn't paused (free tier auto-pauses after inactivity)
3. Restart cluster from MongoDB Atlas dashboard

### Issue 4: Missing .env File
**Symptom:** "MONGODB_URI is not defined" error

**Solutions:**
1. **Copy .env File:**
   ```powershell
   # On friend's laptop, create backend/.env file with this content:
   ```

2. **Create New .env File:**
   - Navigate to `backend/` folder
   - Create file named `.env` (no extension)
   - Copy content from below

## 📋 .env File Template

Create `backend/.env` file with this content:

```env
PORT=5000
MONGODB_URI=mongodb+srv://anishapoojari432004_db_user:me5gkaY0xSNbUf0g@cluster0.3nayjji.mongodb.net/photography_contest?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=ykvjfhiadfushgncuifdnhcggfduigvhngfuijkghnvguifdvnhguiofjnhvd
JWT_EXPIRE=7d
NODE_ENV=development

# Upload Configuration
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
```

## 🧪 Test MongoDB Connection

### Method 1: Using PowerShell
```powershell
# Navigate to backend folder
cd backend

# Test with Node.js script
node -e "const mongoose = require('mongoose'); mongoose.connect('mongodb+srv://anishapoojari432004_db_user:me5gkaY0xSNbUf0g@cluster0.3nayjji.mongodb.net/photography_contest').then(() => console.log('✅ Connected!')).catch(err => console.error('❌ Error:', err.message));"
```

### Method 2: Create Test Script
Create `backend/test-connection.js`:

```javascript
require('dotenv').config();
const mongoose = require('mongoose');

console.log('Testing MongoDB connection...');
console.log('URI:', process.env.MONGODB_URI ? 'Found' : 'Missing');

mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 10000,
})
.then(() => {
  console.log('✅ MongoDB Connected Successfully!');
  console.log('Host:', mongoose.connection.host);
  console.log('Database:', mongoose.connection.name);
  process.exit(0);
})
.catch((err) => {
  console.error('❌ Connection Failed:', err.message);
  process.exit(1);
});
```

Run test:
```powershell
cd backend
node test-connection.js
```

## 🌐 MongoDB Atlas Setup Checklist

### For Your Friend's Laptop:
- [ ] Install Node.js (v18 or higher)
- [ ] Install Git
- [ ] Clone repository
- [ ] Run `npm install` in root folder
- [ ] Run `npm install` in backend folder
- [ ] Create `backend/.env` file (copy from above)
- [ ] Whitelist IP address in MongoDB Atlas
- [ ] Test connection using test script
- [ ] Start backend: `cd backend && npm run dev`

### MongoDB Atlas Configuration:
- [ ] Cluster is running (not paused)
- [ ] Network Access: IP `0.0.0.0/0` whitelisted OR friend's specific IP added
- [ ] Database Access: User `anishapoojari432004_db_user` exists with correct password
- [ ] Database: `photography_contest` exists
- [ ] Collections populated with data (run seed script if empty)

## 🔧 Alternative: Use Local MongoDB (If Atlas Doesn't Work)

### Install MongoDB Community Server:
1. Download from https://www.mongodb.com/try/download/community
2. Install with default settings
3. Start MongoDB service
4. Update `backend/.env`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/photography_contest
   ```

### Seed Local Database:
```powershell
cd backend
npm run seed
```

## 📞 Common Error Messages & Quick Fixes

| Error Message | Quick Fix |
|---------------|-----------|
| "ENOTFOUND cluster0.3nayjji.mongodb.net" | Whitelist IP in MongoDB Atlas Network Access |
| "Authentication failed" | Check username/password in MONGODB_URI |
| "MONGODB_URI is not defined" | Create/verify backend/.env file |
| "Server selection timed out" | Check internet connection, try VPN |
| "connect ETIMEDOUT" | Firewall blocking port 27017, whitelist Node.js |
| "MongooseServerSelectionError" | Cluster might be paused, check Atlas dashboard |

## 🎯 Step-by-Step Setup for Friend

### On Friend's Laptop:

1. **Install Prerequisites:**
   ```powershell
   # Check Node.js version (should be 18+)
   node --version
   
   # If not installed, download from: https://nodejs.org
   ```

2. **Clone & Install:**
   ```powershell
   # Navigate to desired folder
   cd Downloads
   
   # If you're sharing via USB/Google Drive, just extract the folder
   # Then navigate into it:
   cd Photoshop_Contest
   
   # Install dependencies
   npm install
   cd backend
   npm install
   ```

3. **Create .env File:**
   ```powershell
   # In backend folder, create .env file
   # Use notepad or any text editor:
   notepad .env
   
   # Paste the .env content from above template
   # Save and close
   ```

4. **Whitelist IP in MongoDB Atlas:**
   - You (project owner) need to do this step
   - Login to https://cloud.mongodb.com
   - Network Access → Add IP Address → 0.0.0.0/0
   - Or get friend's IP: https://whatismyipaddress.com

5. **Test Connection:**
   ```powershell
   # Still in backend folder
   node test-connection.js
   ```

6. **Start Application:**
   ```powershell
   # Terminal 1: Backend
   cd backend
   npm run dev
   
   # Terminal 2: Frontend (new terminal)
   cd Photoshop_Contest
   npm run dev
   ```

7. **Access Application:**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000/api/health

## ✅ Verification Steps

After setup, verify:

1. **Backend Running:**
   ```powershell
   curl http://localhost:5000/api/health
   ```
   Should return: `{"success":true,"message":"Photography Contest API is running"}`

2. **Database Connected:**
   Backend terminal should show:
   ```
   ✅ MongoDB Connected: ac-arnsedd-shard-00-XX.3nayjji.mongodb.net
   📦 Database: photography_contest
   ```

3. **Frontend Accessible:**
   Open browser: http://localhost:5173
   Should show Photography Contest landing page

4. **Login Working:**
   - Login with: john@photographer.com / password123
   - Should redirect to dashboard without errors

## 🆘 Still Not Working?

If connection still fails after trying all solutions:

1. **Share Error Screenshot:**
   - Take screenshot of backend terminal showing error
   - Share the exact error message

2. **Check MongoDB Atlas Status:**
   - Visit: https://status.mongodb.com
   - Verify no service disruptions

3. **Try Different Network:**
   - Use mobile hotspot instead of WiFi
   - Try from different location

4. **Contact Support:**
   - MongoDB Atlas: https://www.mongodb.com/contact
   - Create support ticket with connection error details

## 📝 Notes

- MongoDB Atlas free tier (M0) has connection limits
- Multiple simultaneous connections might cause issues
- Ensure only one backend server is running at a time
- Clear browser cache if frontend shows old data
- Restart backend after any .env file changes
