import { apiFetch } from './api';

export async function askAI(data: {
    question: string;
    language: string;
}) {
    return apiFetch('/ai/ask', {
        method: 'POST',
        body: JSON.stringify(data)
    });
}

export function fetchChatHistory() {
    return apiFetch('/ai/history');
}
