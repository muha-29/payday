import express from 'express';
import { askAI, rateConversation } from '../controllers/ai.controller.js';
import { requireAuth } from '../middleware/auth.js';
import VoiceConversation from '../models/voiceConversation.model.js';


const router = express.Router();

router.get('/history', requireAuth, async (req, res) => {
    const userId = req.headers["x-user-id"];

    const history = await VoiceConversation
        .find({ userId })
        .sort({ createdAt: -1 })
        .limit(100)
        .lean();

    res.json(history);
});

router.post('/ask', requireAuth, askAI);
router.post('/chat/rate', requireAuth, rateConversation);

export default router;
