import express from 'express';
import {
  submitScore,
  getScores,
  updateScore,
  deleteScore,
  getPhotoTotalScore,
} from '../controllers/scoreController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.post('/', protect, authorize('judge'), submitScore);
router.get('/', getScores);
router.get('/photo/:photoId/total', getPhotoTotalScore);
router.put('/:id', protect, authorize('judge', 'admin'), updateScore);
router.delete('/:id', protect, authorize('judge', 'admin'), deleteScore);

export default router;
