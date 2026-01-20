import { Outlet, NavLink } from 'react-router-dom';
import { PWAInstallBanner } from "../components/PWAInstallBanner";
import LandingChatBox from "./components/LandingChatBot";

export default function PublicLayout() {
    return (
        <div className="min-h-screen bg-stone-50">
            {/* Header */}
            <header className="sticky top-0 z-30 bg-gradient-to-r from-orange-500 to-amber-500">
                <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-baseline">

                    {/* Logo */}
                    <h1 className="text-white font-bold text-xl leading-none">
                        <NavLink to="/" className="hover:underline inline-flex items-baseline">
                            PayDay
                            <span className="ml-1 text-lg leading-none">🪙</span>
                        </NavLink>
                    </h1>

                    {/* Navigation */}
                    <nav className="flex gap-6 text-white text-sm font-medium items-baseline">

                        <NavLink to="/Features" className="hover:underline">
                            Features
                        </NavLink>

                        <NavLink to="/team" className="hover:underline">
                            Team
                        </NavLink>

                        <NavLink
                            to="/login"
                            className="bg-white text-orange-600 px-4 py-2 rounded-xl font-semibold leading-none"
                        >
                            Login
                        </NavLink>

                    </nav>

                </div>
            </header>


            {/* Content */}
            <main>
                <Outlet />
                {/* Landing chatbot */}
                <LandingChatBox />

                <PWAInstallBanner />
            </main>
            <footer className="bg-orange-100 sticky bottom-0">
                <div className="max-w-6xl mx-auto px-4 py-6 text-center text-xs text-orange-900">

                    {/* Brand */}
                    <div className="font-semibold mb-1">
                        © {new Date().getFullYear()} PayDay
                    </div>

                    {/* Tagline */}
                    <div className="mb-2 opacity-80">
                        Made with <span className="text-red-500">♥</span> for India
                    </div>

                    {/* Links */}
                    <div className="flex justify-center gap-4 opacity-90">
                        <a
                            href="/privacy-policy"
                            className="hover:underline"
                        >
                            Privacy
                        </a>

                        <a
                            href="/terms"
                            className="hover:underline"
                        >
                            Terms
                        </a>

                        <a
                            href="/support"
                            className="hover:underline"
                        >
                            Support
                        </a>
                    </div>

                </div>
            </footer>
        </div>
    );
}