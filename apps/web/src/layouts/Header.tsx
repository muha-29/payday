import { Bell, Mic, User, Sparkles } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';
import { getGreeting, getFormattedDate } from '../utils/dateUtils';
import { VoiceAssistant } from '../components/ai/VoiceAssistant';

export default function Header() {
    const { profile } = useProfile();

    return (
        <header className="fixed top-0 left-0 right-0 z-40
      bg-gradient-to-r from-orange-500 to-amber-400
      px-4 pt-4 pb-6 rounded-b-3xl">

            <div className="flex justify-between items-start">

                {/* LEFT */}
                <div>
                    <p className="text-white/90 text-xs">
                        {getGreeting()}
                    </p>

                    <h1 className="text-white text-lg font-bold">
                        Hello, {profile?.name || 'Friend'}! 👋
                    </h1>

                    <p className="text-white/80 text-xs">
                        {getFormattedDate()}
                    </p>

                    <span className="inline-block mt-2 px-3 py-1 text-xs
            bg-white/90 text-orange-600 rounded-full">
                        🔥 You’re saving regularly
                    </span>
                </div>

                {/* RIGHT ICONS */}
                <div className="flex items-center gap-3">

                    {/* Notifications */}
                    <IconBadge count={2}>
                        <Bell size={18} className="text-orange-600" />
                    </IconBadge>

                    {/* 🎤 Voice Agent */}
                    <VoiceAssistant
                        trigger={
                            <button className="relative p-3 rounded-full bg-orange-500 text-white shadow-lg active:scale-95 transition">
                                <Mic size={18} />
                                {/* animated pulse */}
                                <span className="absolute inset-0 rounded-full animate-ping bg-orange-400 opacity-30" />
                            </button>
                        }
                    />

                    {/* Profile */}
                    <Icon>
                        <User size={18} className="text-stone-600" />
                    </Icon>
                </div>
            </div>
        </header>
    );
}

/* ---------- small helper ---------- */
function Icon({ children }: { children: React.ReactNode }) {
    return (
        <button className="p-3 rounded-full bg-white shadow">
            {children}
        </button>
    );
}

function IconBadge({ children, count }: { children: React.ReactNode; count?: number }) {
    return (
        <button className="relative p-3 rounded-full bg-white shadow">
            {children}
            {count && (
                <span className="absolute -top-1 -right-1
          bg-red-500 text-white text-[10px]
          w-4 h-4 rounded-full flex items-center justify-center">
                    {count}
                </span>
            )}
        </button>
    );
}