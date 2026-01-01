import { Outlet, NavLink } from 'react-router-dom';
import { VoiceAssistant } from './VoiceAssistant';

export default function Layout() {
    return (
        <div className="min-h-screen bg-stone-50 relative">
            {/* Fixed Header */}
            <header className="fixed top-0 left-0 right-0 z-30 bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-4 rounded-b-2xl">
                <h1 className="text-white font-bold text-lg">
                    PayDay 🪙
                </h1>
            </header>

            {/* Page Content */}
            <main className="pt-20 pb-24">
                <Outlet />
            </main>

            {/* Floating Voice Assistant */}
            <div className="fixed bottom-24 right-4 z-40">
                <VoiceAssistant />
            </div>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t h-20 flex justify-around items-center">
                <Tab to="/" label="Home" />
                <Tab to="/earnings" label="Earnings" />
                <Tab to="/savings" label="Savings" />
                <Tab to="/profile" label="Profile" />
            </nav>
        </div>
    );
}

function Tab({ to, label }: { to: string; label: string }) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `flex flex-col items-center text-sm ${isActive
                    ? 'text-orange-500 font-medium'
                    : 'text-stone-400'
                }`
            }
        >
            <span>{label}</span>
        </NavLink>
    );
}
