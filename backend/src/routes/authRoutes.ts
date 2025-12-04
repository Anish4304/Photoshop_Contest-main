import express from 'express';
import {
  registerPhotographer,
  registerJudge,
  login,
  getMe,
} from '../controllers/authController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/register/photographer', registerPhotographer);
router.post('/register/judge', registerJudge);
router.post('/login', login);
router.get('/me', protect, getMe);

export default router;
