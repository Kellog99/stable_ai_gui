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

    // Loading = attack submitted but no result yet.
    const loading = !!(goal && !adversarialPrompt && !modelResponse);

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
                    conversationChat={conversationChat ?? []}
                /> :
                loading ?
                    <div className="attack-loading" role="status" aria-live="polite">
                        <span className="attack-loading__text">Executing the attack</span>
                        <span className="attack-loading__dots">
                            <span className="attack-loading__dot" />
                            <span className="attack-loading__dot" />
                            <span className="attack-loading__dot" />
                        </span>
                    </div> :
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