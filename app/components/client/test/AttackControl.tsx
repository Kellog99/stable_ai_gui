// ---------------- components/AttackControls.tsx ----------------
import React, { useState, useEffect } from "react";
import styles from "@/styles/AttackTester.module.css";

function AttackControls({ labels, onConfigChange }: { labels: Record<number, string>; onConfigChange: (cfg: any) => void }) {
    const [attack, setAttack] = useState("FGSM");
    const [targeted, setTargeted] = useState(false);
    const [targetClass, setTargetClass] = useState<number | null>(null);

    useEffect(() => {
        onConfigChange({ attack, targeted, targetClass });
    }, [attack, targeted, targetClass, onConfigChange]);

    return (
        <div className= { styles.card } >
        <h3 className={ styles.title }> 2. Select Attack 🖥️</h3>
            < select value = { attack } onChange = {(e) => setAttack(e.target.value)
} className = { styles.select } >
    <option>FGSM </option>
    < option > PGD </option>
    < option > DeepFool </option>
    </select>
    < label className = { styles.checkbox } >
        <input type="checkbox" checked = { targeted } onChange = {(e) => setTargeted(e.target.checked)} /> Targeted
            </label>
{
    targeted && (
        <select value={ targetClass ?? 0 } onChange = {(e) => setTargetClass(Number(e.target.value))
} className = { styles.select } >
{
    Object.entries(labels).map(([k, v]) => (
        <option key= { k } value = { k } > { v } </option>
    ))
}
    </select>
      )}
</div>
  );
}
export default AttackControls;

