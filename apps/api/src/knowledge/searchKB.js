/**
 * Simple keyword-based KB search
 * Privacy-safe, deterministic, no embeddings
 */

export function searchKB(query, knowledgeBase, limit = 4) {
    if (!query || !knowledgeBase?.length) return [];

    const q = query.toLowerCase();

    const scored = knowledgeBase.map(entry => {
        const text =
            `${entry.title} ${entry.content} ${entry.domain}`.toLowerCase();

        let score = 0;

        for (const word of q.split(/\s+/)) {
            if (text.includes(word)) score += 1;
        }

        return { ...entry, score };
    });

    return scored
        .filter(e => e.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
}