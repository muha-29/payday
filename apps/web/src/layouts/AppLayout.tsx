import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import Header from './Header';
import BottomNav from './BottomNav';

import { ChatLauncher } from '../components/chat/ChatLauncher';
import { ChatModal } from '../components/chat/ChatModal';

export default function AppLayout() {
    const [isChatOpen, setIsChatOpen] = useState(false);

    console.log('AppLayout render, isChatOpen =', isChatOpen);

    return (
        <div className="min-h-screen bg-stone-50">
            <Header name="Friend" />

            <main className="pt-4 pb-24 px-4">
                <Outlet />
            </main>

            <BottomNav />

            <ChatLauncher
                onOpen={() => {
                    console.log('📢 onOpen fired');
                    setIsChatOpen(true);
                }}
            />

            {isChatOpen && (
                <ChatModal
                    onClose={() => {
                        console.log('❌ Chat closed');
                        setIsChatOpen(false);
                    }}
                    
                />
            )}
        </div>
    );
}