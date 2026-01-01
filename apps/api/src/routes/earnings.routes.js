import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
    addEarning,
    listEarnings,
    todayEarnings,
    earningsStats
} from '../controllers/earnings.controller.js';

const router = express.Router();

router.post('/', requireAuth, addEarning);
router.get('/', requireAuth, listEarnings);
router.get('/today', requireAuth, todayEarnings);
router.get('/stats', requireAuth, earningsStats);

export default router;
