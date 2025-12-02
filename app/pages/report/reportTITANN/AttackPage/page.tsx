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


    // Wait for router to be ready and initialize attackReport
    useEffect(() => {
        if (attackReport && atkId) {
            setAttack(attackReport.attacks[atkId]);

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
                        if (!["name", "id", "confusion_matrix"].includes(metric) && value) {
                            return (
                                <div className='metric-container'>
                                    <p className='metric-title'>{metric}:</p>
                                    <p className='metric-value'>{value.toFixed(3)}</p>
                                </div>
                            );
                        }
                        return null;
                    })}
                </div>

            </div>
        </div>
    );
};

export default AttackPage;