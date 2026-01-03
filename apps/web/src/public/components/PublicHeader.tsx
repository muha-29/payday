import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { resolveAuthRedirect } from '../../lib/auth';
import { usePWAInstall } from '@/hooks/usePWAInstall';

export function PublicHeader() {
    const navigate = useNavigate();
    const { canInstall, install } = usePWAInstall();

    console.log('canInstall', canInstall);

    async function handleLoginClick() {
        const result = await resolveAuthRedirect();

        if (result.authenticated) {
            navigate('/app/home');
            return;
        }

        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/app/home`
            }
        });
    }

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b">
            <div className="max-w-6xl mx-auto px-4 h-16 flex justify-between items-center">
                <h1 className="font-bold text-lg text-orange-500">
                    PayDay 🪙
                </h1>
                <button
                    onClick={install}
                    className="px-3 py-1 text-sm rounded-lg border border-orange-500 text-orange-500"
                >
                    Install App
                </button>
                <button
                    onClick={handleLoginClick}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium"
                >
                    Login
                </button>
            </div>
        </header>
    );
}