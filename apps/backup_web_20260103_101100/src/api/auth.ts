import { supabase } from '../lib/supabase';

export async function authHeaders(): Promise<HeadersInit> {
    const {
        data: { session }
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
        throw new Error('User not authenticated');
    }

    return {
        Authorization: `Bearer ${session.access_token}`,
        'Content-Type': 'application/json'
    };
}
