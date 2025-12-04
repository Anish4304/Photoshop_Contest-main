import express from 'express';
import {
  getJudges,
  getJudge,
  updateJudge,
  deleteJudge,
} from '../controllers/judgeController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.get('/', getJudges);
router.get('/:id', getJudge);
router.put('/:id', protect, authorize('admin'), updateJudge);
router.delete('/:id', protect, authorize('admin'), deleteJudge);

export default router;
