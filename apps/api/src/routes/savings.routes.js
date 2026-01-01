import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
  createSavings,
  listSavings,
  updateSavings,
  deleteSavings,
  addSavingsAmount
} from '../controllers/savings.controller.js';

const router = express.Router();

router.post('/', requireAuth, createSavings);
router.get('/', requireAuth, listSavings);
router.patch('/:id', requireAuth, updateSavings);
router.delete('/:id', requireAuth, deleteSavings);
router.post('/:id/add', requireAuth, addSavingsAmount);

export default router;
