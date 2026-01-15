export function retrieveKnowledge(question, knowledgeBase, limit = 4) {
    const q = question.toLowerCase();

    return knowledgeBase
        .filter(entry =>
            q.includes(entry.domain.replace("_", " ")) ||
            q.includes(entry.question.toLowerCase().slice(0, 6))
        )
        .slice(0, limit);
}