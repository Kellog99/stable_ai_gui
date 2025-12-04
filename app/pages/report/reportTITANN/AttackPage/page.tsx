'use client';
import React, { useEffect, useState } from 'react'
import useNNTrustStore from '@/store/nnTrustStore';
import { attacksProps } from '@/interfaces/reportInterfaces';
import './AttackPageStyle.css';
import { useSearchParams } from 'next/navigation';

const AttackPage = () => {
    const searchParams = useSearchParams();
    const atkId = searchParams.get('atkId');
    console.log("atkId = ", atkId)

    const { attackReport } = useNNTrustStore();
    const [attack, setAttack] = useState<attacksProps | null>(null);
    const [usedParams, setUsedParams] = useState<any>(null)

    const {
        selectedAttacks,
    } = useNNTrustStore();

    //console.log("ATTACK!",selectedAttacks[atkId?.toLowerCase()])
    // Wait for router to be ready and initialize attackReport
    useEffect(() => {
        if (attackReport && atkId) {
            setAttack(attackReport.attacks[atkId]);
            setUsedParams(selectedAttacks[atkId?.toLowerCase()].parameters)
        }
    }, [atkId, attackReport]);

    // Show loading state while router or data is not ready
    if (!atkId || !attackReport || !attack) {
        return <div>Loading...</div>;
    }

    console.log("attackReport", attack);

    const attackMetrics = Object.keys(attackReport).filter(
        item => !["name", "risk", "confusionmatrix"].includes(item)
    );

    console.log(attackMetrics);

    return (
        <div className="dashboard">
            <div className="container">
                <div className="header">
                    <h1>Performance of {attack.name} </h1>
                    <p>Comprehensive metrics overview</p>
                </div>
                <div className="metrics-container">
                    {Object.entries(attack).map(([metric, value]) => {
                        if (!["name", "id", "confusion_matrix", "risk", "num_queries", "power"].includes(metric)) {
                            return (
                                <div className='metric-container'>
                                    <p className='metric-title'>{metric}:</p>
                                    <p className='metric-value'>{
                                        ["imagemean", "imagevariance"].includes(metric) ?
                                            value :
                                            value.toFixed(2)}</p>
                                </div>
                            );
                        }
                        return null;
                    })}
                </div>

            </div>
            <div className="container">
                <div className="header">
                    <h1>  </h1>
                    <p>Parameters used</p>
                </div>
                <div className="metrics-container">
                    {usedParams.map((param) => (
                        <div className='metric-container'>
                            <p className='metric-title'>{param.id}:</p>
                            <p className='metric-value'>{param.default.toFixed(4)}</p>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default AttackPage;