// ---------------- components/SimpleLineChart.tsx ----------------
import React from "react";
import styles from "@/styles/AttackTester.module.css";

function SimpleLineChart({ data }: { data: number[] }) {
  const width = 300, height = 100;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={styles.chart}>
      <polyline fill="none" stroke="#2563eb" strokeWidth={2} points={data.map((d, i) => `${i * 10},${height - d * 100}`).join(" ")} />
    </svg>
  );
}
export default SimpleLineChart;
