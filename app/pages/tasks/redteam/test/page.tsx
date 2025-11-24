'use client';

import React, { useEffect, useState } from 'react';
import { Book, Bug, Camera, ChevronDown, ChevronUp, Glasses, Play, Settings2, Shield, TestTubeIcon, TrendingUp } from 'lucide-react';
import { ImageDisplay } from '@/components/client/test/ImageDisplay';
import { ParameterControls } from '@/components/client/test/ParameterControls';
import { AttackVisualization } from '@/components/client/test/AttackVisualization';
import { AdvanceResult, AttackResult } from '@/interfaces/testInterfaces';
import styles from '@/styles/Test.module.css';
import { RegisterObjectProps } from '@/interfaces/NNInterfaces';
import useNNTrustStore from '@/store/nnTrustStore';
import { startAttack } from '@/properties/urlsNNTrust';

function Test() {

    const { attacks } = useNNTrustStore()
    const [selectedAttack, setSelectedAttack] = useState<RegisterObjectProps | undefined>()
    useEffect(() => {
        if (Object.keys(attacks).length > 0) {
            setSelectedAttack(Object.values(attacks)[0])
        }
    }, [attacks])


    const [uploadedFile, setUploadedFile] = useState<string | null>(null);
    const [advanceOption, setAdvanceOption] = useState<boolean>(false)
    const [seeResults, setSeeResults] = useState<boolean>(false)
    
    const [origImg, setOrigImg] = useState<string[] | null>(null)
    const [advImg, setAdvImg] = useState<string[] | null>(null)
    const [advPert, setAdvPert] = useState<string | null>(null)

    const [atkResult, setAtkResult] = useState<AdvanceResult | undefined>();
    const [clicked, setClicked] = useState<Boolean>(false);
    const [loading, setLoading] = useState<Boolean>(false)

    const modelName = useNNTrustStore((state) => state.modelName)

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
        if (!loading) {
            setClicked(true);
            try {
                setLoading(true);
                console.log(selectedAttack)
                const response = await fetch(startAttack, {
                    method: "POST",
                    body: JSON.stringify({
                        "image": uploadedFile?.split(",")[1],
                        "attack": selectedAttack,
                        "model_name": modelName
                    }),
                    headers: {
                        'Content-type': 'application/json'
                    }
                });

                console.log('Status:', response.status);
                const data: AttackResult = await response.json();
                console.log('Response:', data);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                // the attack has been done and it has to handle the results
                setOrigImg([uploadedFile!, data.original_prediction])
                setAdvImg([data.x_adv, data.adversarial_prediction])
                setAdvPert(data.adv_perturbation)
                console.log(data.executionTime)
                console.log(data.ssim)
                setAtkResult({
                    "confidence": data.confidence,
                    "ssim": data.advance_metrics.ssim,
                    "executionTime": data.advance_metrics.executionTime,
                })
            } catch (error) {
                console.error('ERROR:', error);
            } finally {
                setLoading(false);
                setClicked(false);
            }
        }
    };


    return (
        <div className={styles.test}>
            {/* Header */}
            <div className={styles.header}>
                <Shield className={styles.header_icon} />
                <div className={styles.header_content}>
                    <h1>Testing Lab</h1>
                    <p>Test on the loaded model single attack for a specific image.</p>
                </div>
            </div>

            <div className={styles.test_components}>
                {/* Left Column - Controls */}
                <div className={styles.main}>
                    <div className={styles.section}>
                        <Camera size={'3vw'} color='#FF7F7F' />
                        <p>
                            Image Selection
                        </p>
                    </div>
                    <ImageDisplay
                        placeholder='Load an PNG or a JPG file.'
                        footer='Here it is shown the selected image.'
                        loader={true}
                        handleUpload={(file: string | null) => setUploadedFile(file)}
                    />

                    {/* Selection of the attacks */}
                    <>
                        <div className={styles.section}>
                            <Bug size={'3vw'} color='#FF7F7F' />
                            <p>
                                Vulnerability selection
                            </p>
                        </div>
                        <div className="mb-6">
                            <label style={{ color: 'grey' }}>
                                Choose the vulnerability to test:
                            </label>
                            <div className="relative">
                                <select
                                    className='attack-selection'
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
                            </div>
                        </div>
                    </>
                    <div style={{ fontSize: "1vw" }}>
                        <div className={styles.infoSection}>
                            <Book size={'2vw'} color='#FF7F7F' />
                            <h3>Info</h3>
                        </div>
                        <p style={{ color: "gray" }}>
                            <b>Knowledge: </b>{selectedAttack?.knowledge}
                        </p>
                        <p style={{ color: "gray" }}>
                            <b>Description: </b>{selectedAttack?.description}
                        </p>
                    </div>
                    <div className={styles.advance_option}>
                        <div className={styles.section}>
                            <TestTubeIcon size={'3vw'} color='#FF7F7F' />
                            <p>
                                Advance Settings
                            </p>
                        </div>
                        <button
                            onClick={() => setAdvanceOption(!advanceOption)}
                            className={styles.option_button}>
                            <Settings2 size={27} color='gray' />
                        </button>
                    </div>
                    {
                        advanceOption && (
                            selectedAttack && selectedAttack.parameters!.length > 0 ?
                                <ParameterControls
                                    handleChange={handleChange}
                                    parameters={selectedAttack?.parameters} />
                                : <p style={{ color: 'gray' }}>No parameters available for custom settings.</p>

                        )
                    }
                    <button
                        disabled={!uploadedFile}
                        className={`${styles.execute_button} ${uploadedFile ? styles.active : styles.inactive}`}
                        onClick={handleClick}
                    >
                        {clicked ? (<p>Executing...</p>) :
                            (<>
                                <Play size={'3vw'} />
                                <p>Execute attack</p>
                            </>
                            )}
                    </button>
                </div>

                {/* Right Column - Results */}
                <div className={styles.results_column}>
                    <div className={styles.section}>
                        <Glasses size={'3vw'} color='#FF7F7F' />
                        <p>
                            See the Results
                        </p>
                    </div>
                    <div className={styles.image_grid}>
                        <ImageDisplay
                            title="Original Image"
                            placeholder="No image loaded"
                            imageUrl={origImg ? origImg[0] : undefined}
                            footer={origImg ? origImg[1] : undefined}
                            loader={false}
                            is_loading={clicked.valueOf()}
                        />

                        <ImageDisplay
                            title="Adversarial Perturbation"
                            placeholder="No image loaded"
                            imageUrl={advPert ? "data:image/jpeg;base64," + advPert : undefined}
                            loader={false}
                            is_loading={clicked.valueOf()}
                        />

                        <ImageDisplay
                            title="Adversarial Example"
                            placeholder="No image loaded"
                            imageUrl={advImg ? "data:image/jpeg;base64," + advImg[0] : undefined}
                            footer={advImg ? advImg[1] : undefined}
                            loader={false}
                            is_loading={clicked.valueOf()}

                        />
                    </div>
                    <div className={styles.section}>
                        <TrendingUp size={'3vw'} color='#FF7F7F' />
                        <p>
                            More Results
                        </p>
                        <button
                            className={styles.option_button}
                            onClick={() => setSeeResults(!seeResults)}>
                            {
                                seeResults ? <ChevronUp /> : <ChevronDown />
                            }
                        </button>
                    </div>
                    {
                        seeResults ?
                            <AttackVisualization
                                results={atkResult} />
                            : null
                    }


                </div>
            </div>
        </div>
    );
}

export default Test;
