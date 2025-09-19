'use client';

// ---------------- pages/index.tsx ----------------
import React, { useState, useRef } from "react";
import { Camera, Play } from "lucide-react";

import AttackControls from "@/components/client/test/AttackControl";
import MetricsPanel from "@/components/client/test/Metrics";
import styles from "@/styles/AttackTester.module.css";

export default function Home() {
    const [mostProb, setMostProb] = useState<number[]>([]);
    const labels = { 0: "Cat", 1: "Dog", 2: "Car" };
    const [preview, setPreview] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    }
    return (
        <div className={styles.testContainer}>
            <h1>Test</h1>
            <p className={styles.paragraph}>
                In this part it is possible to test single vulnerabilities againts a model on a specific input and download the results.
                To do that the procedure is divided into 4 steps:
                <div className={styles.pointlist}>
                    <ol>
                        <li> Upload an image</li>
                        <li> Select the vulnerability to use.</li>
                        <li> (Optional) Modify the settings.</li>
                        <li> Press the Execution button.</li>
                    </ol>
                </div>
            </p>
            <div className={styles.container}>
                {/* Part where it is possible to uploade the Image */}
                <div className={styles.inputSettings}>
                    <div>
                        <h3 className={styles.title}>1. Image <Camera /></h3>
                        <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className={styles.input} />
                        <div className={styles.imagePreview}>
                            {preview ?
                                <img src={preview}
                                    alt="preview"
                                    className={styles.image} />
                                : <div className={styles.placeholder}>No image</div>}
                        </div>
                    </div>
                    <AttackControls labels={labels} onConfigChange={() => { }} />
                    <button className={styles.button} onClick={() => setMostProb(Array.from({ length: 20 }, () => Math.random()))}>Run Attack</button>
                </div>
                <MetricsPanel mostProb={mostProb} />
            </div>
        </div>
    );
}