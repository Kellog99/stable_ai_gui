
// ---------------- components/MetricsPanel.tsx ----------------
import React, { useState } from "react";
import SimpleLineChart from "./Linechart";
import styles from "@/styles/AttackTester.module.css";

function MetricsPanel({ mostProb }: { mostProb: number[] }) {
    const [step, setStep] = useState(0);

    return (
        <div className={styles.card}>
            <h3 className={styles.title}>Metrics</h3>
            <SimpleLineChart data={mostProb} />
            <input type="range" min={0} max={mostProb.length - 1} value={step} onChange={(e) => setStep(Number(e.target.value))} className={styles.slider} />
            <p>Step: {step + 1}</p>
        </div>
    );
}
export default MetricsPanel;