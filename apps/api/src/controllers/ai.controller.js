import VoiceConversation from '../models/voiceConversation.model.js';
import { detectIntent } from '../utils/detectIntent.js';
import { buildContext } from '../utils/buildContext.js';
import { runAI } from '../services/ai.service.js';
import { generateSpeech } from '../services/tts.service.js';
import { normalizeSpeechText } from '../utils/normalizeSpeechText.js';
import { translateFromEnglish } from '../services/sarvam.translate.fromEnglish.js';

/**
 * POST /api/ai/ask
 * Body:
 * {
 *   native: string,        // user language
 *   english: string,       // translated English (for LLM)
 *   language: string       // hi-IN, te-IN, etc
 * }
 */
export async function askAI(req, res) {
    const userId = req.user?.id;

    const {
        native,
        english,
        language = 'en-IN',
        targetLanguage = 'en-IN'
    } = req.body;

    if (!userId || !english) {
        return res.status(400).json({ error: 'Invalid request' });
    }

    let aiEnglishAnswer = '';
    let aiNativeAnswer = '';
    let audioUrl = null;
    let intent = 'unknown';

    try {
        /* ---------- 1️⃣ Detect intent (English-safe) ---------- */
        intent = detectIntent(english);

        /* ---------- 2️⃣ Build context ---------- */
        const context = await buildContext(userId, intent);

        /* ---------- 3️⃣ Normalize English ---------- */
        const normalizedEnglish = normalizeSpeechText(english, 'en-IN');

        /* ---------- 4️⃣ Run AI (ENGLISH ONLY) ---------- */
        aiEnglishAnswer = await runAI({
            question: normalizedEnglish,
            context,
            language: 'en-IN'   // 🔒 ALWAYS ENGLISH
        });

        /* ---------- 5️⃣ Translate AI → native ---------- */
        console.log('🌐 Translating AI answer to', targetLanguage);
        if (targetLanguage !== 'en-IN') {
            aiNativeAnswer = await translateFromEnglish(
                aiEnglishAnswer,
                targetLanguage
            );
        } else {
            aiNativeAnswer = aiEnglishAnswer;
        }

    } catch (err) {
        console.error('[AI ERROR]', err);
        return res.status(500).json({ error: 'AI processing failed' });
    }

    /* ---------- 6️⃣ Optional TTS (native) ---------- */
    try {
        const ttsResult = await generateSpeech(aiNativeAnswer, targetLanguage);

        if (ttsResult?.filename) {
            audioUrl = `/audio/${ttsResult.filename}`;
        }
    } catch (err) {
        console.warn('[TTS FAILED]', err.message);
    }

    /* ---------- 7️⃣ Persist conversation ---------- */
    try {
        await VoiceConversation.create({
            userId,
            question: native,              // native user text
            questionEnglish: english,      // 🔥 store English
            answer: aiNativeAnswer,        // native AI
            answerEnglish: aiEnglishAnswer,// 🔥 store English
            language : targetLanguage,
            intent,
            audioUrl,
            ttsLanguage: targetLanguage,
        });
    } catch (err) {
        console.warn('[DB WRITE FAILED]', err.message);
    }

    /* ---------- 8️⃣ Respond ---------- */
    return res.json({
        text: aiNativeAnswer,        // native (UI)
        english: aiEnglishAnswer,    // English (ℹ️)
        lang : targetLanguage,
        audioUrl
    });
}