import { NavLink } from 'react-router-dom';
import {
    Home,
    BarChart3,
    PiggyBank,
    GraduationCap,
    User
} from 'lucide-react';

import { useI18n } from '../hooks/useI18n';

const tabs = [
    { to: '/app/home', label: 'Home', Icon: Home },
    { to: '/app/earnings', label: 'Earnings', Icon: BarChart3 },
    { to: '/app/savings', label: 'Savings', Icon: PiggyBank },
    { to: '/app/learn', label: 'Learn', Icon: GraduationCap },
    { to: '/app/profile', label: 'More', Icon: User }
];

export default function BottomNav() {
    const { t } = useI18n();
    return (
        <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t h-20 flex justify-around items-center">
            {tabs.map(({ to, label, Icon }) => (
                <NavLink
                    key={to}
                    to={to}
                    className={({ isActive }) =>
                        `flex flex-col items-center gap-1 text-xs ${isActive
                            ? 'text-orange-500 font-medium'
                            : 'text-stone-400'
                        }`
                    }
                >
                    <Icon size={20} />
                    <span>{t(label)}</span>
                </NavLink>
            ))}
        </nav>
    );
}