import fs from "fs";
import path from "path";
import crypto from "crypto";
import fetch from "node-fetch";
import ffmpegPath from "ffmpeg-static";
import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

const AUDIO_DIR = path.resolve("public/audio");
if (!fs.existsSync(AUDIO_DIR)) fs.mkdirSync(AUDIO_DIR, { recursive: true });

export async function generateSpeech(text, language = "en-IN") {
    if (!text?.trim()) return null;

    const id = crypto.randomUUID();
    const rawFile = path.join(AUDIO_DIR, `${id}.pcm`);
    const mp3File = path.join(AUDIO_DIR, `${id}.mp3`);

    console.log("🎤 [TTS] Generating speech", {
        language,
        textPreview: text.slice(0, 60),
    });

    /* ---------- 1️⃣ Call Sarvam TTS ---------- */
    const res = await fetch("https://api.sarvam.ai/text-to-speech", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "api-subscription-key": process.env.SARVAM_API_KEY,
        },
        body: JSON.stringify({
            text,
            language_code: language,
            target_language_code: language,
            audio_format: "mp3",
            speaker: "vidya",
            pitch: 0,
            pace: 0.9,
            loudness: 1,
            speech_sample_rate: 22050,
            enable_preprocessing: true,
            model: "bulbul:v2"
        }),
    });

    if (!res.ok) {
        const err = await res.text();
        console.error("[TTS ERROR]", err);
        throw new Error("Sarvam TTS failed");
    }

    /* ---------- 2️⃣ Save RAW PCM ---------- */
    const pcmBuffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(rawFile, pcmBuffer);

    /* ---------- 3️⃣ PCM → MP3 (EXPLICIT FORMAT) ---------- */
    try {
        await execFileAsync(ffmpegPath, [
            "-y",
            "-f", "s16le",     // 🔥 raw PCM
            "-ar", "22050",    // 🔥 sample rate
            "-ac", "1",        // 🔥 mono
            "-i", rawFile,
            "-acodec", "libmp3lame",
            "-ab", "128k",
            mp3File,
        ]);
    } catch (err) {
        console.error("[FFMPEG ERROR]", err);
        throw new Error("Audio conversion failed");
    } finally {
        fs.unlinkSync(rawFile);
    }

    /* ---------- 4️⃣ Return browser-safe audio ---------- */
    return {
        filename: `${id}.mp3`,
        audioUrl: `/audio/${id}.mp3`,
    };
}