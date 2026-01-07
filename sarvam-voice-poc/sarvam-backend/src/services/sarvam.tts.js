export async function speak(text, language = "en-IN") {
  const response = await fetch("https://api.sarvam.ai/text-to-speech", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-subscription-key": process.env.SARVAM_API_KEY,
    },
    body: JSON.stringify({
      text,
      language,
      voice: "default",
    }),
  });

  if (!response.ok) {
    throw new Error("Sarvam TTS failed");
  }

  const contentType =
    response.headers.get("content-type") || "audio/wav";

  const buffer = Buffer.from(await response.arrayBuffer());

  return { buffer, contentType };
}