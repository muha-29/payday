const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

const DEFAULT_MODEL = 'llama-3.1-8b-instant';
const DEFAULT_TEMPERATURE = 0.3;

/**
 * Low-level Groq chat executor (single responsibility)
 */
async function executeGroqChat({
    prompt,
    model = DEFAULT_MODEL,
    temperature = DEFAULT_TEMPERATURE,
    maxTokens
}) {
    const res = await fetch(GROQ_URL, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model,
            messages: [{ role: 'user', content: prompt }],
            temperature,
            ...(maxTokens && { max_tokens: maxTokens })
        })
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error('Groq AI error: ' + err);
    }

    const data = await res.json();
    return data.choices[0].message.content;
}

/**
 * Prompt builders (pure functions)
 */
function buildDailyInsightPrompt(payload) {
    return `
    You are a friendly personal finance assistant for Indian users.

    Today income: ₹${payload.todayIncome}
    Active goals: ${payload.goals.length}

    Give ONE short actionable suggestion (max 20 words).
    No emojis. No markdown.
    `.trim();
}

function buildVoiceAssistantPrompt({ question, context, language }) {
    return `
    You are PayDay, a friendly financial assistant for Indian users.

    Rules:
    - Respond ONLY in ${language}
    - Keep answers short and spoken-friendly
    - No markdown, no emojis

    User data:
    ${JSON.stringify(context)}

    User question:
    ${question}
    `.trim();
}

/**
 * Public AI APIs (used by controllers)
 */
export async function getDailyInsight(payload) {
    const prompt = buildDailyInsightPrompt(payload);

    return executeGroqChat({
        prompt,
        maxTokens: 60
    });
}

export async function runAI({ question, context, language }) {
    const prompt = buildVoiceAssistantPrompt({
        question,
        context,
        language
    });

    return executeGroqChat({
        prompt,
        maxTokens: 150
    });
}
