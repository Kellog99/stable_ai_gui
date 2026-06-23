"use client";
import HeaderPageTask from '@/components/client/utils/HeaderPageTask';
import { RegisterObjectProps } from '@/interfaces/NNInterfaces'
import useBackendVariablesStore from '@/store/globalStore'
import useNNTrustStore from '@/store/nnTrustStore'
import React, { useEffect, useMemo, useState } from 'react'
import styles from '@/styles/Jailbrake.module.css'
import { Send, Shield, Unlink } from 'lucide-react';
import VulnerabilitySelection from '@/components/client/utils/VulnerabilitySelection';
import { Loader } from '@mantine/core';

const Jailbraking = () => {
    // ######################## stored Variables ########################
    const { hostname, port } = useBackendVariablesStore()
    const { attacks, model } = useNNTrustStore()
    // ##################################################################

    const [selectedAttack, setSelectedAttack] = useState<RegisterObjectProps>()
    const [isAttacking, setIsAttacking] = useState<boolean>(false)

    const nlpAttacks = useMemo(() => {
        return Object.fromEntries(Object.entries(attacks).filter(([id, atk]: [string, RegisterObjectProps]) => {
            atk.task && ["jailbraking", "prompt_injection"].includes(atk.task)
        }))
    }, [attacks])
    useEffect(() => {
        if (attacks && Object.keys(nlpAttacks).length > 0) {
            setSelectedAttack(Object.values(nlpAttacks)[0])
        }
    }, [attacks])

    const [prompt, setPrompt] = useState<string>();

    const handleChange = (value: number[]) => {
        setSelectedAttack(prev => {
            if (!prev || !prev.parameters) return prev

            const newParameters = prev.parameters.map((param, i) => ({
                ...param,
                default: value[i]
            }))

            return { ...prev, parameters: newParameters }
        })
    }
    const [isClicked, setIsClicked] = useState<boolean>(false)
    const [adversarialPrompt, setAdversarialPrompt] = useState<string>()
    const handleSubmit = () => {
        // Qua ci starebbe la post function al backend per eseguire l'attacco
        const prompt_adv = "There was ididis iasdofia sdofaoi asdoifjaosdb adswoifha ol"

        setAdversarialPrompt(prompt_adv)

        setIsClicked(false)
    }

    return (
        <div className={styles.jailbraking_page}>
            {/* Header */}
            <HeaderPageTask
                Icon={Unlink}
                title="Jailbreaking"
                descrition="Test on the loaded model, single attacks for a specific prompt."

            />
            <div className={styles.chat_container}>
                <div className={styles.attack}>
                    <div className={styles.results_container}>
                        {
                            adversarialPrompt ?
                                <div>
                                    <div className={styles.chat_box}>
                                        {prompt}
                                    </div>
                                    <Loader color="blue" size="xl" type="dots" />
                                    <div className={styles.chat_box}>
                                        {adversarialPrompt}
                                    </div>

                                </div>
                                : null
                        }
                    </div>

                    <div className={styles.prompt_container}>
                        <input
                            type="text"
                            value={prompt}
                            onChange={(e) => { setPrompt(e.target.value) }}
                            className={styles.input_style}
                            placeholder="Insert the goal of the attack."
                        />
                        <button
                            className={styles.execute_button}
                            disabled={isClicked}
                            onClick={() => {
                                setIsClicked(true);
                                handleSubmit()
                            }
                            }
                        >
                            <Send size={24} />
                        </button>
                    </div>
                </div>
                <div className={styles.bottom_item}>
                    <VulnerabilitySelection
                        attacks={nlpAttacks}
                        selectedAttack={selectedAttack}
                        handleSelection={(attackId) => {
                            setSelectedAttack(attacks[attackId])
                        }}
                        handleChange={(value: (string | number)[]) => handleChange(value as number[])}
                    />
                </div>
            </div>
        </div>

    )
}

export default Jailbraking