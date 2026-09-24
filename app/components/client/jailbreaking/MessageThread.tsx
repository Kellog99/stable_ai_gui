import { useState, useEffect } from "react";
import Bubble from "./Bubble";
import { BubbleInterface } from "@/interfaces/testInterfaces";
import './MessageThread.css'
import Conversations from "./Conversations";
import AttackTree from "./AttackTree";
import { isTreeAttack } from "./attackTree";
import { Bot, Check, Flame, GitBranch, MessagesSquare, X } from "lucide-react";

interface MessageThreadProps {
    goal?: string;
    adversarialPrompt?: string;
    conversationChat?: BubbleInterface[][];
    modelResponse?: string;
    fullHistory?: BubbleInterface[];
    success?: boolean;
    bestScore?: number;
    metadata?: Record<string, unknown>;
    /** Attack that produced these results; decides whether the escalation
     *  tree view is offered (Tree-Crescendo). */
    attackId?: string;
}

/** Number of attempts = number of conversations (each chat is one attempt). */
function extractAttempts(conversationChat?: BubbleInterface[][]): number | undefined {
    return conversationChat && conversationChat.length > 0 ? conversationChat.length : undefined;
}

/** Best-effort extraction of a human-readable duration from metadata. */
function extractDuration(meta: Record<string, unknown> | undefined): string | undefined {
    if (!meta) return undefined;
    const key = Object.keys(meta).find((k) => /time|elapsed|duration|second/i.test(k));
    if (key === undefined) return undefined;

    const raw = meta[key];
    let n = typeof raw === "number" ? raw : typeof raw === "string" ? parseFloat(raw) : NaN;
    if (!Number.isFinite(n)) return undefined;
    if (n > 1500) n = n / 1000; // likely milliseconds

    if (n >= 60) {
        const m = Math.floor(n / 60);
        const s = Math.round(n % 60);
        return `${m}m ${s}s`;
    }
    return `${n.toFixed(1)}s`;
}

export default function MessageThread({
    goal,
    adversarialPrompt,
    conversationChat,
    modelResponse,
    fullHistory,
    success,
    bestScore,
    metadata,
    attackId
}: MessageThreadProps) {
    const [expanded, setExpanded] = useState<boolean>(false);
    const [isMounted, setIsMounted] = useState(false);
    // Tree-shaped attacks open on the tree; the flat chat list stays available.
    const [historyView, setHistoryView] = useState<"tree" | "chats">("tree");

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Loading = attack submitted but no result yet.
    const loading = !!(goal && !adversarialPrompt && !modelResponse);
    const attempts = extractAttempts(conversationChat);
    const duration = extractDuration(metadata);
    const treeAvailable = isTreeAttack(attackId) && (conversationChat?.length ?? 0) > 0;

    if (!isMounted) return <div className="screen" />;
    if (!goal) return <div className="screen" />

    return (
        <div className="screen">
            {loading ? (
                <div className="attack-loading-card" role="status" aria-live="polite">
                    <div className="attack-loading-spinner" />
                    <div className="attack-loading-content">
                        <span className="attack-loading__title">Running Jailbreaking Attack</span>
                    </div>
                </div>
            ) : (
                <>
                    {/* Attack stats — always visible, collapsed or expanded */}
                    <div className="results-summary">
                        {/* A successful jailbreak = high score = green; a failed
                            attack = low score = red (coherent with scoreToColor). */}
                        <span className={`result-badge ${success ? "result-badge--success" : "result-badge--fail"}`}>
                            {success ? <Check size={15} /> : <X size={15} />}
                            {success ? "Success" : "Failed"}
                        </span>
                        {typeof bestScore === "number" && (
                            <span className="result-metric">
                                <span className="result-metric__value">{Math.round(bestScore)}/10</span>
                                <span className="result-metric__label">Best score</span>
                            </span>
                        )}
                        {attempts !== undefined && (
                            <span className="result-metric">
                                <span className="result-metric__value">{attempts}</span>
                                <span className="result-metric__label">Attempts</span>
                            </span>
                        )}
                        {duration && (
                            <span className="result-metric">
                                <span className="result-metric__value">{duration}</span>
                                <span className="result-metric__label">Time</span>
                            </span>
                        )}
                    </div>

                    {/* Minimal centered toggle */}
                    {fullHistory && fullHistory.length > 0 && (
                        <button className="history-toggle" onClick={() => setExpanded(!expanded)}>
                            {expanded ? "Hide Attack History" : "Show Attack History"}
                        </button>
                    )}

                    {expanded && treeAvailable && (
                        <div className="history-view-switch" role="tablist">
                            <button
                                type="button"
                                role="tab"
                                aria-selected={historyView === "tree"}
                                className={`history-view-switch__option ${historyView === "tree" ? "active" : ""}`}
                                onClick={() => setHistoryView("tree")}
                            >
                                <GitBranch size={13} /> Tree
                            </button>
                            <button
                                type="button"
                                role="tab"
                                aria-selected={historyView === "chats"}
                                className={`history-view-switch__option ${historyView === "chats" ? "active" : ""}`}
                                onClick={() => setHistoryView("chats")}
                            >
                                <MessagesSquare size={13} /> Conversations
                            </button>
                        </div>
                    )}

                    {expanded ? (
                        treeAvailable && historyView === "tree" ? (
                            <AttackTree
                                conversationChat={conversationChat ?? []}
                                goal={goal}
                            />
                        ) : (
                            <Conversations
                                conversationChat={conversationChat ?? []}
                            />
                        )
                    ) : (
                        <div className="results-card">
                            <div className="results-card__body">
                                <div className="results-card__content">
                                    <div className="bubble-row">
                                        <span className="bubble-label">
                                            <Flame size={12} /> Adversarial prompt
                                        </span>
                                        <Bubble
                                            msg={adversarialPrompt ?? ""}
                                            user={true}
                                            loading={adversarialPrompt ? false : true}
                                        />
                                    </div>
                                    <div className="bubble-row">
                                        <span className="bubble-label">
                                            <Bot size={12} /> Target response
                                        </span>
                                        <Bubble
                                            msg={modelResponse ?? ""}
                                            user={false}
                                            loading={modelResponse ? false : true}
                                            score={typeof bestScore === "number" ? bestScore : undefined}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
