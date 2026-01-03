import Header from './Header';
import BottomNav from './BottomNav';
import { Outlet } from 'react-router-dom';

export default function AppLayout() {
    return (
        <div className="min-h-screen bg-stone-50">
            <Header />

            {/* space for fixed header */}
            <main className="pt-40 pb-24">
                <Outlet />
            </main>

            <BottomNav />
        </div>
    );
}