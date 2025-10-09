'use client';

import React, { useEffect, useState } from 'react';
import { Play, Settings2, Shield } from 'lucide-react';
import { ImageUploader } from '@/components/client/test/ImageUploader';
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
                    <ImageUploader
                        onImageUpload={handleImageUpload}
                        uploadedImage={uploadedImageUrl}
                    />

                    <AttackSelector
                        attackList={attackList}
                        handleSelection={setSelectedAttack}
                    />

                    <div style={{ fontSize: "1vw" }}>
                        <h3>Info</h3>
                        <p style={{ color: "gray" }}>
                            <b>Knowledge: </b>{selectedAttack?.knowledge}
                        </p>
                        <p style={{ color: "gray" }}>
                            <b>Description: </b>{selectedAttack?.description}
                        </p>
                    </div>
                    <div className={styles.advance_option}>
                        <h2>Advance Settings  </h2>
                        <button
                            onClick={() => setAdvanceOption(!advanceOption)}
                            className={styles.option_button}>
                            <Settings2 size={27} color='gray' />
                        </button>
                    </div>
                    {
                        advanceOption ?
                            <ParameterControls parameters={selectedAttack?.parameters} />
                            : null
                    }
                    <button
                        disabled={!uploadedFile}
                        className={styles.execute_button}
                        onClick={handleClick} // Added click handler
                    >
                        <div>
                            <Play />
                            <p>Execute attack</p>
                        </div>
                    </button>
                </div>

                {/* Right Column - Results */}
                <div className={styles.results_column}>
                    <div className={styles.image_grid}>
                        <ImageDisplay
                            title="Original Image"
                            imageUrl={uploadedImageUrl}
                        />

                        <ImageDisplay
                            title="Adversarial Perturbation"
                            imageUrl={attackResult?.perturbation}
                        />

                        <ImageDisplay
                            title="Adversarial Example"
                            imageUrl={attackResult?.adversarialImage}
                        />
                    </div>

                    <AttackVisualization
                        result={attackResult}
                        stats={attackStats}
                    />
                </div>
            </div>
        </div>
    );
}

export default Test;