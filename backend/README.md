# Photography Contest Management System - Backend API

A complete Node.js + Express.js + MongoDB backend system for managing photography contests with JWT authentication, photo uploads, judge scoring, visitor voting, and comprehensive analytics.

## 🚀 Features

### Core Modules
- **Authentication System** - JWT-based authentication for photographers, judges, and admin
- **Photographer Management** - Registration, profiles, and photo submissions
- **Category Management** - CRUD operations for contest categories
- **Photo Submission** - Upload photos with Multer, manage submissions
- **Gallery System** - Create galleries with many-to-many photo relationships
- **Judge Scoring** - Judges can score photos (1-10 scale)
- **Visitor Voting** - Public voting system (1 vote per visitor per photo)
- **Winner Declaration** - Automated winner calculation based on combined scores
- **Analytics Dashboard** - 12 powerful aggregation queries for insights

### 12 Analytics Endpoints
1. List photographers who submitted entries in multiple categories
2. Find the photo with the highest combined judge + visitor score
3. Show categories with more than 50 submissions
4. Retrieve judges who scored more than 20 entries
5. Calculate average visitor votes per category
6. Identify photos displayed in multiple galleries
7. Find photographers who won in more than one category
8. Show categories where no winner was announced
9. Retrieve visitors who voted for more than 10 photos
10. Find the category with the most submissions overall
11. Show top 3 winning photos in specific category
12. Identify photographers who received high judge scores but no awards

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn

## 🛠️ Installation

### 1. Navigate to backend directory
```bash
cd backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/photography_contest
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development

# Upload Configuration
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
```

### 4. Start MongoDB
Make sure MongoDB is running on your system:

**Windows:**
```bash
net start MongoDB
```

**macOS/Linux:**
```bash
sudo systemctl start mongod
```

Or use MongoDB Atlas cloud database by updating `MONGODB_URI` in `.env`

### 5. Seed the database (Optional but recommended)
```bash
npm run seed
```

This will create sample data including:
- 4 categories (Nature, Portrait, Wildlife, Street)
- 5 photographers
- 3 judges
- 11 photos
- 3 galleries
- Judge scores for all photos
- 8 visitors with votes
- Winners for each category

### 6. Start the development server
```bash
npm run dev
```

The API will be available at `http://localhost:5000`

### 7. For production build
```bash
npm run build
npm start
```

## 📡 API Endpoints

### Authentication (`/api/auth`)
```
POST   /api/auth/register/photographer  - Register as photographer
POST   /api/auth/register/judge         - Register as judge
POST   /api/auth/login                  - Login (photographer/judge/admin)
GET    /api/auth/me                     - Get current user (Protected)
```

### Photographers (`/api/photographers`)
```
GET    /api/photographers               - Get all photographers
GET    /api/photographers/:id           - Get photographer details with photos
PUT    /api/photographers/:id           - Update photographer (Protected)
DELETE /api/photographers/:id           - Delete photographer (Admin only)
```

### Categories (`/api/categories`)
```
POST   /api/categories                  - Create category (Admin only)
GET    /api/categories                  - Get all categories with submission counts
GET    /api/categories/:id              - Get category details with photos
PUT    /api/categories/:id              - Update category (Admin only)
DELETE /api/categories/:id              - Delete category (Admin only)
```

### Photos (`/api/photos`)
```
POST   /api/photos                      - Submit photo with file upload (Photographer only)
GET    /api/photos                      - Get all photos (filter by category/photographer)
GET    /api/photos/:id                  - Get photo details with scores and votes
PUT    /api/photos/:id                  - Update photo (Photographer/Admin)
DELETE /api/photos/:id                  - Delete photo (Photographer/Admin)
POST   /api/photos/:id/galleries/:galleryId - Add photo to gallery (Admin only)
```

### Galleries (`/api/galleries`)
```
POST   /api/galleries                   - Create gallery (Admin only)
GET    /api/galleries                   - Get all galleries with photos
GET    /api/galleries/:id               - Get gallery details
PUT    /api/galleries/:id               - Update gallery (Admin only)
DELETE /api/galleries/:id               - Delete gallery (Admin only)
```

### Judges (`/api/judges`)
```
GET    /api/judges                      - Get all judges
GET    /api/judges/:id                  - Get judge details with scores
PUT    /api/judges/:id                  - Update judge (Admin only)
DELETE /api/judges/:id                  - Delete judge (Admin only)
```

### Scores (`/api/scores`)
```
POST   /api/scores                      - Submit score (Judge only)
GET    /api/scores                      - Get all scores (filter by photo/judge)
GET    /api/scores/photo/:photoId/total - Get total score for photo
PUT    /api/scores/:id                  - Update score (Judge/Admin)
DELETE /api/scores/:id                  - Delete score (Judge/Admin)
```

### Votes (`/api/votes`)
```
POST   /api/votes/visitors              - Register visitor
POST   /api/votes                       - Submit vote
GET    /api/votes                       - Get all votes (filter by photo/visitor)
GET    /api/votes/photo/:photoId/count  - Get vote count for photo
GET    /api/votes/visitor/:id/activity  - Get visitor activity
```

### Winners (`/api/winners`)
```
POST   /api/winners                     - Declare winner (Admin only)
GET    /api/winners                     - Get all winners (filter by category)
GET    /api/winners/:id                 - Get winner details
GET    /api/winners/category/:categoryId/top - Get top 3 photos by category
PUT    /api/winners/:id                 - Update winner (Admin only)
DELETE /api/winners/:id                 - Delete winner (Admin only)
```

### Analytics (`/api/analytics`)
```
GET    /api/analytics/photographers-multiple-categories
GET    /api/analytics/highest-scored-photo
GET    /api/analytics/categories-high-submissions?threshold=50
GET    /api/analytics/judges-high-activity?threshold=20
GET    /api/analytics/average-votes-per-category
GET    /api/analytics/photos-multiple-galleries
GET    /api/analytics/photographers-multiple-wins
GET    /api/analytics/categories-no-winners
GET    /api/analytics/visitors-high-engagement?threshold=10
GET    /api/analytics/category-most-submissions
GET    /api/analytics/top-winners/:categoryName
GET    /api/analytics/photographers-high-scores-no-awards?minScore=30
```

## 🔐 Authentication

### Login Credentials (After seeding)

**Admin:**
- Email: `admin@contest.com`
- Password: `admin123`

**Photographer:**
- Email: `john@photographer.com`
- Password: `password123`

**Judge:**
- Email: `emily@judge.com`
- Password: `password123`

### Using Protected Routes

Include JWT token in the Authorization header:
```
Authorization: Bearer <your_token_here>
```

## 📸 Photo Upload

When submitting a photo, use `multipart/form-data`:

```javascript
const formData = new FormData();
formData.append('image', fileInput.files[0]);
formData.append('title', 'My Photo Title');
formData.append('description', 'Photo description');
formData.append('categoryId', 'category_id_here');

fetch('http://localhost:5000/api/photos', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token
  },
  body: formData
});
```

## 🗄️ Database Schema

### Models
- **Photographer** - name, email, password, phone, bio
- **Judge** - name, email, password, expertise
- **Category** - name (Nature/Portrait/Wildlife/Street), description
- **Photo** - title, description, imageUrl, photographerId, categoryId, galleries[]
- **Gallery** - name, description, photos[]
- **JudgeScore** - judgeId, photoId, score (0-10), comment
- **Visitor** - name, email
- **VisitorVote** - visitorId, photoId
- **Winner** - photoId, categoryId, position, totalScore, announcement

## 🧪 Testing API with Postman/cURL

### Example: Register a photographer
```bash
curl -X POST http://localhost:5000/api/auth/register/photographer \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Photographer",
    "email": "test@photo.com",
    "password": "password123",
    "phone": "+1234567890",
    "bio": "Test bio"
  }'
```

### Example: Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@photographer.com",
    "password": "password123"
  }'
```

### Example: Get Analytics
```bash
curl http://localhost:5000/api/analytics/photographers-multiple-categories
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts          # MongoDB connection
│   │   └── multer.ts            # File upload configuration
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── photographerController.ts
│   │   ├── categoryController.ts
│   │   ├── photoController.ts
│   │   ├── galleryController.ts
│   │   ├── judgeController.ts
│   │   ├── scoreController.ts
│   │   ├── voteController.ts
│   │   ├── winnerController.ts
│   │   └── analyticsController.ts    # 12 aggregation queries
│   ├── middleware/
│   │   └── auth.ts               # JWT authentication & authorization
│   ├── models/
│   │   ├── Photographer.ts
│   │   ├── Judge.ts
│   │   ├── Category.ts
│   │   ├── Photo.ts
│   │   ├── Gallery.ts
│   │   ├── JudgeScore.ts
│   │   ├── Visitor.ts
│   │   ├── VisitorVote.ts
│   │   └── Winner.ts
│   ├── routes/
│   │   ├── authRoutes.ts
│   │   ├── photographerRoutes.ts
│   │   ├── categoryRoutes.ts
│   │   ├── photoRoutes.ts
│   │   ├── galleryRoutes.ts
│   │   ├── judgeRoutes.ts
│   │   ├── scoreRoutes.ts
│   │   ├── voteRoutes.ts
│   │   ├── winnerRoutes.ts
│   │   └── analyticsRoutes.ts
│   ├── scripts/
│   │   └── seed.ts               # Database seeding script
│   ├── utils/
│   │   └── jwt.ts                # JWT token generation
│   └── server.ts                 # Express app entry point
├── uploads/                      # Uploaded images storage
├── .env.example                  # Environment variables template
├── .gitignore
├── package.json
└── tsconfig.json
```

## 🔧 Technology Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (jsonwebtoken)
- **File Upload:** Multer
- **Password Hashing:** bcryptjs
- **Language:** TypeScript
- **Dev Tools:** nodemon, ts-node

## 🚦 API Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "count": 10  // for list endpoints
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message here"
}
```

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based authorization (photographer, judge, admin)
- Protected routes with middleware
- File type validation for uploads
- File size limits

## 📊 MongoDB Aggregation Pipelines

The analytics controller uses complex MongoDB aggregation pipelines with:
- `$lookup` - Join collections
- `$group` - Group documents
- `$match` - Filter documents
- `$project` - Shape output
- `$sort` - Sort results
- `$addFields` - Add computed fields
- `$unwind` - Deconstruct arrays

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGODB_URI in .env
- Verify MongoDB port (default: 27017)

### Port Already in Use
- Change PORT in .env
- Or kill the process using port 5000

### File Upload Issues
- Ensure uploads directory exists
- Check file size limits (default 5MB)
- Verify file types (jpg, jpeg, png, gif, webp)

## 📝 License

MIT

## 👨‍💻 Author

Photoshop Contest Management System Backend

---

**Happy Coding! 📷✨**
