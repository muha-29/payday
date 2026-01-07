import express from "express";
import multer from "multer";
import { transcribe } from "../services/sarvam.stt.js";
import { translateToEnglish } from "../services/sarvam.translate.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file?.buffer) {
      return res.status(400).json({ error: "No audio uploaded" });
    }

    /* ---------- 1️⃣ Speech to Text ---------- */
    const { transcript, language } = await transcribe(req.file.buffer);
    console.log("[STT] Raw Transcript:", transcript);
    if (!transcript) {
      return res.status(200).json({
        transcript: "",
        language: language || "unknown",
        english: "",
      });
    }
    console.log("[STT] Transcript:", transcript);
    /* ---------- 2️⃣ Translate to English ---------- */
    let english = transcript;
    console.log("[STT] Detected language:", language);
    if (language && language !== "en-IN") {
      try {
        english = await translateToEnglish(transcript, language);
      } catch (translateErr) {
        console.warn(
          "[STT] Translation failed, falling back to transcript",
          translateErr
        );
        english = transcript;
      }
    }

    /* ---------- 3️⃣ Response ---------- */
    res.json({
      transcript,
      language,
      english,
    });
  } catch (err) {
    console.error("[STT] Failed", err);
    res.status(500).json({ error: "STT failed" });
  }
});

export default router;