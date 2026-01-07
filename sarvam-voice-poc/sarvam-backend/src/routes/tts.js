import { transcribe } from "../services/sarvam.stt.js";
import { translateToEnglish } from "../services/sarvam.translate.js";

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