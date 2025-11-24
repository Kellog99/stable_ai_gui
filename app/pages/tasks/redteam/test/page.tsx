'use client';

import React, { useEffect, useState } from 'react';
import { Book, Bug, Camera, ChevronDown, ChevronUp, Glasses, InfoIcon, Play, Settings, Settings2, Shield, TestTubeIcon, TrendingUp } from 'lucide-react';
import { ImageDisplay } from '@/components/client/test/ImageDisplay';
import { ParameterControls } from '@/components/client/test/ParameterControls';
import { AttackVisualization } from '@/components/client/test/AttackVisualization';
import { SingleAttackProps } from '@/interfaces/testInterfaces';
import styles from '@/styles/Test.module.css';
import { RegisterObjectProps } from '@/interfaces/NNInterfaces';
import useNNTrustStore from '@/store/nnTrustStore';
import HeaderPageTask from '@/components/client/utils/HeaderPageTask';
import { Modal } from '@mantine/core';

function Test() {

    const { attacks } = useNNTrustStore()
    const [selectedAttack, setSelectedAttack] = useState<RegisterObjectProps | undefined>()
    useEffect(() => {
        if (Object.keys(attacks).length > 0) {
            setSelectedAttack(Object.values(attacks)[0])
        }
    }, [attacks])

    // This part is for defining the variables that will handle the loading of the image
    const [uploadedFile, setUploadedFile] = useState<string | null>(null);
    const [advanceOption, setAdvanceOption] = useState<boolean>(false)
    // this variable is for seeing the metrics of one attack
    const [seeResults, setSeeResults] = useState<boolean>(false)

    const [origImg, setOrigImg] = useState<string[] | null>(null)
    const [advImg, setAdvImg] = useState<string[] | null>(null)
    const [advPert, setAdvPert] = useState<string | null>(null)

    const [atkResult, setAtkResult] = useState<{ [key: string]: number } | undefined>(undefined);
    const [atkConf, setAtkConf] = useState<{ [key: string]: number[] } | undefined>(undefined);

    const [clicked, setClicked] = useState<Boolean>(false);
    const [loading, setLoading] = useState<Boolean>(false)

    const handleChange = (index: number, value: number) => {
        setSelectedAttack(prev => {
            if (!prev || !prev.parameters) return prev

            const newParameters = prev.parameters.map((param, i) =>
                i === index ? { ...param, ['default']: value } : param
            )
            return { ...prev, parameters: newParameters }
        })
    }

    const handleClick = async () => {
        if (!loading && clicked) {
            try {
                setLoading(true);
                const response = await fetch('http://127.0.0.1:8000/attacks/executeAttack', {
                    method: "POST",
                    body: JSON.stringify({
                        "image": uploadedFile?.split(",")[1],
                        "attack": selectedAttack
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
                setOrigImg([uploadedFile!, data.original_prediction])
                setAdvImg([data.x_adv, data.adversarial_prediction])
                setAdvPert(data.adv_perturbation)
                console.log("pert=", data.adv_perturbation)

                setAtkResult({ ...data.advance_metrics })
                setAtkConf(data.confidence)

            } catch (error) {
                console.error('ERROR:', error);
            } finally {
                setLoading(false);
                setClicked(!clicked);
            }
        } else if (!loading && !clicked) {
            setClicked(!clicked);
        }
    };

    // Variables for the Info's and Setting's modal
    const [infoModalOpened, setInfoModalOpened] = useState(false);
    const [settingsModalOpened, setSettingsModalOpened] = useState(false);

    return (
        <div className="container-pages">
            {/* Header */}
            <HeaderPageTask
                Icon={Shield}
                title="Testing Lab"
                descrition="Test on the loaded model single attack for a specific image."

            />
            <div className={styles.image_displayer}>
                <ImageDisplay
                    title="Original Image"
                    placeholder='Load an PNG or a JPG file.'
                    footer='Here it is shown the selected image.'
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
                    footer={advImg ? advImg[1] : undefined}
                    loader={false}

                />
            </div>

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
                <div className={styles.buttons_container}>
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
                    <button
                        onClick={handleClick}
                        className={styles.button}>
                        <Play />
                    </button>
                    <button
                        className={styles.button}
                        onClick={() => setInfoModalOpened(true)}>
                        <InfoIcon />
                    </button>

                    <button
                        className={styles.button}
                        onClick={() => setSettingsModalOpened(true)}>
                        <Settings />
                    </button>
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

                    {/* Settings Modal */}
                    <Modal
                        opened={settingsModalOpened}
                        styles={{
                            title: {
                                color: 'black',
                                fontWeight: "bold",
                            }
                        }}
                        onClose={() => setSettingsModalOpened(false)}
                        title="Settings"
                        centered>
                        {
                            selectedAttack && selectedAttack.parameters!.length > 0 ?
                                <ParameterControls
                                    handleChange={handleChange}
                                    parameters={selectedAttack?.parameters} />
                                : <p style={{ color: 'gray' }}>No parameters available for custom settings.</p>
                        }
                    </Modal>
                </div>

            </div>
            <div className={styles.section}>
                <div className={styles.section_title}>
                    <TrendingUp size={'calc(var(--icon-size) * 1.5)'} color='red' />
                    <p>
                        See the Results
                    </p>
                </div>
                <AttackVisualization
                    confidence={atkConf}
                    results={atkResult} />

            </div>
        </div>
    );
}


export default Test;
