import { supabase } from '../lib/supabase';

const API_URL = import.meta.env.VITE_API_URL;

export async function apiFetch<T = any>(
    path: string,
    options: RequestInit = {}
): Promise<T> {
    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;

    const res = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(options.headers || {})
        }
    });

    if (res.status === 401) {
        window.location.href = '/login';
        throw new Error('Unauthorized');
    }

    if (!res.ok) {
        const err = await res.text();
        throw new Error(err || 'API error');
    }

    return res.json() as Promise<T>;
}
