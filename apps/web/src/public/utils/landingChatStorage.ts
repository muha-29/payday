export type LandingMsg = {
    role: "user" | "bot";
    text: string;
    ts: number;
};

const STORAGE_KEY = "payday_landing_chat_v1";

export function loadLandingChat(): LandingMsg[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        return JSON.parse(raw);
    } catch {
        return [];
    }
}

export function saveLandingChat(messages: LandingMsg[]) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
        // ignore storage failures (private mode etc.)
    }
}

export function clearLandingChat() {
    localStorage.removeItem(STORAGE_KEY);
}