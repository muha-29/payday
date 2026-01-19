import { supabase } from "../lib/supabase";

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Centralized API fetch
 * - Attaches auth token
 * - Attaches x-user-id header
 * - Handles 401 globally
 */
export async function apiFetch<T = any>(
    path: string,
    options: RequestInit = {}
): Promise<T> {
    const { data } = await supabase.auth.getSession();

    const session = data.session;
    const token = session?.access_token;
    const userId = session?.user?.id;

    const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...(userId && { "x-user-id": userId }),
        ...(options.headers || {}),
    };

    const res = await fetch(`${API_URL}${path}`, {
        ...options,
        headers,
        credentials: "include", // keep cookies if backend uses them
    });

    /* ---------- Auth handling ---------- */
    if (res.status === 401) {
        console.warn("[API] Unauthorized – redirecting to login");
        setTimeout(() => {
            window.location.href = "/login";
        }, 500);
        throw new Error("Unauthorized");
    }

    /* ---------- Error handling ---------- */
    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "API request failed");
    }

    /* ---------- Success ---------- */
    return res.json() as Promise<T>;
}