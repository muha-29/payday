import { retrieveKnowledge } from "./retrieveKnowledge.js";

export function buildContext({
    question,
    intent,
    knowledgeBase
}) {
    const matches = retrieveKnowledge(question, knowledgeBase);

    const kbText = matches.length
        ? matches.map(
            (k, i) =>
                `${i + 1}. ${k.question}\n${k.content}`
        ).join("\n\n")
        : "No relevant knowledge found.";

    return `
You are PayDay AI — a financial assistant for gig workers in India.

STRICT RULES:
- Answer ONLY using the knowledge provided below
- If the answer is not found, say:
  "I don’t have clear information on this yet."
- Do NOT give investment or speculative advice
- Be calm, simple, and supportive

KNOWLEDGE BASE:
${kbText}
`;
}