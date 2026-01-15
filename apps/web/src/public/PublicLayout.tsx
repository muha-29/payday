import { Outlet, NavLink } from 'react-router-dom';
import { usePWAInstall } from "../hooks/usePWAInstall";


export default function PublicLayout() {
    const { canInstall, install } = usePWAInstall();
    return (
        <div className="min-h-screen bg-stone-50">
            {/* Header */}
            <header className="sticky top-0 z-30 bg-gradient-to-r from-orange-500 to-amber-500">
                <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-white font-bold text-xl">
                        <NavLink to="/" className="hover:underline">
                            PayDay 🪙
                        </NavLink>
                    </h1>

                    <nav className="flex gap-6 text-white text-sm font-medium">

                        <NavLink to="/Features" className="hover:underline">
                            Features
                        </NavLink>
                        <NavLink to="/team" className="hover:underline">
                            Team
                        </NavLink>
                        <NavLink
                            to="/login"
                            className="bg-white text-orange-600 px-4 py-2 rounded-xl font-semibold"
                        >
                            Login
                        </NavLink>
                    </nav>
                    {canInstall && (
                        <button
                            onClick={install}
                            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg"
                        >
                            📲 Install App
                        </button>
                    )}
                </div>
            </header>

            {/* Content */}
            <main>
                <Outlet />
            </main>
        </div>
    );
}