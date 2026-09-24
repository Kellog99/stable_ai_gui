'use client';
import {useRouter, useSearchParams} from 'next/navigation';
import useNNTrustStore from '@/store/nnTrustStore';
import './AttackPageStyle.css';
import {ArrowLeft, ChartNoAxesCombined, SlidersHorizontal} from 'lucide-react';
import MetricsCard, {MetricCardItem} from '@/components/client/report/MetricsCard';
import {ParametersProps} from "@/interfaces/NNInterfaces";
import {Suspense} from 'react';

const HIDDEN_METRIC_KEYS = new Set([
    'name',
    'id',
    'confusion_matrix',
    'risk',
    'num_queries',
    'power',
]);

const AttackPageContent = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const atkId: string | null = searchParams.get('atkId');
    const {modelReport} = useNNTrustStore();


    const attack = atkId ? modelReport?.attacks?.[atkId] : null;
    const usedParams = attack?.parameters ?? [];
    const metricCards: MetricCardItem[] = Object.entries(attack?.metrics ?? {})
        .filter(([key, value]) => value != null && !HIDDEN_METRIC_KEYS.has(key))
        .map(([key, value]) => ({
            key,
            label: key
                .split('_')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' '),
            value,
        }));

    if (!atkId) {
        return <div className="dashboard-message">No attack selected.</div>;
    } else if (!modelReport) {
        return <div className="dashboard-message">Loading...</div>;
    } else if (!attack) {
        return <div className="dashboard-message">No data found for attack &quot;{atkId}&quot;.</div>;
    }

    return (
        <main className="attack-dashboard">
            <button
                className='attack-back-button'
                onClick={() => router.back()}
                aria-label="Back to security report"
            >
                <ArrowLeft size={18}/>
                <span>Back to report</span>
            </button>
            <section className="attack-hero">
                <div className="attack-hero-icon"><ChartNoAxesCombined size={24}/></div>
                <div>
                    <span className="attack-eyebrow">Attack analysis</span>
                    <h1>{attack.name.toUpperCase()} performance</h1>
                    <p>Comprehensive metrics overview</p>
                </div>
            </section>

            <section className="attack-section" aria-labelledby="attack-metrics-title">
                <div className="attack-section-heading">
                    <h2 id="attack-metrics-title">Measured performance</h2>
                    <span>{metricCards.length} metrics</span>
                </div>
                <MetricsCard items={metricCards}/>
            </section>

            {usedParams.length > 0 && (
                <section className="attack-section attack-parameters" aria-labelledby="attack-parameters-title">
                    <div className="attack-section-heading">
                        <div className="attack-parameters-title">
                            <SlidersHorizontal size={18}/>
                            <h2 id="attack-parameters-title">Parameters used</h2>
                        </div>
                        <span>{usedParams.length} configured</span>
                    </div>
                    <MetricsCard items={
                        usedParams.map((param: ParametersProps) => ({
                            key: param.id,
                            label: param.name || param.id,
                            description: param.description,
                            value: ('value' in param ? param.value : undefined) ?? param.default,
                        }))}/>
                </section>
            )}
        </main>
    );
};

const AttackPage = () => (
    <Suspense fallback={<div className="dashboard-message">Loading...</div>}>
        <AttackPageContent/>
    </Suspense>
);

export default AttackPage;
