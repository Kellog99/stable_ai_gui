'use client';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import useNNTrustStore from '@/store/nnTrustStore';
import { ReportAttackProps } from '@/interfaces/reportInterfaces';
import './AttackPageStyle.css';
import { ParametersProps } from '@/interfaces/NNInterfaces';
import { ArrowLeft, ChartNoAxesCombined, SlidersHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';

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

const AttackPageContent = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
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
            .filter(([key]) => !HIDDEN_METRIC_KEYS.has(key))
            .map(([key, value]) => {
                const transformedKey = key
                    .split("_")
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ");

                return { key, label: transformedKey, value };
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
        <main className="attack-dashboard">
            <button
                className='attack-back-button'
                onClick={() => router.back()}
                aria-label="Back to security report"
            >
                <ArrowLeft size={18} />
                <span>Back to report</span>
            </button>
            <section className="attack-hero">
                <div className="attack-hero-icon"><ChartNoAxesCombined size={24} /></div>
                <div>
                    <span className="attack-eyebrow">Attack analysis</span>
                    <h1>Performance of {attack.name}</h1>
                    <p>Comprehensive metrics overview</p>
                </div>
            </section>

            <section className="attack-section" aria-labelledby="attack-metrics-title">
                <div className="attack-section-heading">
                    <h2 id="attack-metrics-title">Measured performance</h2>
                    <span>{metricEntries.length} metrics</span>
                </div>
                <div className="attack-metrics-grid">
                    {metricEntries.map(({ key, label, value }) => (
                        <article className="attack-metric-card" key={key}>
                            <p className="attack-metric-label">{label}</p>
                            <p className="metric-value">
                                {RAW_STRING_METRICS.has(key) ? String(value) : formatMetricValue(value)}
                            </p>
                        </article>
                    ))}
                </div>
            </section>

            {usedParams && usedParams.length > 0 && (
                <section className="attack-section attack-parameters" aria-labelledby="attack-parameters-title">
                    <div className="attack-section-heading">
                        <div className="attack-parameters-title">
                            <SlidersHorizontal size={18} />
                            <h2 id="attack-parameters-title">Parameters used</h2>
                        </div>
                        <span>{usedParams.length} configured</span>
                    </div>
                    <div className="attack-metrics-grid">
                        {usedParams.map((param) => (
                            <article className="attack-metric-card" key={param.id}>
                                <p className="attack-metric-label">{param.id}</p>
                                <p className="metric-value">{formatMetricValue(param.default)}</p>
                            </article>
                        ))}
                    </div>
                </section>
            )}
        </main>
    );
};

const AttackPage = () => (
    <Suspense fallback={<div className="dashboard-message">Loading...</div>}>
        <AttackPageContent />
    </Suspense>
);

export default AttackPage;
