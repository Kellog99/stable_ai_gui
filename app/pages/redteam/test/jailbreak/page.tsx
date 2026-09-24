"use client";
import HeaderPageTask from '@/components/client/utils/HeaderPageTask';
import {RegisterObjectProps} from '@/interfaces/NNInterfaces'
import useBackendVariablesStore from '@/store/globalStore'
import useNNTrustStore from '@/store/nnTrustStore'
import useJailbreakStore from '@/store/jailbreakStore'
import React, {useEffect, useMemo, useRef, useState} from 'react'
import styles from '@/styles/jailbreak.module.css'
import {Send, Target, Unlink} from 'lucide-react';
import VulnerabilitySelection from '@/components/client/utils/VulnerabilitySelection';
import MessageThread from '@/components/client/jailbreaking/MessageThread';
import ModelSelector from '@/components/client/jailbreaking/ModelSelector';
import SavedAttacksBoard from '@/components/client/jailbreaking/SavedAttacksBoard';
import {BubbleInterface, JailbreakAttackOutput} from '@/interfaces/testInterfaces';
import {handleSubmit} from './handle_execution';

const Jailbreaking = () => {
    // ######################## stored Variables ########################
    const {hostname, port} = useBackendVariablesStore()
    const {attacks, model} = useNNTrustStore()

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
        attackSuccess,
        bestScore,
        attackMetadata,
        resultAttackId,
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
        const atk = {...attacks[attackId]};
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
                    return [id, {...atk, parameters: updatedParams}];
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
        return !!(model?.task === "language" && prompt && prompt !== "" && selectedAttack)
    }, [model, prompt, selectedAttack])

    const handleChange = (value: number[]) => {
        if (!selectedAttack || !selectedAttack.parameters) return;

        // Persist the new parameter values to store
        setSavedParams(prevSaved => ({
            ...prevSaved,
            [selectedAttack.id]: value,
        }));
    }

    // Maps a JailbreakAttackOutput (fresh or replayed from a saved state) onto the store's result shape.
    const applyJailbreakOutput = (data: JailbreakAttackOutput, attackId?: string) => {
        // Flat history for the "View Full Iteration History" expanded view
        const historyBubbles: BubbleInterface[] = data.history.map(turn => ({
            sender: turn.role === "attacker" ? "user" : "model",
            msg: turn.content,
            score: turn.score,
            improvement: turn.improvement,
            depth: turn.depth,
        }));

        // Grouped conversations for the chat switcher. For tree attacks each
        // entry is one root→leaf path, which is what the tree view rebuilds
        // the escalation tree from — hence `improvement` and `depth` are kept.
        const convBubbles: BubbleInterface[][] = data.conversations.map(chat =>
            chat.map(turn => ({
                sender: turn.role === "attacker" ? "user" : "model",
                msg: turn.content,
                score: turn.score,
                improvement: turn.improvement,
                depth: turn.depth,
            }))
        );

        setResults({
            goal: data.goal,
            resultAttackId: attackId,
            fullHistory: historyBubbles,
            conversationChat: convBubbles,
            modelResponse: data.best_response,
            adversarialPrompt: data.best_prompt,
            attackSuccess: data.success,
            bestScore: data.best_score,
            attackMetadata: data.metadata,
        });
    };

    // Loads a previously saved attack state and shows it as if it had just been run.
    const handleLoadSavedAttack = (data: JailbreakAttackOutput) => {
        setPrompt(data.goal);
        setGoal(data.goal);
        // The board only lists runs of the currently selected attack, so that
        // is the attack the replayed results come from.
        applyJailbreakOutput(data, selectedAttack?.id);
    };

    const submitAttack = () => handleSubmit({
        url: `http://${hostname}:${port}/test/jailbreaking`,
        isActive,
        prompt,
        model,
        selectedAttack,
        attackerModel,
        judgeModel,
        setGoal,
        setIsClicked,
        setResults,
        applyJailbreakOutput,
    });

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

        scroller.addEventListener('scroll', onScroll, {passive: true});
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
                description="Test on the loaded model, single attacks for a specific prompt."
            />
            {/* Top section shrinks & fades while scrolling down. */}
            <div ref={topSectionRef} className={styles.top_section} style={topShrinkStyle}>
                {/* <div className={styles.top_section}> */}
                <VulnerabilitySelection
                    stretch
                    attacks={attacksWithSavedParams}
                    selectedAttack={selectedAttack ?? undefined}
                    handleSelection={(attackId) => {
                        setSelectedAttackId(attackId)
                    }}
                    handleChange={(value: (string | number)[]) => handleChange(value as number[])}
                />
                <div style={{display: 'flex', alignItems: 'flex-start', gap: '12px'}}>
                    <div style={{flex: 1, minWidth: 0}}>
                        <ModelSelector
                            attackerModel={attackerModel}
                            judgeModel={judgeModel}
                            onAttackerChange={setAttackerModel}
                            onJudgeChange={setJudgeModel}
                        />
                    </div>
                    {/* Offset to align with the model dropdowns' row, below the "Attacker/Judge Model" labels. */}
                    <div style={{marginTop: '22px'}}>
                        <SavedAttacksBoard
                            attackId={selectedAttack?.id ?? null}
                            attackName={selectedAttack?.name}
                            onSelect={handleLoadSavedAttack}
                        />
                    </div>
                </div>
                <div style={{display: 'flex', flexDirection: 'column', gap: '6px', padding: '0 4px'}}>
                    <label className={styles.goal_label}>
                        <Target size={16} color="rgb(187, 58, 58)"/>
                        Goal
                    </label>
                    <div className={styles.prompt_container}>
                        <input
                            type="text"
                            value={prompt}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && isActive) {
                                    submitAttack();
                                }
                            }}
                            onChange={(e) => {
                                setPrompt(e.target.value)
                            }}
                            className={styles.input_style}
                            placeholder="Insert the goal of the attack."
                        />
                        <button
                            className={`${styles.execute_button} ${isActive ? styles.active : styles.inactive}`}
                            disabled={isClicked || !isActive}
                            onClick={submitAttack}
                        >
                            <Send size={24}/>
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
                attackId={resultAttackId}
            />
        </div>
    )
}

export default Jailbreaking;
