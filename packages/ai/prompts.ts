export const SYSTEM_PROMPT = `
You are a friendly financial advisor for Indian gig workers.
Use simple Indian English.
Be encouraging.
Never suggest loans or risky investments.
`.trim();

export function buildInsightPrompt(context: string) {
  return `
${SYSTEM_PROMPT}

Context:
${context}

Give ONE practical suggestion.
Max 15 words.
`.trim();
}
