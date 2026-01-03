import { useNavigate } from 'react-router-dom';
import { Bell, User, Mic } from 'lucide-react';
import { getGreeting, getFormattedDate } from '../utils/dateUtils';

export default function Header({ name }: { name: string }) {
    const navigate = useNavigate();

    return (
        <header className="bg-gradient-to-b from-orange-500 to-amber-600 px-4 pt-4 pb-6 rounded-b-2xl">
            <div className="flex justify-between items-start">
                {/* Left */}
                <div>
                    <p className="text-xs text-white/80">
                        {getGreeting()}
                    </p>
                    <h1 className="text-white text-lg font-semibold">
                        Hello, {name}! 👋
                    </h1>
                    <p className="text-xs text-white/80">
                        {getFormattedDate()}
                    </p>
                </div>

                {/* Right Icons */}
                <div className="flex items-center gap-3">
                    {/* Notifications */}
                    <button className="relative bg-white/20 p-2 rounded-full">
                        <Bell size={18} className="text-white" />
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-[10px] text-white rounded-full flex items-center justify-center">
                            2
                        </span>
                    </button>

                    {/* Voice Agent */}
                    <button className="bg-white/20 p-2 rounded-full">
                        <Mic size={18} className="text-white" />
                    </button>

                    {/* Profile */}
                    <button
                        onClick={() => navigate('/app/profile')}
                        className="bg-white p-2 rounded-full"
                    >
                        <User size={18} className="text-orange-500" />
                    </button>
                </div>
            </div>

            {/* Status pill */}
            <div className="mt-3">
                <span className="inline-block bg-white/90 text-orange-600 text-xs px-3 py-1 rounded-full">
                    🔥 You’re saving regularly
                </span>
            </div>
        </header>
    );
}