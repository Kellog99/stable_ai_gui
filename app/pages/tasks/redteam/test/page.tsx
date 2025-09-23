'use client';

import React, { useEffect, useState } from 'react';
import { Shield, Play, Loader2 } from 'lucide-react';
import { ImageUploader } from '@/components/client/test/ImageUploader';
import { AttackSelector } from '@/components/client/test/AttackSelector';
import { ImageDisplay } from '@/components/client/test/ImageDisplay';
import { ParameterControls } from '@/components/client/test/ParameterControls';
import { AttackVisualization } from '@/components/client/test/AttackVisualization';
import { AttackResult, AttackStats } from '@/interfaces/testInterfaces';
import { listAttacks } from '../prova';

import styles from '@/styles/Test.module.css';
import { AttackProps } from '@/interfaces/NNInterfaces';

function Test() { // Capitalized component name
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');

    const [attackResult, setAttackResult] = useState<AttackResult | undefined>();
    const [attackStats, setAttackStats] = useState<AttackStats | undefined>();


    // Initialize with default values, will be updated in useEffect
    const [attackList, setAttackList] = useState<AttackProps[]>([]);
    const [selectedAttack, setSelectedAttack] = useState<AttackProps | undefined>()
    useEffect(() => {
    setAttackList(listAttacks);
    if (listAttacks.length > 0) {
        const firstAttack = listAttacks[0];
        setSelectedAttack(firstAttack)  // This updates selectedAttack
    }
}, []); // This dependency causes the effect to run again when selectedAttack changes


    const handleImageUpload = (file: File, imageUrl: string) => {
        setUploadedFile(file);
        setUploadedImageUrl(imageUrl);
        setAttackResult(undefined);
        setAttackStats(undefined);
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

                    <ParameterControls parameters={selectedAttack?.parameters} />

                    <button
                        disabled={!uploadedFile}
                        className={styles.execute_button}
                    // onClick={handleExecuteAttack} // Added click handler
                    >
                    
                    </button>
                </div>

                {/* Right Column - Results */}
                <div className={styles.results_column}> 
                    <div className={styles.image_grid}>
                        <ImageDisplay
                            title="Original Image"
                            imageUrl={uploadedImageUrl}
                            placeholder="Upload an image to begin"
                        />

                        <ImageDisplay
                            title="Adversarial Perturbation"
                            imageUrl={attackResult?.perturbation}
                            placeholder="Run attack to see perturbation"
                        />

                        <ImageDisplay
                            title="Adversarial Example"
                            imageUrl={attackResult?.adversarialImage}
                            placeholder="Run attack to see result"
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