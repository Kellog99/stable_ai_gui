import { useState } from "react";
import Bubble from "./Bubble";
import { Loader } from "@mantine/core";
import { BubbleInterface } from "@/interfaces/testInterfaces";

interface MessageThreadProps {
    goal: string;
    isClicked?: boolean;
    adversarialPrompt?: string;
    conversationChat?: BubbleInterface[][];
}
export default function MessageThread({
    goal,
    isClicked,
    adversarialPrompt,
    conversationChat
}: MessageThreadProps) {


    const [expanded, setExpanded] = useState({});

    return (
        <div className="screen">
            <Bubble
                msg={goal}
                user={true}
            />
            <div className="topBar">
            </div>
            {
                isClicked ?
                    <Loader
                        size="xl"
                        color="blue"
                        type="dots"
                    /> :
                    <Bubble
                        msg={adversarialPrompt ?? ""}
                        user={true}
                    />
            }

        </div>
    );
}