import express from 'express';
import {
  submitPhoto,
  getPhotos,
  getPhoto,
  updatePhoto,
  deletePhoto,
  addPhotoToGallery,
} from '../controllers/photoController';
import { protect, authorize } from '../middleware/auth';
import { upload } from '../config/multer';

const router = express.Router();

// GET routes must come before POST/PUT/DELETE with :id parameter
router.get('/', getPhotos);
router.post('/', protect, authorize('photographer'), upload.single('image'), submitPhoto);
router.get('/:id', getPhoto);
router.put('/:id', protect, authorize('photographer', 'admin'), updatePhoto);
router.delete('/:id', protect, authorize('photographer', 'admin'), deletePhoto);
router.post('/:id/galleries/:galleryId', protect, authorize('admin'), addPhotoToGallery);

export default router;
