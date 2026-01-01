import { supabase } from '../lib/supabase';

export default function Login() {
    async function loginWithGoogle() {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin
            }
        });
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-white px-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow">
                <h1 className="text-xl font-bold text-center mb-2">
                    Welcome to PayDay 🪙
                </h1>
                <p className="text-center text-stone-500 mb-6">
                    Your personal financial assistant
                </p>

                <button
                    onClick={loginWithGoogle}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium"
                >
                    Continue with Google
                </button>
            </div>
        </div>
    );
}
