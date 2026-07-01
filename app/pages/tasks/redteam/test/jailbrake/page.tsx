"use client";
import HeaderPageTask from '@/components/client/utils/HeaderPageTask';
import { RegisterObjectProps } from '@/interfaces/NNInterfaces'
import useBackendVariablesStore from '@/store/globalStore'
import useNNTrustStore from '@/store/nnTrustStore'
import { useEffect, useMemo, useState } from 'react'
import styles from '@/styles/Jailbrake.module.css'
import { Send, Shield, Unlink } from 'lucide-react';
import VulnerabilitySelection from '@/components/client/utils/VulnerabilitySelection';
import MessageThread from '@/components/client/jailbraking/MessageThread';
import { BubbleInterface, JailbreakAttackOutput } from '@/interfaces/testInterfaces';

const Jailbraking = () => {
    // ######################## stored Variables ########################
    const { hostname, port } = useBackendVariablesStore()
    const { attacks, model } = useNNTrustStore()
    // ##################################################################

    const [selectedAttack, setSelectedAttack] = useState<RegisterObjectProps>(Object.values(attacks)[0])

    const nlpAttacks = useMemo(() => {
        return Object.fromEntries(Object.entries(attacks).filter(([id, atk]: [string, RegisterObjectProps]) => {
            return true//atk.objective && ["jailbraking", "prompt_injection"].includes(atk.objective)
        }))
    }, [attacks])
    useEffect(() => {
        if (attacks && Object.keys(nlpAttacks).length > 0) {
            setSelectedAttack(Object.values(nlpAttacks)[0])
        }
    }, [attacks])

    const [prompt, setPrompt] = useState<string>("");

    //  This variable is for handling the possibility to do the attack
    const isActive = useMemo(() => {
        return !!(model && prompt && prompt !== "" && selectedAttack)
    }, [model, prompt])

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

    const [goal, setGoal] = useState<string>();
    const [conversationChat, setConversationChat] = useState<BubbleInterface[][] | undefined>([]);
    const [modelResponse, setModelResponse] = useState<string | undefined>("");
    const [isClicked, setIsClicked] = useState<boolean>(false)
    const [adversarialPrompt, setAdversarialPrompt] = useState<string>()

    //  this function handles the submission of the prompt and sets the goal and adversarial prompt
    const handleSubmit = async () => {
        if (isActive) {

            setIsClicked(true)
            setGoal(prompt)

            // these variables are for the deleting the previouse states
            setAdversarialPrompt(undefined)
            setConversationChat(undefined)
            setModelResponse(undefined)


            const response = await fetch(`http://${hostname}:${port}/test/jailbreaking`, {
                method: "POST",
                body: JSON.stringify({
                    "input": prompt,
                    "model": model,
                    "attack": selectedAttack
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


            // Qua ci starebbe la post function al backend per eseguire l'attacco

            setAdversarialPrompt(data.adversarial_prompt)
            setConversationChat(data.conversations)
            setModelResponse(data.model_response)
            setIsClicked(false)
        }
    }

    return (
        <div className={styles.jailbraking_page}>
            {/* Header */}
            <HeaderPageTask
                Icon={Unlink}
                title="Jailbreaking"
                descrition="Test on the loaded model, single attacks for a specific prompt."

            />
            <div className={styles.body}>
                <MessageThread
                    goal={goal}
                    adversarialPrompt={adversarialPrompt}
                    conversationChat={conversationChat}
                    modelResponse={modelResponse}
                />

                <div className={styles.prompt_container}>
                    <input
                        type="text"
                        defaultValue={prompt}
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

    )
}

export default Jailbraking