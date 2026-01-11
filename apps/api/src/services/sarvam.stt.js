import { SarvamAIClient } from "sarvamai";

const client = new SarvamAIClient({
  apiSubscriptionKey: process.env.SARVAM_API_KEY,
});

/**  
 * Sarvam AI STT Service  
 * Handles speech-to-text with auto language detection and English translation  
 */
export async function transcribe(audioBuffer) {
  try {
    /* ---------- 1️⃣ Speech to Text ---------- */
    const sttResponse = await client.speechToText.transcribe({
      file: audioBuffer,
      language_code: "unknown", // Auto-detect  
      model: "saarika:v2.5",
    });

    const transcript = sttResponse.transcript;
    const language = sttResponse.language_code || "unknown";

    let english = transcript;

    /* ---------- 2️⃣ Translate to English ---------- */
    if (language !== "en-IN") {
      try {
        const translation = await client.text.translate({
          input: transcript,
          source_language_code: language,
          target_language_code: "en-IN",
        });

        english = translation.output || translation.translated_text || "";
      } catch (err) {
        console.warn(
          "[STT] Translation failed, falling back to transcript"
        );
        english = transcript;
      }
    }

    return {
      transcript, // Native language  
      english,     // English (LLM-safe)  
      language,    // Detected language  
    };
  } catch (err) {
    console.error("[STT] Failed", err);
    throw err;
  }
}