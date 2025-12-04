# Photography Contest - MongoDB Atlas Edition

🎉 **Complete Photography Contest Management System with MongoDB Atlas Cloud Database**

## 🚀 Quick Start (5 minutes)

### 1. Setup MongoDB Atlas
```bash
# Follow the detailed guide
See ATLAS_SETUP.md for step-by-step instructions
```

### 2. Configure & Run
```bash
# Run the automated setup
node setup-atlas.js

# Start the application
start-atlas.bat
```

### 3. Access the Application
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000

## 🎯 What You Get

### ✅ Complete Sample Data
- **4 Categories**: Nature, Portrait, Wildlife, Street
- **4 Photographers**: Sarah Chen, Marcus Johnson, Emma Rodriguez, Alex Kim
- **12 High-Quality Photos**: 3 per category from Pexels
- **3 Professional Judges**: With realistic scoring
- **10 Visitors**: With authentic voting patterns
- **Winners**: Calculated for each category

### ✅ Full Feature Set
- 📸 **Photo Upload & Management**
- ⚖️ **Judge Scoring System** (0-100 scale)
- 🗳️ **Visitor Voting System**
- 🏆 **Automated Winner Calculation**
- 📊 **Admin Dashboard** with analytics
- 🔐 **Role-Based Authentication**
- 📱 **Responsive Design**

### ✅ Demo Accounts Ready
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@example.com | password123 |
| Photographer | sarah@example.com | password123 |
| Judge | judge@example.com | password123 |

## 📁 Project Structure
```
├── backend/                 # Node.js/Express API
│   ├── src/
│   │   ├── models/         # MongoDB schemas
│   │   ├── controllers/    # API controllers
│   │   ├── routes/         # API routes
│   │   └── scripts/
│   │       └── seed-atlas.ts  # Atlas data seeding
│   └── .env               # Atlas connection config
├── src/                   # React frontend
│   ├── pages/            # Application pages
│   ├── components/       # Reusable components
│   └── services/         # API services
└── setup-atlas.js        # Automated setup script
```

## 🛠️ Tech Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB Atlas (Cloud)
- **Authentication**: JWT
- **File Upload**: Multer
- **Images**: High-quality Pexels photos

## 🎨 UI Features
- **Dark Theme** with amber accents
- **Masonry Grid** for photo gallery
- **Modal Views** for photo details
- **Responsive Design** for all devices
- **Smooth Animations** and hover effects
- **Category Filtering** across all pages

## 📊 Sample Data Details

### Photos by Category
- **Nature**: Mountain Sunrise, Forest Mist, Ocean Waves
- **Portrait**: Urban Portrait, Golden Hour, Elder Portrait
- **Wildlife**: Eagle in Flight, Tiger Close-up, Hummingbird
- **Street**: Rainy Streets, Street Vendor, Downtown Night

### Realistic Scoring
- **Judge Scores**: 70-100 range with authentic variations
- **Visitor Votes**: 150-400 votes per photo
- **Winners**: Calculated using 70% judge + 30% visitor scores

## 🔧 Development Commands

```bash
# Backend
cd backend
npm run dev          # Start development server
npm run build        # Build for production
npm run seed:atlas   # Seed Atlas database

# Frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

## 🌐 Deployment Ready
- **Atlas Connection**: Production-ready cloud database
- **Environment Variables**: Properly configured
- **Build Scripts**: Optimized for deployment
- **CORS**: Configured for cross-origin requests

## 📈 Analytics Dashboard
The admin dashboard provides:
- Total photos, users, votes, average scores
- Category distribution charts
- Top performers list
- Photo management tools
- User management interface

## 🔒 Security Features
- **Password Hashing**: bcrypt with salt
- **JWT Authentication**: Secure token-based auth
- **Role-Based Access**: Admin, Judge, Photographer roles
- **Input Validation**: Express validator middleware
- **File Upload Security**: Multer with restrictions

## 🎯 Perfect For
- Photography competitions
- Art contests
- Portfolio showcases
- Community voting systems
- Educational projects
- Portfolio demonstrations

## 📞 Support
- Check `ATLAS_SETUP.md` for detailed setup instructions
- Review `DATABASE_TROUBLESHOOTING.md` for common issues
- All sample data matches the original frontend design

---

**Ready to run a professional photography contest with cloud database! 🏆📸**