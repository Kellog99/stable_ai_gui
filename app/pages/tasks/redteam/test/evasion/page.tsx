'use client';

import React, { useEffect, useState } from 'react';
import { ChartCandlestick, Download, Shield, X } from 'lucide-react';
import { ImageDisplay } from '@/components/client/test/ImageDisplay';
import { RegisterObjectProps } from '@/interfaces/NNInterfaces';
import useNNTrustStore from '@/store/nnTrustStore';
import HeaderPageTask from '@/components/client/utils/HeaderPageTask';
import useBackendVariablesStore from '@/store/globalStore';
import VulnerabilitySelection from '@/components/client/utils/VulnerabilitySelection';
import '@mantine/charts/styles.css';
import styles from '@/styles/Evasion.module.css';
import ModalButton from '@/components/client/test/ModalButton';
import { AttackVisualization } from '@/components/client/test/AttackVisualization';
import { handlePostRequest } from './handle_execution';

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


    const [isAttacking, setIsAttacking] = useState<boolean>(false)
    // Attack results (stored locally in this component)
    const [attackResults, setAttackResults] = useState<AttackResults>({});

    return (
        <div className="container-pages">
            {/* Header */}
            <HeaderPageTask
                Icon={Shield}
                title="Evasion Attack"
                descrition="Test on the loaded model single attack for a specific image."

            />
            <div className={styles.image_displayer}>
                {/* Selection of the attacks */}
                <ImageDisplay
                    title="Select the target image"
                    placeholder='Load an PNG or a JPG file.'
                    imageUrl={uploadedFile}
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
                {/* Results */}
                <div className={styles.results_container}>
                    <div className={styles.results_header}>
                        <ModalButton
                            Icon={ChartCandlestick}
                            disabled={false}
                            modalTitle='Attack Result'
                            children={
                                <AttackVisualization
                                    prediction={attackResults.prediction}
                                    confidence={attackResults.confidence}
                                    results={attackResults.metrics} />
                            }
                        />
                        Results
                    </div>
                    <div className={styles.results_description}>
                        <ImageDisplay
                            title="Adversarial Perturbation"
                            placeholder="No image loaded"
                            isLoading={isAttacking}
                            imageUrl={advPert ? "data:image/jpeg;base64," + advPert : undefined}
                        />

                        <ImageDisplay
                            title="Adversarial Example"
                            placeholder="No image loaded"
                            isLoading={isAttacking}
                            imageUrl={advImg ? "data:image/jpeg;base64," + advImg : undefined}
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
                </div>

            </div>
            <div className={styles.vulnerability_selection}>
                <VulnerabilitySelection
                    attacks={attacks}
                    isReady={!!(uploadedFile && model && selectedAttack) && !isAttacking}
                    selectedAttack={selectedAttack}
                    attackResults={attackResults}
                    handleSelection={(attackId) => {
                        setSelectedAttack(attacks[attackId])
                    }}
                    handleChange={handleChange}
                    handlePostRequest={() =>
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
                        })}
                />
            </div>

        </div >
    );
}


export default Test;
