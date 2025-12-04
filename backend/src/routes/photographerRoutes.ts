import express from 'express';
import {
  getPhotographers,
  getPhotographer,
  updatePhotographer,
  deletePhotographer,
} from '../controllers/photographerController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.get('/', getPhotographers);
router.get('/:id', getPhotographer);
router.put('/:id', protect, authorize('photographer', 'admin'), updatePhotographer);
router.delete('/:id', protect, authorize('admin'), deletePhotographer);

export default router;
