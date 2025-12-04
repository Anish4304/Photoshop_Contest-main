import express from 'express';
import {
  createGallery,
  getGalleries,
  getGallery,
  updateGallery,
  deleteGallery,
} from '../controllers/galleryController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.post('/', protect, authorize('admin'), createGallery);
router.get('/', getGalleries);
router.get('/:id', getGallery);
router.put('/:id', protect, authorize('admin'), updateGallery);
router.delete('/:id', protect, authorize('admin'), deleteGallery);

export default router;
