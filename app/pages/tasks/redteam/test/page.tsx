'use client';

import React, { useEffect, useState } from 'react';
import { Bug, ChartCandlestick, InfoIcon, Play, Settings, Shield } from 'lucide-react';
import { ImageDisplay } from '@/components/client/test/ImageDisplay';
import { AttackVisualization } from '@/components/client/test/AttackVisualization';
import { SingleAttackProps } from '@/interfaces/testInterfaces';
import styles from '@/styles/Test.module.css';
import { RegisterObjectProps } from '@/interfaces/NNInterfaces';
import useNNTrustStore from '@/store/nnTrustStore';
import HeaderPageTask from '@/components/client/utils/HeaderPageTask';
import { Modal } from '@mantine/core';
import ParametersWindow from '@/components/redtool/Parameters';
import ModalButton from './ModalButton';

function Test() {

    const { attacks } = useNNTrustStore()
    const [selectedAttack, setSelectedAttack] = useState<RegisterObjectProps | undefined>()
    useEffect(() => {
        if (Object.keys(attacks).length > 0) {
            setSelectedAttack(Object.values(attacks)[0])
        }
    }, [attacks])


    const [uploadedFile, setUploadedFile] = useState<string | null>(null);
    const [advImg, setAdvImg] = useState<string[] | null>(null)
    const [advPert, setAdvPert] = useState<string | null>(null)

    const [atkResult, setAtkResult] = useState<{ [key: string]: number } | undefined>(undefined);
    const [atkConf, setAtkConf] = useState<{ [key: string]: number[] } | undefined>(undefined);

    const [clicked, setClicked] = useState<Boolean>(false);
    const [loading, setLoading] = useState<Boolean>(false)

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
    const handleClick = async () => {
        if (!loading) {
            setClicked(true);
            try {
                setLoading(true);
                console.log(selectedAttack)
                const response = await fetch("startAttack", {
                    method: "POST",
                    body: JSON.stringify({
                        "image": uploadedFile?.split(",")[1],
                        "attack": selectedAttack,
                        "model_name": "modelName"
                    }),
                    headers: {
                        'Content-type': 'application/json'
                    }
                });

                console.log('Status:', response.status);
                const data: SingleAttackProps = await response.json();
                console.log('Response:', data);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                // the attack has been done and it has to handle the results
                setAdvImg([data.x_adv, data.adversarial_prediction])
                setAdvPert(data.adv_perturbation)
                console.log("pert=", data.adv_perturbation)

                setAtkResult({ ...data.advance_metrics })
                setAtkConf(data.confidence)

            } catch (error) {
                console.error('ERROR:', error);
            } finally {
                setLoading(false);
                setClicked(false);
            }
        }
    };

    // Variables for the Info's and Setting's modal
    const [infoModalOpened, setInfoModalOpened] = useState(false);
    const [infoResults, setInfoResults] = useState(false);
    const [openSettings, setOpenSettings] = useState(false);

    return (
        <div className="container-pages">
            {/* Header */}
            <HeaderPageTask
                Icon={Shield}
                title="Testing Lab"
                descrition="Test on the loaded model single attack for a specific image."

            />
            {/* Selection of the attacks */}
            <div className={styles.section}>
                <div className={styles.section_title}>
                    <Bug size={'calc(var(--icon-size) * 1.5)'} color='red' />
                    <p>
                        Vulnerability selection
                    </p>
                </div>
                <label style={{ color: 'grey' }}>
                    Choose the vulnerability to test:
                </label>

                <select
                    className={styles.attack_selection}
                    onChange={(e) => {
                        setSelectedAttack(attacks[e.target.value])
                    }}>
                    {Object.entries(attacks).map(([id, attack]) => (
                        <option
                            key={id}
                            value={attack.id}
                        >
                            {attack.name.charAt(0).toUpperCase() + attack.name.slice(1)}
                        </option>
                    ))}
                </select>

                <div className={styles.buttons_container}>
                    {/* Execute button */}
                    <ModalButton
                        Icon={Play}
                        background="#10b981"
                        disabled={!uploadedFile}
                        hoverDescription='Click the button to execute the attack.'
                        handleClick={handleClick}
                    />

                    {/* Info button */}
                    <ModalButton
                        Icon={InfoIcon}
                        background="#3b82f6"
                        disabled={false}
                        hoverDescription='View information and help documentation.'
                        handleClick={() => setInfoModalOpened(true)}
                    />

                    {/* Attack settings button */}
                    <ModalButton
                        Icon={Settings}
                        background="#6366f1"
                        disabled={false}
                        hoverDescription='Configure settings and preferences.'
                        handleClick={() => setOpenSettings(true)}
                    />

                    {/* Attack settings button */}
                    <ModalButton
                        Icon={ChartCandlestick}
                        background="#f59e0b"
                        disabled={false}
                        hoverDescription='View attack results and analytics.'
                        handleClick={() => setInfoResults(true)}
                    />

                    {/* Info Modal */}
                    <Modal
                        opened={infoModalOpened}
                        onClose={() => setInfoModalOpened(false)}
                        title="Information"
                        styles={{
                            title: {
                                color: 'black',
                                fontWeight: "bold",
                            }
                        }}
                        centered>
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            fontSize: "0.8rem"
                        }}>
                            <p>These are the main informations about the attack that have been selected:</p>
                            <span >
                                <b>Knowledge: </b>{selectedAttack?.knowledge}
                            </span>
                            <span>
                                <b>Description: </b>{selectedAttack?.description}
                            </span>
                        </div>
                    </Modal>

                    {/* Results Modal */}
                    <Modal
                        opened={infoResults}
                        onClose={() => setInfoResults(false)}
                        title="Information"
                        styles={{
                            title: {
                                color: 'black',
                                fontWeight: "bold",
                            }
                        }}
                        size="auto"
                        centered>
                        <AttackVisualization
                            prediction={{ original: "cat", adversarial: "dog" }}
                            confidence={atkConf}
                            results={atkResult} />
                    </Modal>

                    {/* Settings Modal */}

                    {
                        selectedAttack ?
                            selectedAttack.parameters ?
                                selectedAttack.parameters?.length > 0 ?
                                    <ParametersWindow
                                        isOpen={openSettings}
                                        parameters={selectedAttack?.parameters}
                                        onClose={() => { setOpenSettings(false) }}
                                        handleParametersChange={handleChange}

                                    />
                                    : <p style={{ color: 'gray' }}>There are no parameters to set.</p>
                                : <p style={{ color: 'gray' }}>No parameters have been defined.</p>

                            : <p style={{ color: 'gray' }}>No parameters available for custom settings.</p>
                    }
                </div>
            </div>
            <div className={styles.image_displayer}>
                <ImageDisplay
                    title="Original Image"
                    placeholder='Load an PNG or a JPG file.'
                    handleUpload={(file: string | null) => setUploadedFile(file)}
                    loader={true}
                />

                <ImageDisplay
                    title="Adversarial Perturbation"
                    placeholder="No image loaded"
                    imageUrl={advPert ? advPert : undefined}
                    loader={false}

                />

                <ImageDisplay
                    title="Adversarial Example"
                    placeholder="No image loaded"
                    imageUrl={advImg ? advImg[0] : undefined}
                    loader={false}

                />
            </div>
        </div >
    );
}


export default Test;
