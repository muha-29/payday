import VoiceConversation from '../models/voiceConversation.model.js';
import { detectIntent } from '../utils/detectIntent.js';
import { buildContext } from '../utils/buildContext.js';
import { runAI } from '../services/ai.service.js';
import { generateSpeech } from '../services/tts.service.js';
import { normalizeSpeechText } from '../utils/normalizeSpeechText.js';


/**
 * POST /api/ai/ask
 * Body: { question: string, language?: string }
 */
export async function askAI(req, res) {
    const userId = req.user?.id;
    const { question, language = 'en' } = req.body;

    if (!question || !userId) {
        return res.status(400).json({
            error: 'Invalid request'
        });
    }

    let answer = '';
    let audioUrl = null;
    let intent = 'unknown';
    const normalizedQuestion = normalizeSpeechText(question, language);

    try {
        // 1️⃣ Detect intent
        intent = detectIntent(question);

        // 2️⃣ Build user-specific context
        const context = await buildContext(userId, intent);

        // 3️⃣ Run AI (TEXT ONLY — must never fail silently)
        answer = await runAI({
            question : normalizedQuestion,
            context,
            language
        });
    } catch (err) {
        console.error('[AI ERROR]', err);
        return res.status(500).json({
            error: 'AI processing failed'
        });
    }

    // 4️⃣ Try TTS (NON-BLOCKING, OPTIONAL)
    try {
        const ttsResult = await generateSpeech(answer, language);

        if (ttsResult?.filename) {
            audioUrl = `/audio/${ttsResult.filename}`;
        }
    } catch (err) {
        // 🔥 DO NOT CRASH — TTS IS OPTIONAL
        console.warn('[TTS FAILED]', err.message);
    }

    // 5️⃣ Persist conversation (best-effort)
    try {
        await VoiceConversation.create({
            userId,
            question,
            answer,
            language,
            intent
        });
    } catch (err) {
        console.warn('[DB WRITE FAILED]', err.message);
        // Do NOT block response
    }

    // 6️⃣ Always respond
    return res.json({
        answer,
        audioUrl
    });
}