"use client";
import HeaderPageTask from '@/components/client/utils/HeaderPageTask';
import { RegisterObjectProps } from '@/interfaces/NNInterfaces'
import useBackendVariablesStore from '@/store/globalStore'
import useNNTrustStore from '@/store/nnTrustStore'
import { useEffect, useMemo, useRef, useState } from 'react'
import styles from '@/styles/Jailbrake.module.css'
import { Send, Shield, Target, Unlink } from 'lucide-react';
import VulnerabilitySelection from '@/components/client/utils/VulnerabilitySelection';
import MessageThread from '@/components/client/jailbraking/MessageThread';
import ModelSelector from '@/components/client/jailbraking/ModelSelector';
import { ModelInfo } from '@/interfaces/homePageInterface';
import { BubbleInterface, JailbreakAttackOutput } from '@/interfaces/testInterfaces';

const Jailbraking = () => {
    // ######################## stored Variables ########################
    const { hostname, port } = useBackendVariablesStore()
    const { attacks, model } = useNNTrustStore()
    // ##################################################################

    // Load persisted parameters from localStorage
    const [savedParams, setSavedParams] = useState<Record<string, (number | string)[]>>(() => {
        if (typeof window !== 'undefined') {
            try {
                return JSON.parse(localStorage.getItem('jailbreak_attack_params') || '{}');
            } catch { return {}; }
        }
        return {};
    });

    // Persist savedParams to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('jailbreak_attack_params', JSON.stringify(savedParams));
    }, [savedParams]);

    // Helper: create a selectedAttack with saved params merged in
    const buildSelectedAttack = (attackId: string): RegisterObjectProps => {
        const atk = { ...attacks[attackId] };
        const saved = savedParams[attackId];
        if (saved && atk.parameters && saved.length === atk.parameters.length) {
            atk.parameters = atk.parameters.map((param, i) => ({
                ...param,
                default: saved[i] ?? param.default,
            }));
        }
        return atk;
    };

    const [selectedAttack, setSelectedAttack] = useState<RegisterObjectProps>(() => {
        const first = Object.values(attacks)[0];
        if (first) return buildSelectedAttack(first.id);
        return first;
    });

    const nlpAttacks = useMemo(() => {
        return Object.fromEntries(Object.entries(attacks).filter(([_, atk]: [string, RegisterObjectProps]) => {
            return atk.objective && ["jailbreak", "prompt_injection"].includes(atk.objective.toLowerCase())
        }))
    }, [attacks])
    useEffect(() => {
        if (attacks && Object.keys(nlpAttacks).length > 0) {
            setSelectedAttack(buildSelectedAttack(Object.values(nlpAttacks)[0].id));
        }
    }, [attacks])

    const [prompt, setPrompt] = useState<string>(() => {
        if (typeof window !== 'undefined') return localStorage.getItem('jailbreak_prompt') || "";
        return "";
    });

    useEffect(() => {
        localStorage.setItem('jailbreak_prompt', prompt);
    }, [prompt]);

    //  This variable is for handling the possibility to do the attack
    const isActive = useMemo(() => {
        return !!(model && prompt && prompt !== "" && selectedAttack)
    }, [model, prompt, selectedAttack])

    const handleChange = (value: number[]) => {
        setSelectedAttack(prev => {
            if (!prev || !prev.parameters) return prev

            const newParameters = prev.parameters.map((param, i) => ({
                ...param,
                default: value[i]
            }))

            // Persist the new parameter values to localStorage
            setSavedParams(prevSaved => ({
                ...prevSaved,
                [prev.id]: value,
            }));

            return { ...prev, parameters: newParameters }
        })
    }

    // Attacker and judge model selection
    const [attackerModel, setAttackerModel] = useState<ModelInfo | null>(null);
    const [judgeModel, setJudgeModel] = useState<ModelInfo | null>(null);

    const [goal, setGoal] = useState<string>();
    const [fullHistory, setFullHistory] = useState<BubbleInterface[]>([]);
    const [conversationChat, setConversationChat] = useState<BubbleInterface[][] | undefined>([]);
    const [modelResponse, setModelResponse] = useState<string | undefined>("");
    const [isClicked, setIsClicked] = useState<boolean>(false)
    const [adversarialPrompt, setAdversarialPrompt] = useState<string>()
    const [attackSuccess, setAttackSuccess] = useState<boolean | undefined>(undefined)
    const [bestScore, setBestScore] = useState<number | undefined>(undefined)
    const [attackMetadata, setAttackMetadata] = useState<Record<string, unknown> | undefined>(undefined)

    //  this function handles the submission of the prompt and sets the goal and adversarial prompt
    const handleSubmit = async () => {
        if (isActive) {

            setIsClicked(true)
            setGoal(prompt)

            // these variables are for the deleting the previouse states
            setAdversarialPrompt(undefined)
            setConversationChat(undefined)
            setModelResponse(undefined)
            setAttackSuccess(undefined)
            setBestScore(undefined)
            setAttackMetadata(undefined)

            try {
                const response = await fetch(`http://${hostname}:${port}/test/jailbreaking`, {
                    method: "POST",
                    body: JSON.stringify({
                        "input": prompt,
                        "model": model,
                        "attack": selectedAttack,
                        "task_type": "nlp",
                        "attacker": attackerModel,
                        "judge": judgeModel,
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    const errorDetail = await response.json();
                    console.error('Server validation error:', JSON.stringify(errorDetail, null, 2));
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data: JailbreakAttackOutput = await response.json();

                setAdversarialPrompt(data.best_prompt)
                // Flat history for the "View Full Iteration History" expanded view
                setFullHistory(data.history.map(turn => ({
                    sender: turn.role === "attacker" ? "user" : "model",
                    msg: turn.content,
                    score: turn.score
                })));
                // Grouped conversations for the chat switcher:
                // Stateless attacks → each attempt is its own chat (attacker + target)
                // Stateful attacks → one continuous chat from target_context
                setConversationChat(data.conversations.map(chat =>
                    chat.map(turn => ({
                        sender: turn.role === "attacker" ? "user" : "model",
                        msg: turn.content,
                        score: turn.score,
                    }))
                ))
                setModelResponse(data.best_response)
                setAttackSuccess(data.success)
                setBestScore(data.best_score)
                setAttackMetadata(data.metadata)
            } catch (err) {
                // Clear the goal so the loading indicator doesn't stay stuck
                console.error('Jailbreaking attack failed:', err)
                setGoal(undefined)
                setAttackSuccess(undefined)
                setBestScore(undefined)
                setAttackMetadata(undefined)
            } finally {
                setIsClicked(false)
            }
        }
    }

    // ── Scroll-linked shrink of the top section (vuln selection, models, goal) ──
    // As the user scrolls down, the top area scales down, fades out, and the results
    // are pulled up to fill the freed space. Driven by rAF for smoothness.
    const topSectionRef = useRef<HTMLDivElement>(null);
    const [topShrink, setTopShrink] = useState(0); // 0..1 progress
    const [topSectionH, setTopSectionH] = useState(0); // measured layout height

    useEffect(() => {
        const section = topSectionRef.current;
        if (!section) return;

        // Find the nearest scrollable ancestor (the app's single scroll container,
        // .dashboard_main is a CSS module class -> hashed name, so walk up instead).
        let scroller: Element | null = section.parentElement;
        while (scroller && scroller !== document.body && scroller !== document.documentElement) {
            const s = window.getComputedStyle(scroller);
            if (/(auto|scroll|overlay)/.test(s.overflowY)) break;
            scroller = scroller.parentElement;
        }
        if (!scroller || scroller === document.body) scroller = document.documentElement;

        let raf = 0;

        const onScroll = () => {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => {
                const top = scroller!.scrollTop || 0;
                // Full shrink after ~300px of scrolling
                setTopShrink(Math.min(1, Math.max(0, top / 300)));
            });
        };

        scroller.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        const ro = new ResizeObserver(() => {
            if (topSectionRef.current) setTopSectionH(topSectionRef.current.offsetHeight);
        });
        if (topSectionRef.current) ro.observe(topSectionRef.current);

        return () => {
            cancelAnimationFrame(raf);
            scroller!.removeEventListener('scroll', onScroll);
            ro.disconnect();
        };
    }, []);

    // Scale + fade + negative bottom margin (pulls MessageThread up, matching the shrink)
    const topShrinkStyle: React.CSSProperties = useMemo(() => {
        const scale = 1 - 0.15 * topShrink;
        // Layout space lost to the scale (height * (1 - scale)) — compensate so the
        // results slide up as the top compresses instead of leaving a gap.
        const lost = topSectionH * (1 - scale);
        return {
            transform: `scale(${scale})`,
            transformOrigin: 'top center',
            opacity: 1 - 0.45 * topShrink,
            marginBottom: `-${lost}px`,
            willChange: 'transform, opacity, margin-bottom',
        };
    }, [topShrink, topSectionH]);

    return (
        <div className={styles.jailbraking_page}>
            {/* Header */}
            <HeaderPageTask
                Icon={Unlink}
                title="Jailbreaking"
                descrition="Test on the loaded model, single attacks for a specific prompt."

            />
            <div className={styles.body}>
                {/* Top section shrinks & fades while scrolling down. */}
                <div ref={topSectionRef} className={styles.top_section} style={topShrinkStyle}>
                    <VulnerabilitySelection
                        stretch
                        attacks={nlpAttacks}
                        selectedAttack={selectedAttack}
                        handleSelection={(attackId) => {
                            setSelectedAttack(buildSelectedAttack(attackId))
                        }}
                        handleChange={(value: (string | number)[]) => handleChange(value as number[])}
                    />
                    <ModelSelector
                        attackerModel={attackerModel}
                        judgeModel={judgeModel}
                        onAttackerChange={setAttackerModel}
                        onJudgeChange={setJudgeModel}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '0 4px' }}>
                        <label className={styles.goal_label}>
                            <Target size={16} color="rgb(187, 58, 58)" />
                            Goal
                        </label>
                        <div className={styles.prompt_container}>
                            <input
                                type="text"
                                value={prompt}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && isActive) {
                                        handleSubmit();
                                    }
                                }}
                                onChange={(e) => { setPrompt(e.target.value) }}
                                className={styles.input_style}
                                placeholder="Insert the goal of the attack."
                            />
                            <button
                                className={`${styles.execute_button} ${isActive ? styles.active : styles.inactive}`}
                                disabled={isClicked && !isActive}
                                onClick={handleSubmit}
                            >
                                <Send size={24} />
                            </button>
                        </div>
                    </div>
                </div>
                <MessageThread
                    goal={goal}
                    adversarialPrompt={adversarialPrompt}
                    conversationChat={conversationChat}
                    modelResponse={modelResponse}
                    fullHistory={fullHistory}
                    success={attackSuccess}
                    bestScore={bestScore}
                    metadata={attackMetadata}
                />
            </div>
        </div>

    )
}

export default Jailbraking