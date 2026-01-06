import { Navigate, Route, Routes } from 'react-router-dom';

import Layout from './layouts/AppLayout';
import Home from './pages/Home';
import Earnings from './pages/Earnings/EarningsHome';
import Savings from './pages/Savings/SavingsHome';
import Profile from './pages/Profile/ProfileHome';
import Onboarding from './pages/Onboarding';
import AddIncome from './pages/Earnings/AddEarning';

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
                <Route path="/app/add-income" element={<AddIncome />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
