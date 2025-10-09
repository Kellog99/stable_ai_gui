'use client';

import React, { useEffect, useState } from 'react';
import { Book, Bug, Camera, ChevronDown, ChevronUp, Glasses, Image, Pickaxe, Play, Settings2, Shield, TestTubeIcon, TrendingUp } from 'lucide-react';
import { AttackSelector } from '@/components/client/test/AttackSelector';
import { ImageDisplay } from '@/components/client/test/ImageDisplay';
import { ParameterControls } from '@/components/client/test/ParameterControls';
import { AttackVisualization } from '@/components/client/test/AttackVisualization';
import { AttackResult, AttackStats } from '@/interfaces/testInterfaces';
import styles from '@/styles/Test.module.css';
import { AttackProps } from '@/interfaces/NNInterfaces';

function Test() {
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');

    const [attackResult, setAttackResult] = useState<AttackResult | undefined>();
    const [attackStats, setAttackStats] = useState<AttackStats | undefined>();


    // Initialize with default values, will be updated in useEffect
    const [attackList, setAttackList] = useState<AttackProps[]>([]);
    const [selectedAttack, setSelectedAttack] = useState<AttackProps | undefined>()

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

            } catch (err) {
                console.log(err instanceof Error ? err.message : "An error occurred");
            }
        }
        fetchItem();
        if (attackList.length > 0) {
            setSelectedAttack(attackList[0])
        }
    }, []);


    const handleImageUpload = (file: File, imageUrl: string) => {
        setUploadedFile(file);
        setUploadedImageUrl(imageUrl);
        setAttackResult(undefined);
        setAttackStats(undefined);
    };

    const [clicked, setClicked] = useState<Boolean>(false);
    const [loading, setLoading] = useState<Boolean>(false)
    const handleClick = () => {
        // The button has to execute an attack only if there is no attack already running in the background
        if (!loading) {
            if (clicked) {
                //logic for executing the attacks following all the previous variables
                // it must has 
            }
            setClicked(!clicked)
        }
    }
    const [advanceOption, setAdvanceOption] = useState<boolean>(false)
    const [advanceResult, setAdvanceResult] = useState<boolean>(false)
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
                        imageUrl={attackResult?.adversarialImage}
                        loader={true}
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
                            selectedAttack && selectedAttack.parameters.length > 0 ?
                                <ParameterControls parameters={selectedAttack?.parameters} />
                                : <p style={{ color: 'gray' }}>No parameters available for custom settings.</p>

                        )
                    }
                    <button
                        disabled={!uploadedFile}
                        className={styles.execute_button}
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
                            imageUrl={uploadedImageUrl}
                            loader={false}
                        />

                        <ImageDisplay
                            title="Adversarial Perturbation"
                            placeholder="No image loaded"
                            imageUrl={attackResult?.perturbation}
                            loader={false}

                        />

                        <ImageDisplay
                            title="Adversarial Example"
                            placeholder="No image loaded"
                            imageUrl={attackResult?.adversarialImage}
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
                            onClick={() => setAdvanceResult(!advanceResult)}>
                            {
                                advanceResult ? <ChevronUp /> : <ChevronDown />
                            }
                        </button>
                    </div>
                    {
                        advanceResult && (<AttackVisualization
                            result={attackResult} />)
                    }


                </div>
            </div>
        </div>
    );
}

export default Test;