export async function translateToEnglish(text, sourceLanguage) {
    if (!text || sourceLanguage === "en-IN") return text;

    const response = await fetch("https://api.sarvam.ai/translate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "api-subscription-key": process.env.SARVAM_API_KEY,
        },
        body: JSON.stringify({
            input: text,                          // ✅ REQUIRED
            source_language_code: sourceLanguage, // ✅ REQUIRED
            target_language_code: "en-IN",        // ✅ REQUIRED
        }),
    });

    if (!response.ok) {
        const err = await response.text();
        console.error("[Sarvam Translate] Raw error:", err);
        throw new Error("Sarvam translation failed");
    }

    const data = await response.json();

    return (
        data.output ||
        data.translated_text ||
        ""
    );
}