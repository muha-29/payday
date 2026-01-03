import { useEffect, useState } from 'react';
import { fetchProfile } from '../api/profile';

export type UserProfile = {
    userId: string;
    email: string;
    language: 'te-IN' | 'en-IN';
    onboarding: {
        incomeRange: String,
        completed: { type: Boolean, default: false }
    }
};

export function useProfile() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let mounted = true;

        async function loadProfile() {
            try {
                const data = await fetchProfile();

                if (mounted) {
                    setProfile(data);
                }
            } catch (err: any) {
                if (mounted) {
                    setError(err);
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        }

        loadProfile();

        return () => {
            mounted = false;
        };
    }, []);

    return {
        profile,
        loading,
        error,
        setProfile // useful for updates (settings, onboarding)
    };
}
