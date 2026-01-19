import fs from "fs";
import path from "path";
import crypto from "crypto";
import { SarvamAIClient } from "sarvamai";
import { trackAiUsage } from "../middleware/trackAiUsage.js";
import {estimateAudioDuration} from "../utils/estimateAudioDuration.js";


const AUDIO_DIR = path.resolve("public/audio");

if (!fs.existsSync(AUDIO_DIR)) {
    fs.mkdirSync(AUDIO_DIR, { recursive: true });
}

const sarvam = new SarvamAIClient({
    apiSubscriptionKey: process.env.SARVAM_API_KEY,
});

/**
 * Generate speech using Sarvam Bulbul v2
 * - Uses official Sarvam SDK
 * - Decodes base64 audio correctly
 * - Writes browser-playable MP3
 */
export async function generateSpeech(text, language = "en-IN", userId) {
    if (!text?.trim()) return null;

    const id = crypto.randomUUID();
    const filename = `${id}.mp3`;
    const filePath = path.join(AUDIO_DIR, filename);

    console.log("🎤 [TTS] Generating speech", {
        language,
        textPreview: text.slice(0, 80),
    });

    let response;

    try {
        response = await sarvam.textToSpeech.convert({
            text,                       // 🔥 MUST match language
            model: "bulbul:v2",
            target_language_code: language,
            speaker: "vidya",            // or anushka / manisha / etc.
            pace: 0.9,
            pitch: 0,
            loudness: 1,
            enable_preprocessing: true,
            audio_format: "mp3",         // 🔥 IMPORTANT (no ffmpeg needed)
        });
    } catch (err) {
        console.error("[TTS API ERROR]", err);
        throw new Error("Sarvam TTS API call failed");
    }

    /* ---------- Validate response ---------- */
    if (!response?.audios || !Array.isArray(response.audios) || response.audios.length === 0) {
        console.error("[TTS ERROR] Invalid response from Sarvam:", response);
        throw new Error("Sarvam TTS returned no audio");
    }

    /* ---------- Decode base64 audio ---------- */
    const audioBase64 = response.audios[0];
    const audioBuffer = Buffer.from(audioBase64, "base64");

    const durationSeconds = estimateAudioDuration(audioBuffer); // 🔥 important
    await trackAiUsage(userId, durationSeconds, 'tts');

    fs.writeFileSync(filePath, audioBuffer);

    console.log("✅ [TTS] Audio saved", filePath);

    return {
        filename,
        audioUrl: `/audio/${filename}`,
    };
}