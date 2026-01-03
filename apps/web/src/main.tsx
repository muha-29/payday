import React from 'react';
import ReactDOM from 'react-dom/client';
import {
    createBrowserRouter,
    RouterProvider
} from 'react-router-dom';

import './index.css';
import App from './App';
import Layout from './layouts/AppLayout';
import { ProtectedRoute } from './components/ProtectedRoute';

// 🌐 Public
import PublicLayout from './public/PublicLayout';
import PublicHome from './public/pages/Home';
import Team from './public/pages/Team';
import Features from './public/pages/Features';

// 🔐 App pages
import Home from './pages/Home';
import Earnings from './pages/Earnings/EarningsHome';
import Savings from './pages/Savings/SavingsHome';
import Profile from './pages/Profile/ProfileHome';
import Login from './pages/Login';
import { Toaster } from 'react-hot-toast';
import Learn from './pages/Learn';
import { registerSW } from 'virtual:pwa-register';


const router = createBrowserRouter([
    // 🌐 PUBLIC (no auth)
    {
        path: '/',
        element: <PublicLayout />,
        children: [
            { index: true, element: <PublicHome /> },
            { path: 'team', element: <Team /> },
            { path: 'features', element: <Features /> },
            { path: 'login', element: <Login /> }
        ]
    },

    // 🔐 APP (auth required)
    {
        path: '/app',
        element: (
            <ProtectedRoute>
                <Layout />
            </ProtectedRoute>
        ),
        children: [
            { path: 'home', element: <Home /> },
            { path: 'earnings', element: <Earnings /> },
            { path: 'savings', element: <Savings /> },
            { path: 'profile', element: <Profile /> },
            { path: 'learn', element: <Learn /> },
        ]
    }
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <>
            <RouterProvider router={router} />
            <Toaster
                position="bottom-center"
                toastOptions={{
                    duration: 3000,
                    style: {
                        borderRadius: '12px',
                        background: '#1c1917',
                        color: '#fff'
                    }
                }}
            />
        </>
    </React.StrictMode>
);

registerSW({
    immediate: true,
})