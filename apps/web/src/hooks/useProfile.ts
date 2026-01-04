import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { fetchProfile as getProfile, updateProfile as apiUpdateProfile } from '../api/profile';

export function useProfile() {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        async function loadProfile() {
            const {
                data: { user }
            } = await supabase.auth.getUser();

            if (!user) {
                setLoading(false);
                return;
            }

            const data = await getProfile();
            if (mounted) {
                setProfile(data);
                setLoading(false);
            }
        }

        loadProfile();

        return () => {
            mounted = false;
        };
    }, []);

    /** 🔥 THIS is the key */
    async function updateProfileLocal(payload: any) {
        // 1. Optimistic UI update
        setProfile((prev: any) => ({
            ...prev,
            ...payload
        }));

        // 2. Persist to backend
        await apiUpdateProfile(payload);
    }

    return {
        profile,
        loading,
        updateProfile: updateProfileLocal
    };
}