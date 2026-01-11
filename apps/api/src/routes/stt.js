import express from "express";  
import multer from "multer";  
import { transcribe } from "../services/sarvam.stt.js";  
import { translateToEnglish } from "../services/sarvam.translate.js";  
  
const router = express.Router();  
const upload = multer({ storage: multer.memoryStorage() });  
  
router.post("/", upload.single("audio"), async (req, res) => {  
  try {  
    if (!req.file?.buffer) {  
      return res.status(400).json({ error: "No audio file uploaded" });  
    }  
  
    const result = await processAudio(req.file.buffer);  
    res.json({   
      success: true,   
      data: result,   
      message: "Audio processed successfully"   
    });  
      
  } catch (error) {  
    console.error("[API] Error processing request:", error);  
    res.status(500).json({   
      error: "Failed to process audio",   
      details: error instanceof Error ? error.message : "Unknown error"   
    });  
  }  
});  
  
async function processAudio(audioBuffer) {  
  try {  
    const { transcript, language } = await transcribe(audioBuffer);  
      
    if (!transcript) {  
      return {   
        transcript: "",   
        language: language || "unknown",   
        english: ""   
      };  
    }  
  
    const englishText = await (language === "en-IN"   
      ? Promise.resolve(transcript)   
      : translateToEnglish(transcript, language)  
    );  
  
    return {   
      transcript,   
      language,   
      english: englishText   
    };  
  } catch (error) {  
    console.error("[Processing] Error in audio processing pipeline:", error);  
    throw new Error("Audio processing failed");  
  }  
}  
  
export default router;