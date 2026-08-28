import { BubbleInterface } from '@/interfaces/testInterfaces'
import React, { useState } from 'react'
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

    return (
        <div className='conversation_container'>
            <div className='conv_chat_selector'>
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
