import express from 'express';
import {
  photographersMultipleCategories,
  highestScoredPhoto,
  categoriesWithHighSubmissions,
  judgesHighActivity,
  averageVotesPerCategory,
  photosInMultipleGalleries,
  photographersMultipleWins,
  categoriesWithNoWinners,
  visitorsHighEngagement,
  categoryMostSubmissions,
  topWinnersByCategory,
  photographersHighScoresNoAwards,
} from '../controllers/analyticsController';

const router = express.Router();

// 1. List photographers who submitted entries in multiple categories
router.get('/photographers-multiple-categories', photographersMultipleCategories);

// 2. Find the photo with the highest combined judge + visitor score
router.get('/highest-scored-photo', highestScoredPhoto);

// 3. Show categories with more than 50 submissions (threshold adjustable)
router.get('/categories-high-submissions', categoriesWithHighSubmissions);

// 4. Retrieve judges who scored more than 20 entries (threshold adjustable)
router.get('/judges-high-activity', judgesHighActivity);

// 5. Calculate average visitor votes per category
router.get('/average-votes-per-category', averageVotesPerCategory);

// 6. Identify photos displayed in multiple galleries
router.get('/photos-multiple-galleries', photosInMultipleGalleries);

// 7. Find photographers who won in more than one category
router.get('/photographers-multiple-wins', photographersMultipleWins);

// 8. Show categories where no winner was announced
router.get('/categories-no-winners', categoriesWithNoWinners);

// 9. Retrieve visitors who voted for more than 10 photos (threshold adjustable)
router.get('/visitors-high-engagement', visitorsHighEngagement);

// 10. Find the category with the most submissions overall
router.get('/category-most-submissions', categoryMostSubmissions);

// 11. Show top 3 winning photos in specific category
router.get('/top-winners/:categoryName', topWinnersByCategory);

// 12. Identify photographers who received high judge scores but no awards
router.get('/photographers-high-scores-no-awards', photographersHighScoresNoAwards);

export default router;
