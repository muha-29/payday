import { supabase } from './supabase';

export async function resolveAuthRedirect() {
    const { data, error } = await supabase.auth.getSession();

    if (error || !data.session) {
        return { authenticated: false };
    }

    return {
        authenticated: true,
        user: data.session.user
    };
}