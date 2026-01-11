export async function translateFromEnglish(text, targetLanguage) {
    if (!text || targetLanguage === "en-IN") return text;

    console.log("🌐 Translating from English to", targetLanguage);

    const res = await fetch("https://api.sarvam.ai/translate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "api-subscription-key": process.env.SARVAM_API_KEY,
        },
        body: JSON.stringify({
            input: text,                          // ✅ REQUIRED
            source_language_code: "en-IN",        // ✅ REQUIRED
            target_language_code: targetLanguage, // ✅ REQUIRED
        }),
    });

    if (!res.ok) {
        const err = await res.text();
        console.error("[Sarvam Translate From English] Raw error:", err);
        throw new Error("Translate from English failed");
    }

    const data = await res.json();

    return (
        data.output ||
        data.translated_text ||
        ""
    );
}