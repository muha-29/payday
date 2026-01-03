import Header from './Header';
import BottomNav from './BottomNav';
import { Outlet } from 'react-router-dom';

export default function AppLayout() {
    return (
        <div className="min-h-screen bg-stone-50">
            <Header name="Friend" />

            <main className="pt-4 pb-24 px-4">
                <Outlet />
            </main>

            <BottomNav />
        </div>
    );
}