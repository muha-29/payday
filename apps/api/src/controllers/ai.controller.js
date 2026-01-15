import VoiceConversation from "../models/voiceConversation.model.js";

import { detectIntent } from "../utils/detectIntent.js";
import { buildContext } from "../utils/buildContext.js";
import { normalizeSpeechText } from "../utils/normalizeSpeechText.js";

import { runAI } from "../services/ai.service.js";
import { generateSpeech } from "../services/tts.service.js";
import { translateFromEnglish } from "../services/sarvam.translate.fromEnglish.js";

// 🔒 Loaded once at boot (from index/app entry)
import { KNOWLEDGE_BASE } from "../app.js";

/**
 * POST /api/ai/ask
 *
 * Body:
 * {
 *   native: string,        // user native language (UI display)
 *   english: string,       // translated English (LLM input)
 *   language: string       // user language code (hi-IN, te-IN, ta-IN, etc)
 * }
 */
export async function askAI(req, res) {
    const userId = req.user?.id;

    const {
        native,
        english,
        language = "en-IN",
        targetLanguage = 'en-IN'
    } = req.body;

    /* ---------- 0️⃣ Validation ---------- */
    if (!userId || !english?.trim()) {
        return res.status(400).json({
            error: "Invalid request: missing user or English text"
        });
    }

    let intent = "unknown";
    let aiEnglishAnswer = "";
    let aiNativeAnswer = "";
    let audioUrl = null;
    let conversationId = null;

    try {
        /* ---------- 1️⃣ Intent detection (English only) ---------- */
        intent = detectIntent(english);

        /* ---------- 2️⃣ Build user + domain context ---------- */
        const context = await buildContext(userId, intent, {
            knowledgeBase: KNOWLEDGE_BASE
        });

        /* ---------- 3️⃣ Normalize English ---------- */
        const normalizedEnglish = normalizeSpeechText(
            english,
            "en-IN"
        );

        /* ---------- 4️⃣ Run AI (STRICT ENGLISH MODE) ---------- */
        aiEnglishAnswer = await runAI({
            question: normalizedEnglish,
            context,
            language: "en-IN"
        });
        console.log("[AI ANSWER]", aiEnglishAnswer);
        console.log("language", targetLanguage);
        /* ---------- 5️⃣ Translate AI → native (if needed) ---------- */
        if (targetLanguage !== "en-IN") {
            aiNativeAnswer = await translateFromEnglish(
                aiEnglishAnswer,
                targetLanguage
            );
        } else {
            aiNativeAnswer = aiEnglishAnswer;
        }

    } catch (err) {
        console.error("[AI ERROR]", err);
        return res.status(500).json({
            error: "AI processing failed"
        });
    }

    /* ---------- 6️⃣ Optional TTS (non-blocking) ---------- */
    try {
        const tts = await generateSpeech(
            aiNativeAnswer,
            targetLanguage
        );

        if (tts?.audioUrl) {
            audioUrl = tts.audioUrl;
        }
    } catch (err) {
        console.warn("[TTS FAILED]", err.message);
    }

    /* ---------- 7️⃣ Persist conversation (best effort) ---------- */
    try {
        const convo = await VoiceConversation.create({
            userId,

            // User input
            question: native,
            questionEnglish: english,

            // AI output
            answer: aiNativeAnswer,
            answerEnglish: aiEnglishAnswer,

            language: targetLanguage,
            intent,
            audioUrl,
            source: "voice",
            ttsLanguage: targetLanguage,
        });

        conversationId = convo._id.toString();
    } catch (err) {
        console.warn("[DB WRITE FAILED]", err.message);
    }

    /* ---------- 8️⃣ Final response ---------- */
    return res.json({
        id: conversationId,
        text: aiNativeAnswer,      // shown in chat
        english: aiEnglishAnswer,  // ℹ️ toggle
        lang: targetLanguage,
        audioUrl
    });
}

export async function rateConversation(req, res) {
    const userId = req.user.id;
    const { messageId, rating } = req.body;

    if (!messageId || rating < 1 || rating > 5) {
        return res.status(400).json({ error: "Invalid rating" });
    }

    await VoiceConversation.updateOne(
        { _id: messageId, userId },
        {
            $set: {
                rating,
                ratedAt: new Date()
            }
        }
    );

    res.json({ success: true });
}