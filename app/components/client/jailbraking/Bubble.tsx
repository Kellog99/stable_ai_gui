import { Bot, User } from 'lucide-react';
import './Bubble.css';
import { useMemo } from 'react';

interface BubbleProps {
    msg: string;
    user: boolean;
    score?: number;
    loading:boolean
}
const Bubble: React.FC<BubbleProps> = ({
    msg,
    user,
    score,
    loading
}) => {
    const icon = user ? <User /> : <Bot />;
    const align = user ? 'user' : 'model';

    const text_component = useMemo(() => {
        return <div className={`bubble ${align} ${loading ? 'loading' : ''}`}>
            {msg}
            {score && <p>Judge score = {score.toFixed(3)}</p>}
        </div>
    }, [user, msg])
    return (
        <div className={`bubble_container ${align}`}>
            {!user && <div className="icon_container model">{icon}</div>}
            {text_component}
            {user && <div className="icon_container user">{icon}</div>}
        </div>

    );
}

export default Bubble;