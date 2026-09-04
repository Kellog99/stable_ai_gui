"use client";
import HeaderPageTask from '@/components/client/utils/HeaderPageTask';
import { RegisterObjectProps } from '@/interfaces/NNInterfaces'
import useBackendVariablesStore from '@/store/globalStore'
import useNNTrustStore from '@/store/nnTrustStore'
import useJailbreakStore from '@/store/jailbreakStore'
import { useEffect, useMemo, useRef, useState } from 'react'
import styles from '@/styles/jailbreak.module.css'
import { Send, Shield, Target, Unlink } from 'lucide-react';
import VulnerabilitySelection from '@/components/client/utils/VulnerabilitySelection';
import MessageThread from '@/components/client/jailbreaking/MessageThread';
import ModelSelector from '@/components/client/jailbreaking/ModelSelector';
import { BubbleInterface, JailbreakAttackOutput } from '@/interfaces/testInterfaces';

const Jailbreaking = () => {
    // ######################## stored Variables ########################
    const { hostname, port } = useBackendVariablesStore()
    const { attacks, model } = useNNTrustStore()

    const {
        prompt,
        setPrompt,
        goal,
        setGoal,
        selectedAttackId,
        setSelectedAttackId,
        savedParams,
        setSavedParams,
        attackerModel,
        setAttackerModel,
        judgeModel,
        setJudgeModel,
        backendStartupId,
        setBackendStartupId,
        fullHistory,
        conversationChat,
        modelResponse,
        adversarialPrompt,
        setAdversarialPrompt,
        attackSuccess,
        bestScore,
        attackMetadata,
        isClicked,
        setIsClicked,
        setResults,
        clearResults,
    } = useJailbreakStore()

    // Check backend startup ID on mount to detect backend restart / turn off
    useEffect(() => {
        // if (goal && !adversarialPrompt && !modelResponse) {
        //     clearResults();
        // }

        if (!hostname || !port) return;
        fetch(`http://${hostname}:${port}/`)
            .then(res => res.json())
            .then(data => {
                if (data && data.startup_id) {
                    if (backendStartupId && backendStartupId !== data.startup_id) {
                        clearResults();
                    }
                    setBackendStartupId(data.startup_id);
                }
            })
            .catch(err => {
                console.error("Failed to connect to backend for startup check:", err);
                clearResults();
            });
    }, [hostname, port, backendStartupId, setBackendStartupId, clearResults, goal, adversarialPrompt, modelResponse]);
    // ##################################################################

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

    const nlpAttacks = useMemo(() => {
        return Object.fromEntries(Object.entries(attacks).filter(([_, atk]: [string, RegisterObjectProps]) => {
            return atk.objective && ["jailbreak", "prompt_injection"].includes(atk.objective.toLowerCase())
        }))
    }, [attacks])

    const selectedAttack = useMemo(() => {
        if (selectedAttackId && attacks[selectedAttackId]) {
            return buildSelectedAttack(selectedAttackId);
        }
        const first = Object.values(nlpAttacks)[0] || Object.values(attacks)[0];
        if (first) return buildSelectedAttack(first.id);
        return null;
    }, [attacks, nlpAttacks, selectedAttackId, savedParams]);

    const attacksWithSavedParams = useMemo(() => {
        return Object.fromEntries(
            Object.entries(nlpAttacks).map(([id, atk]) => {
                const saved = savedParams[id];
                if (saved && atk.parameters && saved.length === atk.parameters.length) {
                    const updatedParams = atk.parameters.map((param, i) => ({
                        ...param,
                        default: saved[i] ?? param.default,
                    }));
                    return [id, { ...atk, parameters: updatedParams }];
                }
                return [id, atk];
            })
        );
    }, [nlpAttacks, savedParams]);

    useEffect(() => {
        if (attacks && Object.keys(nlpAttacks).length > 0 && !selectedAttackId) {
            setSelectedAttackId(Object.values(nlpAttacks)[0].id);
        }
    }, [attacks, nlpAttacks, selectedAttackId, setSelectedAttackId]);

    //  This variable is for handling the possibility to do the attack
    const isActive = useMemo(() => {
        return !!(model && prompt && prompt !== "" && selectedAttack)
    }, [model, prompt, selectedAttack])

    const handleChange = (value: number[]) => {
        if (!selectedAttack || !selectedAttack.parameters) return;

        const newParameters = selectedAttack.parameters.map((param, i) => ({
            ...param,
            default: value[i]
        }));

        // Persist the new parameter values to store
        setSavedParams(prevSaved => ({
            ...prevSaved,
            [selectedAttack.id]: value,
        }));
    }

    //  this function handles the submission of the prompt and sets the goal and adversarial prompt
    const handleSubmit = async () => {
        if (isActive && selectedAttack) {
            setIsClicked(true)
            const currentGoal = prompt
            setGoal(currentGoal)

            // Clear previous states before starting
            setResults({
                goal: currentGoal,
                fullHistory: [],
                conversationChat: [],
                modelResponse: "",
                adversarialPrompt: undefined,
                attackSuccess: false,
                bestScore: 0,
                attackMetadata: {},
            })

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

                // Flat history for the "View Full Iteration History" expanded view
                const historyBubbles: BubbleInterface[] = data.history.map(turn => ({
                    sender: turn.role === "attacker" ? "user" : "model",
                    msg: turn.content,
                    score: turn.score
                }));

                // Grouped conversations for the chat switcher
                const convBubbles: BubbleInterface[][] = data.conversations.map(chat =>
                    chat.map(turn => ({
                        sender: turn.role === "attacker" ? "user" : "model",
                        msg: turn.content,
                        score: turn.score,
                    }))
                );

                setResults({
                    goal: currentGoal,
                    fullHistory: historyBubbles,
                    conversationChat: convBubbles,
                    modelResponse: data.best_response,
                    adversarialPrompt: data.best_prompt,
                    attackSuccess: data.success,
                    bestScore: data.best_score,
                    attackMetadata: data.metadata,
                });
            } catch (err) {
                console.error('Jailbreaking attack failed:', err)
                setGoal(undefined)
                setIsClicked(false)
            } finally {
                setIsClicked(false)
            }
        }
    }

    // ── Scroll-linked shrink of the top section (vuln selection, models, goal) ──
    const topSectionRef = useRef<HTMLDivElement>(null);
    const [topShrink, setTopShrink] = useState(0); // 0..1 progress
    const [topSectionH, setTopSectionH] = useState(0); // measured layout height

    useEffect(() => {
        const section = topSectionRef.current;
        if (!section) return;

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

    const topShrinkStyle: React.CSSProperties = useMemo(() => {
        const scale = 1 - 0.15 * topShrink;
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
        <div className={styles.jailbreaking_page}>
            {/* Header */}
            <HeaderPageTask
                Icon={Unlink}
                title="Jailbreaking"
                descrition="Test on the loaded model, single attacks for a specific prompt."
            />
            <div className={styles.body}>
                {/* Top section shrinks & fades while scrolling down. */}
                <div ref={topSectionRef} className={styles.top_section} style={topShrinkStyle}>
                {/* <div className={styles.top_section}> */}
                    <VulnerabilitySelection
                        stretch
                        attacks={attacksWithSavedParams}
                        selectedAttack={selectedAttack}
                        handleSelection={(attackId) => {
                            setSelectedAttackId(attackId)
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

export default Jailbreaking;
