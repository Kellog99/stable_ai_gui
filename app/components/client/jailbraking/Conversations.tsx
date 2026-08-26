import { BubbleInterface } from '@/interfaces/testInterfaces'
import { MessageSquare, X } from 'lucide-react'
import React, { useMemo, useState } from 'react'
import './Conversations.css'
import { Scroller, Group } from '@mantine/core'
import Bubble from './Bubble'

interface ConversationsProps {
    conversationChat?: BubbleInterface[][],
    onClick: () => void
}

const Conversations: React.FC<ConversationsProps> = ({
    conversationChat,
    onClick
}) => {
    const [activeIndex, setActiveIndex] = useState<number>(0)



    return (
        <div className='conversation_container'>
            <div className='header_conversation'>
                <p>Further information</p>
                <button onClick={onClick}>
                    <X size={20} />
                </button>
            </div>
            <div className='conv_body'>
                {
                    !conversationChat || conversationChat.length === 0 || !conversationChat[activeIndex] || conversationChat[activeIndex].length === 0 ?
                        <div className='conv_no_messages'>No conversation to show.</div> :
                        <>
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
                            <div className='scrollable_container'>
                                <Scroller draggable>
                                    <Group
                                        gap="xs"
                                        wrap="nowrap"
                                        style={{ paddingLeft: "10px", width: "65%" }}>
                                        {conversationChat.map((_, i) => {
                                            return <button
                                                onClick={() => setActiveIndex(i)}
                                                className={`chat_button ${i === activeIndex ? "active" : ""}`}
                                            >
                                                Chat {i + 1}
                                            </button>
                                        })
                                        }
                                    </Group>
                                </Scroller>
                            </div>
                        </>
                }

            </div>
        </div>
    )
}

export default Conversations