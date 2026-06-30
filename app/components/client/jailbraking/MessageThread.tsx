import { useState, useEffect } from "react";
import Bubble from "./Bubble";
import { Loader, Skeleton, Tooltip } from "@mantine/core";
import { BubbleInterface } from "@/interfaces/testInterfaces";
import './MessageThread.css'
import Conversations from "./Conversations";
import { EllipsisVertical, X } from "lucide-react";

interface MessageThreadProps {
    goal?: string;
    adversarialPrompt?: string;
    conversationChat?: BubbleInterface[][];
    modelResponse?: string
}
export default function MessageThread({
    goal,
    adversarialPrompt,
    conversationChat,
    modelResponse
}: MessageThreadProps) {


    const [expanded, setExpanded] = useState<boolean>(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return <div className="screen" />;
    if (!goal) return <div className="screen" />
    return (
        <div className="screen">
            <Bubble msg={goal} user={true} loading={goal ? false : true} />
            {!expanded ?
                <div className='button_container'>
                    <div className="button_div">
                        <Tooltip label='Press to see further information'>
                            <button onClick={() => setExpanded(true)}>
                                <EllipsisVertical size={24} style={{ margin: 0, padding: 0 }} />
                            </button>
                        </Tooltip>
                    </div>
                </div> :
                <Conversations
                    onClick={() => { setExpanded(false) }}
                    conversationChat={conversationChat}
                />
            }
            <Bubble
                msg={adversarialPrompt ?? ""}
                user={true}
                loading={adversarialPrompt ? false : true}
            />
            <Bubble
                msg={modelResponse ?? ""}
                user={false}
                loading={modelResponse ? false : true}

            />
        </div>
    );
}