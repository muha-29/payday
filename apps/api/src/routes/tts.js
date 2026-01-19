import express from "express";
import multer from "multer";
import { transcribe } from "../services/sarvam.stt.js";
import { translateToEnglish } from "../src/services/sarvam.translate.js";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 🔥 10 MB
  },
});

router.post("/", upload.single("audio"), async (req, res) => {
  try {
    const { transcript, language } = await transcribe(req.file.buffer);

    let english = transcript;

    if (language !== "en-IN") {
      english = await translateToEnglish(transcript, language);
    }

    res.json({
      transcript,
      language,
      english,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "STT failed" });
  }
});

export default router;