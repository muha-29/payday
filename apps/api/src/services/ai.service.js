const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

export async function getDailyInsight(payload) {
    const prompt = `
You are a friendly personal finance assistant for Indian users.

Today income: ₹${payload.todayIncome}
Active goals: ${payload.goals.length}

Give ONE short actionable suggestion (max 20 words).
No emojis. No markdown.
`;

    const res = await fetch(GROQ_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'llama-3.1-8b-instant',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.3
        })
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error('AI error: ' + err);
    }

    const data = await res.json();
    return data.choices[0].message.content;
}
