export function buildKBPrompt(question, kbHits) {
    const kbText = kbHits
        .map(
            (h, i) =>
                `${i + 1}. (${h.domain}) ${h.title}\n${h.content}`
        )
        .join("\n\n");

    return `
You are PayDay's public information assistant.

RULES:
- Answer ONLY using the information below
- If the answer is not present, say you don't have that information
- Do NOT guess
- Do NOT give financial, legal, or investment advice
- Keep answers simple and clear

QUESTION:
${question}

INFORMATION:
${kbText}

ANSWER:
`.trim();
}