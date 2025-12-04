# Quick Start Guide

## Installation & Running

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Navigation Guide

### Routes
- `/` - Home page
- `/login` - Login page
- `/register` - Register page
- `/dashboard` - Photographer dashboard (requires login)
- `/gallery` - Public gallery
- `/voting` - Visitor voting page
- `/judges-panel` - Judges panel (requires judge role)
- `/winners` - Winners page
- `/admin` - Admin dashboard (requires admin role)

### Demo Login Credentials

**Photographer Account:**
- Email: `sarah@example.com`
- Role: Photographer
- Access: Dashboard, submit photos

**Judge Account:**
- Email: `judge@example.com`
- Role: Judge
- Access: Judges panel, scoring

**Admin Account:**
- Email: `admin@example.com`
- Role: Admin
- Access: Full admin dashboard

## Key Features by Role

### Photographer
1. Submit new photos with title, description, category
2. View all your submissions
3. Track judge scores and visitor votes
4. Delete your photos

### Judge
1. Review all submitted photos
2. Add/update scores (0-100 scale)
3. Filter by category
4. View current scores and vote counts

### Visitor
1. Browse photo gallery
2. Vote for favorite photos
3. Filter by category
4. View photo details in modal

### Admin
1. View statistics dashboard
2. Manage all photos (delete capability)
3. View user list with roles
4. See category distribution
5. View top performers

## Sample Data

The app comes with:
- **12 sample photos** across 4 categories
- **6 demo users** (photographers, judge, admin)
- Pre-populated scores and votes
- High-quality Pexels stock photos

## UI Features

- **Responsive Design**: Works on mobile, tablet, and desktop
- **Dark Theme**: Modern slate and amber color scheme
- **Animations**: Smooth transitions and hover effects
- **Modals**: Click any photo to view details
- **Filters**: Category-based filtering on multiple pages
- **Real-time Updates**: State updates instantly across components

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Navbar.tsx       # Navigation bar
│   └── PhotoModal.tsx   # Photo detail modal
├── pages/               # Page components
│   ├── Home.tsx         # Landing page
│   ├── Login.tsx        # Login form
│   ├── Register.tsx     # Registration form
│   ├── PhotographerDashboard.tsx  # Photo submission
│   ├── Gallery.tsx      # Photo gallery
│   ├── JudgesPanel.tsx  # Scoring interface
│   ├── Voting.tsx       # Voting interface
│   ├── Winners.tsx      # Winners display
│   └── AdminDashboard.tsx  # Admin controls
├── context/
│   └── AppContext.tsx   # Global state management
├── data/
│   └── sampleData.ts    # Sample photos and users
├── types/
│   └── index.ts         # TypeScript interfaces
├── App.tsx              # Main app with routing
└── main.tsx             # Entry point
```

## Tech Stack

- React 18 + TypeScript
- React Router v6
- Tailwind CSS
- Lucide React (icons)
- Vite (build tool)

## Tips

1. **Testing Photographer Flow**: Login as sarah@example.com → Submit a photo → View in gallery
2. **Testing Judge Flow**: Login as judge@example.com → Score photos → Check updated scores
3. **Testing Voting**: Go to /voting → Vote for photos → See vote count increase
4. **Testing Admin**: Login as admin@example.com → View stats → Manage photos/users

## Common Tasks

### Adding a New Photo
1. Login as photographer
2. Click "Submit New Photo"
3. Fill form (title, description, category, optional image URL)
4. Click "Submit Photo"
5. View in "Your Submissions" section

### Scoring as Judge
1. Login as judge
2. Navigate to Judges Panel
3. Find photo to score
4. Enter score (0-100)
5. Click "Save"

### Voting as Visitor
1. Navigate to /voting (no login required)
2. Browse photos
3. Click "Vote" button on favorites
4. Button changes to "Voted" after voting

### Viewing Winners
1. Navigate to /winners
2. See Top 3 overall winners
3. View category winners below

## Customization

Want to customize? Edit these files:

- **Colors**: `tailwind.config.js` (or directly in component classNames)
- **Sample Data**: `src/data/sampleData.ts`
- **Routes**: `src/App.tsx`
- **Categories**: `src/data/sampleData.ts` (categories array)
