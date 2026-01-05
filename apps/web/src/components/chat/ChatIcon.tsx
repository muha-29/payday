import { useNavigate } from 'react-router-dom';
import './chatIcon.css';

export function ChatIcon() {
    const navigate = useNavigate();

    return (
        <button
            className="chat-fab"
            onClick={() => navigate('/app/chat')}
            aria-label="Open chat"
        >
            💬
        </button>
    );
}