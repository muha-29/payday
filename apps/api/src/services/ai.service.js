const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

const DEFAULT_MODEL = 'llama-3.1-8b-instant';
const DEFAULT_TEMPERATURE = 0.3;

/**
 * Language enforcement rules
 * IMPORTANT: locale ≠ language instruction
 */
function getLanguageInstruction(language) {
    if (!language) return 'Respond in English.';

    if (language.startsWith('te')) {
        return 'Respond ONLY in Telugu language using Telugu script. Do NOT use Roman letters.';
    }

    if (language.startsWith('hi')) {
        return 'Respond ONLY in Hindi language.';
    }

    if (language.startsWith('en')) {
        return 'Respond ONLY in English language.';
    }

    return 'Respond in English.';
}
import Sanscript from '@indic-transliteration/sanscript';

function normalizeSpeechText(text, language) {
    if (language?.startsWith('te')) {
        // Roman (ITRANS-like) → Telugu
        return Sanscript.t(text, 'itrans', 'telugu');
    }
    return text;
}

/**
 * Low-level Groq chat executor
 */
async function executeGroqChat({
    systemPrompt,
    userPrompt,
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
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ],
            temperature,
            ...(maxTokens && { max_tokens: maxTokens })
        })
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error('Groq AI error: ' + err);
    }

    const data = await res.json();
    return data.choices[0].message.content.trim();
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

function buildVoiceAssistantPrompts({ question, context, language }) {
    const systemPrompt = `
        You are PayDay, a trusted personal finance assistant for Indian users.

        ${getLanguageInstruction(language)}

        Strict rules:
        - Do NOT mix languages
        - Do NOT transliterate Telugu into English letters
        - Keep responses short and spoken-friendly
        - No markdown
        - No emojis
    `.trim();

    const userPrompt = `
        User financial context (private, do not mention explicitly):
        ${JSON.stringify(context)}

        User question:
        ${question}
    `.trim();

    return { systemPrompt, userPrompt };
}


/**
 * Public AI APIs (used by controllers)
 */
export async function getDailyInsight(payload) {
    const prompt = buildDailyInsightPrompt(payload);

    return executeGroqChat({
        systemPrompt: 'You are a personal finance assistant.',
        userPrompt: prompt,
        maxTokens: 60
    });
}


export async function runAI({ question, context, language }) {
    const { systemPrompt, userPrompt } =
        buildVoiceAssistantPrompts({ question, context, language });

    return executeGroqChat({
        systemPrompt,
        userPrompt,
        maxTokens: 150
    });
}

