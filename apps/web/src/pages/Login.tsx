import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';


export default function Login() {
    const navigate = useNavigate();

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            if (data.session) {
                navigate('/app/home', { replace: true });
            }
        });
    }, []);

    const comingSoon = () => {
        toast('🚧 This login option will be rolled out in next releases', {
            icon: '⏳'
        });
    };


    async function loginWithGoogle() {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/app/home`
            }
        });
    }

    return (
        <div className="flex flex-col items-center gap-4 mt-16">

            {/* Google */}
            <button
                onClick={loginWithGoogle}
                className="w-72 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 text-white font-medium shadow"
            >
                Continue with Google
            </button>

            {/* X */}
            <button
                onClick={comingSoon}
                className="w-72 py-3 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50"
            >
                Continue with X
            </button>

            {/* Facebook */}
            <button
                onClick={comingSoon}
                className="w-72 py-3 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50"
            >
                Continue with Facebook
            </button>

            {/* SSO */}
            <button
                onClick={comingSoon}
                className="w-72 py-3 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50"
            >
                Continue with SSO
            </button>

        </div>
    );
}