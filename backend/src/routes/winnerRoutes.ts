import express from 'express';
import {
  declareWinner,
  getWinners,
  getWinner,
  updateWinner,
  deleteWinner,
  getTopPhotosByCategory,
} from '../controllers/winnerController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.post('/', protect, authorize('admin'), declareWinner);
router.get('/', getWinners);
router.get('/:id', getWinner);
router.get('/category/:categoryId/top', getTopPhotosByCategory);
router.put('/:id', protect, authorize('admin'), updateWinner);
router.delete('/:id', protect, authorize('admin'), deleteWinner);

export default router;
