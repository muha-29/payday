import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
  getIncomes,
  addIncome,
  deleteIncome,
  updateIncome,
  getTodayIncome
} from '../controllers/income.controller.js';

const router = express.Router();

router.get('/', requireAuth, getIncomes);
router.get('/today', requireAuth, getTodayIncome);
router.post('/', requireAuth, addIncome);
router.put('/:id', requireAuth, updateIncome);
router.delete('/:id', requireAuth, deleteIncome);

export default router;
