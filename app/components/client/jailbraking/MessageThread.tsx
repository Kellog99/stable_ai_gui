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
    modelResponse?: string;
    fullHistory?: BubbleInterface[];
}
export default function MessageThread({
    goal,
    adversarialPrompt,
    conversationChat,
    modelResponse,
    fullHistory
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
            
            {fullHistory && fullHistory.length > 0 && (
                <button className="history-toggle" onClick={() => setExpanded(!expanded)}>
                    {expanded ? "Hide Attack History" : "View Full Iteration History"}
                </button>
            )}

            {expanded ?
                <Conversations
                    onClick={() => { setExpanded(false) }}
                    conversationChat={fullHistory ? [fullHistory] : []}
                /> : 
                <>
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
                </>
            }
        </div>
    );
}