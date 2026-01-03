import { Navigate, Route, Routes } from 'react-router-dom';

import Layout from './components/Layout';
import Home from './pages/Home';
import Earnings from './pages/Earnings';
import Savings from './pages/Savings';
import Profile from './pages/Profile';
import Onboarding from './pages/Onboarding';

type RouterProps = {
    session: any;
};

export default function Router({ session }: RouterProps) {
    // 🔒 Not logged in → onboarding / login
    if (!session) {
        return <Onboarding />;
    }

    return (
        <Routes>
            {/* Main App (with bottom nav + fixed header) */}
            <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/earnings" element={<Earnings />} />
                <Route path="/savings" element={<Savings />} />
                <Route path="/profile" element={<Profile />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
