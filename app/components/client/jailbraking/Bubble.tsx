import './Bubble.css';

interface BubbleProps {
    msg: string;
    user: boolean;
}
const Bubble: React.FC<BubbleProps> = ({
    msg,
    user,
}) => {

    return (
        <div>
            <div className="bubble">
                {msg}
            </div>
        </div>
    );
}

export default Bubble;