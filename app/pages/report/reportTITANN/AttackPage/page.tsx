'use client';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import useNNTrustStore from '@/store/nnTrustStore';
import { ReportAttackProps } from '@/interfaces/reportInterfaces';
import './AttackPageStyle.css';
import { ParametersProps } from '@/interfaces/NNInterfaces';
import { ChevronLeft } from 'lucide-react';

const HIDDEN_METRIC_KEYS = new Set([
    'name',
    'id',
    'confusion_matrix',
    'risk',
    'num_queries',
    'power',
]);

const RAW_STRING_METRICS = new Set(['imagemean', 'imagevariance']);

function formatMetricValue(value: unknown): string {
    if (typeof value === 'number' && Number.isFinite(value)) {
        return value.toFixed(2);
    }
    if (value === null || value === undefined) return '—';
    return String(value);
}

const AttackPage = () => {
    const searchParams = useSearchParams();
    const atkId = searchParams.get('atkId');

    const {
        modelReport,
        selectedAttacks
    } = useNNTrustStore();

    const [attack, setAttack] = useState<ReportAttackProps | null>(null);
    const [usedParams, setUsedParams] = useState<ParametersProps[] | null>(null);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        if (!modelReport || !atkId) return;

        const matchedAttack = modelReport.attacks?.[atkId];

        if (!matchedAttack) {
            setNotFound(true);
            return;
        }

        setNotFound(false);
        setAttack(matchedAttack);
        setUsedParams(modelReport.attacks[atkId].parameters);
    }, [atkId, modelReport, selectedAttacks]);

    // ################### METRICS ###################
    const metricEntries = useMemo(() => {
        if (!attack) return [];
        return Object.entries(attack.metrics)
            .filter(([key]) => key !== "confusion_matrix")
            .map(([key, value]) => {
                const transformedKey = key
                    .split("_")
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ");

                return [transformedKey, value];
            });
    }, [attack]);
    // ##############################################



    if (!atkId) {
        return <div className="dashboard-message">No attack selected.</div>;
    }

    if (notFound) {
        return <div className="dashboard-message">No data found for attack "{atkId}".</div>;
    }

    if (!modelReport || !attack) {
        return <div className="dashboard-message">Loading...</div>;
    }

    return (
        <div className="dashboard">
            <button
                className='go_back'
                onClick={() => { }}
            >
                <ChevronLeft size={20} />
            </button>
            <div className="container">
                <div className="header">
                    <h1>Performance of {attack.name}</h1>
                    <p>Comprehensive metrics overview</p>
                </div>
                <div className="metrics-container">
                    {metricEntries.map(([metric, value]) => (
                        <div className="metric-container" key={metric}>
                            <p className="metric-title">{metric}:</p>
                            <p className="metric-value">
                                {RAW_STRING_METRICS.has(metric) ? String(value) : formatMetricValue(value)}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {usedParams && usedParams.length > 0 && (
                <div className="container">
                    <div className="header">
                        <p>Parameters used</p>
                    </div>
                    <div className="metrics-container">
                        {usedParams.map((param) => (
                            <div className="metric-container" key={param.id}>
                                <p className="metric-title">{param.id}:</p>
                                <p className="metric-value">{formatMetricValue(param.default)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AttackPage;