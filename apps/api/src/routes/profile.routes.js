import express from 'express';
import {
  getOrCreateProfile,
  updateOnboarding,
  updateAvatar
} from '../controllers/profile.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/me', requireAuth, getOrCreateProfile);
router.patch('/onboarding', requireAuth, updateOnboarding);
router.patch('/avatar', requireAuth, updateAvatar);

export default router;
