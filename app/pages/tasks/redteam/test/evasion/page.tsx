'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { ChartColumn, Download, Play, Shield, X } from 'lucide-react';
import { ImageDisplay } from '@/components/client/test/ImageDisplay';
import { RegisterObjectProps } from '@/interfaces/NNInterfaces';
import useNNTrustStore from '@/store/nnTrustStore';
import HeaderPageTask from '@/components/client/utils/HeaderPageTask';
import useBackendVariablesStore from '@/store/globalStore';
import VulnerabilitySelection from '@/components/client/utils/VulnerabilitySelection';
import '@mantine/charts/styles.css';
import styles from '@/styles/Evasion.module.css';
import { handlePostRequest } from './handle_execution';
import { AttackVisualization } from '@/components/client/test/AttackVisualization';

export interface AttackResults {
    prediction?: { original: string; adversarial: string };
    confidence?: { [key: string]: number[] };
    metrics?: { [key: string]: number };
}
function Test() {
    // ######################## stored Variables ########################
    const { hostname, port } = useBackendVariablesStore()
    const { attacks, model } = useNNTrustStore()
    // ##################################################################

    const [selectedAttack, setSelectedAttack] = useState<RegisterObjectProps>()
    const [isAttacking, setIsAttacking] = useState<boolean>(false)
    // Attack results (stored locally in this component)
    const [attackResults, setAttackResults] = useState<AttackResults>({
        prediction: {
            original: "cat",
            adversarial: "dog"
        },
        confidence: {
            "cat": Array.from({length: 10}, (_, i) => Math.cos(i/10)),
            "dog": Array.from({length: 10}, (_, i) => Math.cos((i+2)/10)),
        },
        metrics: {
            "perturbation_norm": 0.024,
            "attack_success_rate": 0.87,
            "avg_queries": 143.5,
            "l2_distance": 1.83
        }
    });
    const [showResults, setShowResults] = useState<boolean>(false);

    useEffect(() => {
        if (attacks && Object.keys(attacks).length > 0) {
            setSelectedAttack(Object.values(attacks)[0])
        }
    }, [attacks])

    // ######################## Upload image ########################
    const [uploadedFile, setUploadedFile] = useState<string>();
    const handleUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const base64String = reader.result as string; // Now it's a string!
                setUploadedFile(base64String);
            };
            reader.readAsDataURL(file);

        }
    }
    // #############################################################

    const [advImg, setAdvImg] = useState<string | null>(null)
    const [advPert, setAdvPert] = useState<string | null>(null)

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


    // This variable tells whether the post call could be done or not
    const isReady = useMemo(() => {
        return !!(uploadedFile && model && selectedAttack) && !isAttacking
    }, [uploadedFile, model, selectedAttack, isAttacking])


    return (
        <div className={styles.evasion_page}>
            {/* Header */}
            <HeaderPageTask
                Icon={Shield}
                title="Evasion Attack"
                descrition="Test on the loaded model single attack for a specific image."

            />
            <div className={styles.content_container}>
                <div className={styles.grid_container}>
                    {/* Selection of the attacks */}
                    <div className={styles.inline_item}>
                        <ImageDisplay
                            title="Select the target image"
                            placeholder='Load an PNG or a JPG file.'
                            imageSrc={uploadedFile}
                            handleUpload={handleUploadFile}
                            actionButton={
                                <button
                                    onClick={() => { setUploadedFile(undefined) }}
                                    className={styles.action_button}
                                >
                                    <X
                                        size={20}
                                        color="white"
                                    />
                                </button>
                            }
                        />
                    </div>
                    {/* Results */}
                    <div className={styles.inline_item}>
                        <ImageDisplay
                            title="Adversarial Perturbation"
                            placeholder="No image loaded"
                            isLoading={isAttacking}
                            imageSrc={advPert ? "data:image/jpeg;base64," + advPert : undefined}
                        />

                    </div>
                    <div className={styles.inline_item}>
                        <ImageDisplay
                            title="Adversarial Example"
                            placeholder="No image loaded"
                            isLoading={isAttacking}
                            imageSrc={advImg ? "data:image/jpeg;base64," + advImg : undefined}
                            actionButton={
                                <button
                                    onClick={() => {
                                        if (advImg) {
                                            const mimeType = "image/png"; // or image/jpeg
                                            const dataUrl = `data:${mimeType};base64,${advImg}`;

                                            const link = document.createElement("a");
                                            link.href = dataUrl;
                                            link.download = "image.png";
                                            document.body.appendChild(link);
                                            link.click();
                                            document.body.removeChild(link);
                                        }
                                    }}
                                    className={styles.action_button}
                                >
                                    <Download
                                        size={20}
                                        color="white"
                                    />
                                </button>
                            }

                        />
                    </div>


                    <div className={styles.bottom_item}>
                        <VulnerabilitySelection
                            attacks={attacks}
                            selectedAttack={selectedAttack}
                            handleSelection={(attackId) => {
                                setSelectedAttack(attacks[attackId])
                            }}
                            handleChange={(value: (string | number)[]) => handleChange(value as number[])}
                        />
                    </div>
                    <div className={styles.exec_container}>
                        {/* Execute button */}
                        <button
                            className={`${styles.vulnerability_button} ${styles.execution_button} ${!isReady ? styles.inactive : ""}`}
                            onClick={() => {
                                handlePostRequest({
                                    url: `http://${hostname}:${port}/test/single_attack`,
                                    file: uploadedFile,
                                    model: model,
                                    attack: selectedAttack,
                                    isAttacking: isAttacking,
                                    setAdvImg: setAdvImg,
                                    setAdvPert: setAdvPert,
                                    setAttackResults: setAttackResults,
                                    setIsAttacking: setIsAttacking
                                })
                            }}
                            disabled={!isReady}
                        >
                            <Play color='white' />
                        </button>

                        <button
                            className={`${styles.vulnerability_button} ${styles.results_button} ${attackResults ? "" : styles.inactive}`}
                            disabled={attackResults ? false : true}
                            onClick={() => { setShowResults(!showResults) }}
                        >
                            <ChartColumn color='white' />
                        </button>
                    </div>
                </div>
                <div>
                    {showResults ?
                        <AttackVisualization
                            prediction={attackResults.prediction}
                            confidence={attackResults.confidence}
                            results={attackResults.metrics} />
                        : null}
                </div>
            </div>
        </div >
    );
}


export default Test;
