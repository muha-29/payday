import { apiFetch } from './api';

export async function askAI({
    native,
    question,
    language
}: {
    native: string;
    question: string;
    language: string;
}) {
    console.log('💬 Asking AI:', question, 'in', language);
    return apiFetch('/ai/ask', {
        method: 'POST',
        body: JSON.stringify({native ,english : question, targetLanguage : language, language : 'en-IN'})
    });
}

export function fetchChatHistory() {
    return apiFetch('/ai/history');
}
