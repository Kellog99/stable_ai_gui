'use client';
import React, { useEffect, useState } from 'react'
import useNNTrustStore from '@/store/nnTrustStore';
import { attacksProps, metricsProps } from '@/interfaces/reportInterfaces';
import { Target, Zap, GitBranch, LucideIcon, TreePine } from 'lucide-react';
import './AttackPageStyle.css';

interface MatricCardProps {
    title: string,
    value?: number,
    Icon: LucideIcon,
    color: string
}
const MetricCard: React.FC<MatricCardProps> = ({
    title,
    value,
    Icon,
    color
}) => (
    <div className="metric-card" style={{ borderLeftColor: color }}>
        <div className="metric-card-content">
            <div>
                <p className="metric-title">{title}</p>
                <p className="metric-value" style={{ color }}>{value}</p>
            </div>
            <Icon className="metric-icon" style={{ color }} />
        </div>
    </div>
);

const ConfusionMatrix: React.FC<{ matrix: number[][] }> = ({ matrix }) => {
    if (!matrix || matrix.length === 0) return null;
    const maxValue = Math.max(...matrix.flat());

    return (
        <div className="confusion-matrix-container">
            <h3 className="confusion-matrix-title">Confusion Matrix</h3>
            <div className="confusion-matrix-wrapper">
                <div className="confusion-matrix-grid" style={{ gridTemplateColumns: `repeat(${matrix[0].length}, minmax(60px, 1fr))` }}>
                    {matrix.map((row, i) => (
                        row.map((value, j) => {
                            const intensity = maxValue > 0 ? value / maxValue : 0;
                            const bgColor = `rgba(59, 130, 246, ${0.1 + intensity * 0.8})`;
                            return (
                                <div
                                    key={`${i}-${j}`}
                                    className="matrix-cell"
                                    style={{ backgroundColor: bgColor }}
                                >
                                    {value}
                                </div>
                            );
                        })
                    ))}
                </div>
                <div className="matrix-labels">
                    <span>Predicted</span>
                    <span>Actual</span>
                </div>
            </div>
        </div>
    );
};

const page = () => {
    const { vulnerabilitySelected, report } = useNNTrustStore()
    const [attackReport, setAttackReport] = useState<attacksProps>(report!.attacks[vulnerabilitySelected!])

    useEffect(() => {
        setAttackReport(report!.attacks[vulnerabilitySelected!])
    }, [vulnerabilitySelected, report])

    console.log("attack = ", attackReport)

    const attackMetrics = Object.keys(attackReport).filter(item => !["name", "risk", "confusion_matrix"].includes(item))
    console.log(attackMetrics)

    const metricCardList: MatricCardProps[] = [
        {
            title: "Accuracy",
            value: attackReport.accuracy,
            Icon: Target,
            color: "#10b981"
        },
        {
            title: "Precision",
            value: attackReport.precision,
            Icon: Zap,
            color: "#f59e0b"
        },
        {
            title: "f1score",
            value: attackReport.f1score,
            Icon: GitBranch,
            color: "#8b5cf6"
        },
        {
            title: "robustness",
            value: attackReport.robustness,
            Icon: TreePine,
            color: "#8b5cf6"
        }
    ]
    return (
        <div className="dashboard">
            <div className="container">
                <div className="header">
                    <h1>Model Performance</h1>
                    <p>Comprehensive metrics overview</p>
                </div>

                <div className="metrics-grid">
                    {
                        metricCardList.map((metric) => <div>
                            <MetricCard {...metric} />
                        </div>)
                    }
                </div>
            </div>

            {attackReport.confusion_matrix &&
                <ConfusionMatrix matrix={attackReport.confusion_matrix} />}
        </div>
    )
}

export default page