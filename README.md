# Photography Contest Management System

A complete, responsive frontend UI for managing photography contests built with React, TypeScript, and Tailwind CSS.

## Features

### User Roles
- **Photographers**: Submit photos, view their submissions, track scores and votes
- **Judges**: Review and score photos on a 0-100 scale
- **Visitors**: Browse gallery and vote for favorite photos
- **Admin**: Manage photos, users, and view detailed statistics

### Pages & Components

1. **Home Page**
   - Hero section with stunning photography background
   - Category highlights (Nature, Portrait, Wildlife, Street)
   - Call-to-action buttons
   - How it works section

2. **Authentication**
   - Login page with role-based redirects
   - Registration page for new photographers

3. **Photographer Dashboard**
   - Photo submission form with title, description, category
   - List of uploaded photos with scores and votes
   - Delete functionality

4. **Gallery Page**
   - Masonry-style grid layout
   - Filter by category
   - Click photos to view in modal with full details

5. **Judges Panel**
   - Review all submitted photos
   - Add/edit scores (0-100 scale)
   - Filter by category

6. **Visitor Voting Page**
   - Browse all photos
   - Vote for favorites (one vote per photo)
   - Real-time vote counter

7. **Winners Page**
   - Top 3 overall winners with medals
   - Category winners display
   - Score and vote statistics

8. **Admin Dashboard**
   - Statistics overview (total photos, users, votes, avg score)
   - Category distribution charts
   - Top performers list
   - Manage photos (delete capability)
   - User management table

## Tech Stack

- **React 18** - Frontend framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Lucide React** - Icons
- **Vite** - Build tool

## Project Structure

```
src/
├── components/        # Reusable components
│   ├── Navbar.tsx
│   └── PhotoModal.tsx
├── pages/            # Page components
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── PhotographerDashboard.tsx
│   ├── Gallery.tsx
│   ├── JudgesPanel.tsx
│   ├── Voting.tsx
│   ├── Winners.tsx
│   └── AdminDashboard.tsx
├── context/          # State management
│   └── AppContext.tsx
├── types/            # TypeScript types
│   └── index.ts
├── data/             # Sample data
│   └── sampleData.ts
├── App.tsx           # Main app with routing
└── main.tsx          # Entry point
```

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Demo Accounts

Use these credentials to test different user roles:

- **Photographer**: `sarah@example.com`
- **Judge**: `judge@example.com`
- **Admin**: `admin@example.com`

(Password can be anything for demo purposes)

## Features Implemented

- ✅ Responsive design for all screen sizes
- ✅ Modern UI with animations and hover effects
- ✅ Category-based filtering
- ✅ Role-based access control
- ✅ Photo modal with detailed information
- ✅ Voting system with vote tracking
- ✅ Judge scoring system
- ✅ Admin dashboard with statistics
- ✅ Sample data with 12 photos across 4 categories
- ✅ Clean folder structure and code organization

## UI Highlights

- **Color Scheme**: Dark theme with slate grays and amber accents
- **Animations**: Smooth transitions, hover effects, scale transforms
- **Typography**: Clean hierarchy with bold headings
- **Cards**: Elevated cards with hover states
- **Buttons**: Multiple styles (primary, secondary, danger)
- **Forms**: Well-designed inputs with focus states
- **Modals**: Full-screen photo details modal
- **Grid Layouts**: Masonry and standard grids

## Future Enhancements

- Backend integration with Supabase
- Real file upload functionality
- Email notifications
- Social sharing
- Advanced filtering and sorting
- User profiles with avatars
- Comments and feedback system
- Export winners to PDF

## License

MIT
