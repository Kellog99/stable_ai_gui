'use client';

import React, { useEffect, useState } from 'react';
import { Book, Bug, Camera, ChevronDown, ChevronUp, Glasses, Play, Settings2, Shield, TestTubeIcon, TrendingUp } from 'lucide-react';
import { AttackSelector } from '@/components/client/test/AttackSelector';
import { ImageDisplay } from '@/components/client/test/ImageDisplay';
import { ParameterControls } from '@/components/client/test/ParameterControls';
import { AttackVisualization } from '@/components/client/test/AttackVisualization';
import { AdvanceResult, AttackResult } from '@/interfaces/testInterfaces';
import styles from '@/styles/Test.module.css';
import { RegisterObjectProps, ParametersProps } from '@/interfaces/NNInterfaces';

function Test() {
    // Initialize with default values, will be updated in useEffect
    const [attackList, setAttackList] = useState<RegisterObjectProps[]>([]);
    const [selectedAttack, setSelectedAttack] = useState<RegisterObjectProps | undefined>()
    const [attackParameters, setAttackParameters] = useState<ParametersProps[]>([])

    // since the attacks in the library are fixed, it is required just one fetch.
    useEffect(() => {
        async function fetchItem() {
            // fetching the attacks
            try {
                const response = await fetch('http://127.0.0.1:8000/attacks/getInfo');
                if (!response.ok) {
                    throw new Error(`HTTP error for the attack List! Status: ${response.status}`);
                }
                const json = await response.json();
                setAttackList(json);
                // By default I set the first attack in the list and, therefore, use its information
                if (json.length > 0) {
                    setSelectedAttack(json[0])
                }

            } catch (err) {
                console.log(err instanceof Error ? err.message : "An error occurred");
            }
        }
        fetchItem();


    }, []);

    // This part is for defining the variables that will handle the loading of the image
    const [uploadedFile, setUploadedFile] = useState<string | null>(null);
    const [advanceOption, setAdvanceOption] = useState<boolean>(false)
    // this variable is for seeing the metrics of one attack
    const [seeResults, setSeeResults] = useState<boolean>(false)

    const [origImg, setOrigImg] = useState<string[] | null>(null)
    const [advImg, setAdvImg] = useState<string[] | null>(null)
    const [advPert, setAdvPert] = useState<string | null>(null)

    const [atkResult, setAtkResult] = useState<AdvanceResult | undefined>();
    const [clicked, setClicked] = useState<Boolean>(false);
    const [loading, setLoading] = useState<Boolean>(false)


    const handleClick = async () => {
        if (!loading && clicked) {
            try {
                setLoading(true);
                console.log("data =", uploadedFile?.split(",")[1])
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
                const data: AttackResult = await response.json();
                console.log('Response:', data);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                // the attack has been done and it has to handle the results
                setOrigImg([uploadedFile!, data.original_prediction])
                setAdvImg([data.x_adv, data.adversarial_prediction])
                setAdvPert(data.adv_perturbation)
                console.log("pert=", data.adv_perturbation)

                setAtkResult({
                    "confidence": data.confidence,
                    "ssim": data.ssim,
                    "executionTime": data.executionTime,
                })
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

                    <div className={styles.section}>
                        <Bug size={'3vw'} color='#FF7F7F' />
                        <p>
                            Vulnerability selection
                        </p>
                    </div>
                    <AttackSelector
                        attackList={attackList}
                        handleSelection={setSelectedAttack}
                    />

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
                                    parameters={selectedAttack?.parameters} />
                                : <p style={{ color: 'gray' }}>No parameters available for custom settings.</p>

                        )
                    }
                    <button
                        disabled={!uploadedFile}
                        className={`${styles.execute_button} ${uploadedFile ? styles.active : styles.inactive}`}
                        onClick={handleClick} // Added click handler
                    >
                        <Play size={'3vw'} />
                        <p>Execute attack</p>
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
