export async function translateToEnglish(text, sourceLang) {
    const response = await fetch("https://api.sarvam.ai/translate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "api-subscription-key": process.env.SARVAM_API_KEY,
        },
        body: JSON.stringify({
            text,
            source_language: sourceLang,
            target_language: "en-IN",
        }),
    });

    if (!response.ok) {
        throw new Error("Translation failed");
    }

    const data = await response.json();
    return data.translated_text;
}