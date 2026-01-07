import { SarvamAIClient } from "sarvamai";
import { Readable } from "stream";

const client = new SarvamAIClient({
  apiSubscriptionKey: process.env.SARVAM_API_KEY,
});

export async function transcribe(buffer) {
  if (!buffer) {
    throw new Error("No audio buffer provided");
  }

  // Convert buffer → readable stream (what Sarvam SDK expects)
  const stream = Readable.from(buffer);

  const response = await client.speechToText.transcribe({
    file: stream,
    model: "saarika:v2.5",
    language_code: "unknown",
  });

  return {
    transcript: response.transcript,
    language: response.language_code || "unknown",
  };

}