'use client';

import React, { useState } from 'react';
import { Shield, Play, Loader2 } from 'lucide-react';
import { ImageUploader } from '@/components/client/test/ImageUploader';
import { AttackSelector } from '@/components/client/test/AttackSelector';
import { ParameterControls } from '@/components/client/test/ParameterControls';
import { ImageDisplay } from '@/components/client/test/ImageDisplay';
import { AttackVisualization } from '@/components/client/test/AttackVisualization';
import { AttackConfig, AttackResult, AttackStats, AttackType } from '@/interfaces/testInterfaces';

import styles from '@/styles/Test.module.css';

function test() {
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');
    const [selectedAttack, setSelectedAttack] = useState<AttackType>('fgsm');
    const [attackConfig, setAttackConfig] = useState<AttackConfig>({
        epsilon: 0.031,
        iterations: 10,
        stepSize: 0.007,
        confidence: 0
    });
    const [attackResult, setAttackResult] = useState<AttackResult | undefined>();
    const [attackStats, setAttackStats] = useState<AttackStats | undefined>();

    const [isLoading, setIsLoading] = useState<boolean>(false)

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
                    <p>Test on the loaded model singol attack for a specific image.</p>
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
                        selectedAttack={selectedAttack}
                        onAttackChange={setSelectedAttack}
                    />

                    <ParameterControls
                        config={attackConfig}
                        onConfigChange={setAttackConfig}
                        attackType={selectedAttack}
                    />

                    <button
                        disabled={!uploadedFile || isLoading}
                        className={styles.execute_button}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className={styles.button_icon} />
                                <span>Attacking... { }%</span>
                            </>
                        ) : (
                            <>
                                <Play className={styles.button_icon} />
                                <span>Execute Attack</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Right Column - Results */}
                <div className="flex-1 p-6">
                    <div className="grid grid-cols-3 gap-6 mb-6">
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

export default test