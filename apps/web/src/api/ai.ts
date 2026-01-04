import { apiFetch } from './api';

export async function askAI(data: {
    question: string;
    language: string;
}) {
    console.log('💬 Asking AI:', data.question, 'in', data.language);
    return apiFetch('/ai/ask', {
        method: 'POST',
        body: JSON.stringify(data)
    });
}

export function fetchChatHistory() {
    return apiFetch('/ai/history');
}
