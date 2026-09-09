import { Bot } from 'lucide-react';
import './Bubble.css';
import { useMemo } from 'react';
import { scoreToColor } from './scoreColor';

interface BubbleProps {
    msg: string;
    user: boolean;
    score?: number;
    loading: boolean
}
const Bubble: React.FC<BubbleProps> = ({
    msg,
    user,
    score,
    loading
}) => {
    const icon = user ? <img src="/hacker.png" alt="Attacker" className="custom-icon" /> : <Bot />;
    const align = user ? 'user' : 'model';

    const text_component = useMemo(() => {
        return <div className={`bubble ${align} ${loading ? 'loading' : ''}`}>
            {msg}
            {!user && typeof score === 'number' && (
                <p
                    className="bubble-score"
                    style={{ backgroundColor: scoreToColor(score), borderColor: scoreToColor(score) }}
                >
                    Judge score = {Math.round(score)}/10
                </p>
            )}
        </div>
    }, [user, msg, score])
    return (
        <div className={`bubble_container ${align}`}>
            {!user && <div className="icon_container model">{icon}</div>}
            {text_component}
            {user && <div className="icon_container user">{icon}</div>}
        </div>

    );
}

export default Bubble;