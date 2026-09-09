import { BubbleInterface } from '@/interfaces/testInterfaces'
import React, { useEffect, useRef, useState } from 'react'
import './Conversations.css'
import Bubble from './Bubble'
import { scoreToColor } from './scoreColor'

interface ConversationsProps {
    conversationChat?: BubbleInterface[][],
}

const Conversations: React.FC<ConversationsProps> = ({
    conversationChat,
}) => {
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const selectorRef = useRef<HTMLDivElement>(null);

    // Native non-passive wheel listener — switching chats via the wheel must NOT
    // scroll the page. React's synthetic onWheel gets treated as passive, so
    // preventDefault wouldn't cancel the scroll; a raw listener with
    // { passive: false } guarantees it does.
    useEffect(() => {
        const el = selectorRef.current;
        if (!el) return;

        const onWheel = (e: WheelEvent) => {
            const total = conversationChat?.length ?? 0;
            if (total === 0) return;
            e.preventDefault();
            // DeltaY (or DeltaX on trackpads): up/left = previous, down/right = next
            const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
            if (delta === 0) return;
            setActiveIndex((prev) => (prev + (delta > 0 ? 1 : -1) + total) % total);
        };

        el.addEventListener('wheel', onWheel, { passive: false });
        return () => el.removeEventListener('wheel', onWheel);
    }, [conversationChat?.length]);

    return (
        <div className='conversation_container'>
            <div
                className='conv_chat_selector'
                ref={selectorRef}
            >
                {(conversationChat ?? []).map((chat, i) => {
                    const score = chat.reduce<number | undefined>(
                        (acc, b) => (typeof b.score === 'number' && (acc === undefined || b.score > acc) ? b.score : acc),
                        undefined
                    );
                    return (
                        <div className="chat-item" key={i}>
                            <button
                                className={`chat_circle ${i === activeIndex ? "active" : ""}`}
                                style={{ backgroundColor: scoreToColor(score) }}
                                onClick={() => setActiveIndex(i)}
                                title={`Chat ${i + 1}`}
                            >
                                {i + 1}
                            </button>
                            <span className="chat-item__label">Chat</span>
                        </div>
                    );
                })}
            </div>
            <div className='conv_body'>
                {
                    !conversationChat || conversationChat.length === 0 || !conversationChat[activeIndex] || conversationChat[activeIndex].length === 0 ?
                        <div className='conv_no_messages'>No conversation to show.</div> :
                        <div className='conversation_chat_container'>
                            {conversationChat[activeIndex].map((bubble, idx) => (
                                <Bubble
                                    key={idx}
                                    msg={bubble.msg}
                                    user={bubble.sender === "user"}
                                    score={bubble.score}
                                    loading={bubble.msg ? false : true}
                                />
                            ))}
                        </div>
                }
            </div>
        </div>
    )
}

export default Conversations
