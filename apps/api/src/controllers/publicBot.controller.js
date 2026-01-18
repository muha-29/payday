import { KNOWLEDGE_BASE } from "../app.js";
import { searchKB } from "../knowledge/searchKB.js";
import { buildKBPrompt } from "../knowledge/buildKBPrompt.js";
import { runAI } from "../services/ai.service.js";

export async function askLandingBot(req, res) {
    const { question } = req.body;

    if (!question?.trim()) {
        return res.status(400).json({ error: "Question required" });
    }

    const hits = searchKB(question, KNOWLEDGE_BASE);

    // Hard guardrail
    if (!hits.length) {
        return res.json({
            answer:
                "I can help with savings, scams, government schemes, and how PayDay works.",
            confidence: "low"
        });
    }

    const prompt = buildKBPrompt(question, hits);

    const answer = await runAI({
        question: prompt,
        language: "en-IN"
    });

    return res.json({
        answer,
        confidence: "high",
        sources: hits.map(h => h.domain)
    });
}