'use client';

import React, {useEffect, useMemo, useState} from 'react';
import {ChartColumn, Download, Play, Shield, X} from 'lucide-react';
import {ImageDisplay} from '@/components/client/evasion/ImageDisplay';
import {ParametersProps, RegisterObjectProps, supportsTask} from '@/interfaces/NNInterfaces';
import {ConfidenceData} from '@/interfaces/testInterfaces';
import useNNTrustStore from '@/store/nnTrustStore';
import HeaderPageTask from '@/components/client/utils/HeaderPageTask';
import useBackendVariablesStore from '@/store/globalStore';
import VulnerabilitySelection from '@/components/client/utils/VulnerabilitySelection';
import '@mantine/charts/styles.css';
import styles from '@/styles/Evasion.module.css';
import {handlePostRequest} from './handle_execution';
import {AttackVisualization} from '@/components/client/evasion/AttackVisualization';
import {updateParameterDefaults} from '@/lib/utils';

export interface AttackResults {
    prediction?: { original: string; adversarial: string };
    confidence?: ConfidenceData;
    metrics?: { [key: string]: number | null };
    parameters?: ParametersProps[];
}

const toImageDataUrl = (image?: string | null): string | undefined => {
    if (!image) return undefined
    return image.startsWith('data:') ? image : `data:image/png;base64,${image}`
}

function Test() {
    // ######################## stored Variables ########################
    const {hostname, port, device} = useBackendVariablesStore()
    const {attacks, model} = useNNTrustStore()
    // ##################################################################

    const [selectedAttackId, setSelectedAttackId] = useState<string>()
    const [attackParameterOverrides, setAttackParameterOverrides] = useState<Record<string, ParametersProps[]>>({})
    const [isAttacking, setIsAttacking] = useState<boolean>(false)
    // Attack results (stored locally in this component)
    const [attackResults, setAttackResults] = useState<AttackResults>({});
    const [showResults, setShowResults] = useState<boolean>(false);

    const evasionAttacks = useMemo(
        () => Object.fromEntries(
            Object.entries(attacks).filter(([, attack]) =>
                attack.objective?.toLowerCase() === 'evasion'
            )
        ), [attacks, model?.task])

    useEffect(() => {
        setSelectedAttackId((currentId) =>
            currentId && evasionAttacks[currentId] ? currentId : Object.keys(evasionAttacks)[0]
        )
    }, [evasionAttacks])

    const displayedAttacks: { [key: string]: RegisterObjectProps } = useMemo(() => {
        return Object.fromEntries(
            Object.entries(evasionAttacks).map(([id, attack]) => [
                id,
                attackParameterOverrides[id]
                    ? {...attack, parameters: attackParameterOverrides[id]}
                    : attack
            ])
        ) as { [key: string]: RegisterObjectProps }
    }, [evasionAttacks, attackParameterOverrides])

    const selectedAttack: RegisterObjectProps | undefined = selectedAttackId ? displayedAttacks[selectedAttackId] : undefined

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

    const isObjectDetection = model?.task === 'detection'
    const displayedOriginalImage = isObjectDetection
        ? attackResults.prediction?.original
        : advPert
    const displayedAdversarialImage = isObjectDetection
        ? attackResults.prediction?.adversarial
        : advImg

    const handleChange = (value: (number | string)[]) => {
        if (!selectedAttackId || !selectedAttack?.parameters) return

        const newParameters = updateParameterDefaults(selectedAttack.parameters, value)

        setAttackParameterOverrides((previous) => ({
            ...previous,
            [selectedAttackId]: newParameters
        }))
    }


    // This variable tells whether the post call could be done or not
    const isReady = useMemo(() => {
        return !!(uploadedFile && model && selectedAttack)
            && (model?.task === 'classification' || model?.task === 'detection')
            && !isAttacking
    }, [uploadedFile, model, selectedAttack, isAttacking])

    const handleDownloadAdversarialImage = () => {
        const imageSrc = toImageDataUrl(displayedAdversarialImage)
        if (!imageSrc) return

        const link = document.createElement('a')

        link.href = imageSrc
        link.download = 'image.png'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <div className={styles.evasion_page}>
            {/* Header */}
            <HeaderPageTask
                Icon={Shield}
                title="Evasion Attack"
                description="Test on the loaded model single attack for a specific image."

            />
            <div className={styles.content_container}>
                <div className={styles.grid_container}>
                    {/* Selection of the attacks */}
                    <ImageDisplay
                        title="Select the target image"
                        placeholder='Load an PNG or a JPG file.'
                        imageSrc={uploadedFile}
                        handleUpload={handleUploadFile}
                        actionButton={
                            <button
                                onClick={() => {
                                    setUploadedFile(undefined)
                                }}
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
                    <ImageDisplay
                        title="Original Prediction"
                        placeholder="No image loaded"
                        isLoading={isAttacking}
                        imageSrc={isAttacking ? undefined : toImageDataUrl(displayedOriginalImage)}
                    />

                    <ImageDisplay
                        title="Adversarial Example"
                        placeholder="No image loaded"
                        isLoading={isAttacking}
                        imageSrc={isAttacking ? undefined : toImageDataUrl(displayedAdversarialImage)}
                        actionButton={
                            <button
                                onClick={handleDownloadAdversarialImage}
                                className={styles.action_button}
                            >
                                <Download
                                    size={20}
                                    color="white"
                                />
                            </button>
                        }

                    />


                    <div className={styles.bottom_item}>
                        <VulnerabilitySelection
                            attacks={displayedAttacks}
                            selectedAttack={selectedAttack}
                            handleSelection={setSelectedAttackId}
                            handleChange={handleChange}
                        />
                    </div>
                    <div className={styles.exec_container}>
                        {/* Execute button */}
                        <button
                            aria-label="Run attack"
                            className={`${styles.vulnerability_button} ${styles.execution_button} ${!isReady ? styles.inactive : ""}`}
                            disabled={!isReady}
                            onClick={() => {
                                handlePostRequest({
                                    url: `http://${hostname}:${port}/test/single_attack`,
                                    file: uploadedFile,
                                    model: model,
                                    attack: selectedAttack,
                                    device: device,
                                    isAttacking: isAttacking,
                                    setAdvImg: setAdvImg,
                                    setAdvPert: setAdvPert,
                                    setAttackResults: setAttackResults,
                                    setIsAttacking: setIsAttacking
                                })
                            }}
                        >
                            <Play color='white'/>
                        </button>

                        <button
                            aria-label={showResults ? 'Hide attack details' : 'Show attack details'}
                            aria-expanded={showResults}
                            aria-controls="evasion-attack-details"
                            className={`${styles.vulnerability_button} ${styles.results_button} ${Object.keys(attackResults).length > 0 ? "" : styles.inactive}`}
                            disabled={Object.keys(attackResults).length === 0}
                            onClick={() => {
                                setShowResults((visible) => !visible)
                            }}
                        >
                            <ChartColumn color='white'/>
                        </button>
                    </div>
                </div>
                {showResults ? (
                    <div id="evasion-attack-details" role="region" aria-label="Attack details" className={styles.results_container}>
                        <AttackVisualization
                            prediction={isObjectDetection ? undefined : attackResults.prediction}
                            confidence={attackResults.confidence}
                            results={attackResults.metrics}
                            parameters={attackResults.parameters}/>
                    </div>
                ) : null}
            </div>
        </div>
    );
}


export default Test;
