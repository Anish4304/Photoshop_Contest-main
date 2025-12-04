import express from 'express';
import {
  addVisitor,
  submitVote,
  getVotes,
  getPhotoVoteCount,
  getVisitorActivity,
} from '../controllers/voteController';

const router = express.Router();

// Specific routes MUST come before generic ones
router.get('/photo/:photoId/count', getPhotoVoteCount);
router.get('/visitor/:id/activity', getVisitorActivity);

router.post('/visitors', addVisitor);
router.post('/', submitVote);
router.get('/', getVotes);

export default router;
