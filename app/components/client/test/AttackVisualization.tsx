import React from 'react';
import {CheckCircle2, XCircle} from 'lucide-react';
import '@mantine/charts/styles.css';
import {ParametersProps} from '@/interfaces/NNInterfaces';
import {ConfidenceData} from '@/interfaces/testInterfaces';
import ConfidenceChart from './ConfidenceChart';
import './AttackVisualization.css';

interface Prediction { adversarial: string; original: string; }

interface AttackVisualizationProps {
    confidence?: ConfidenceData;
    results?: Record<string, unknown>;
    prediction?: Prediction;
    parameters?: ParametersProps[];
}

const formatMetricLabel = (key: string) => key
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const formatMetric = (key: string, value: unknown): string => {
    if (value === null || value === undefined) return '—';
    if (typeof value !== 'number' || !Number.isFinite(value)) return String(value);
    if (key.toLowerCase().includes('rate') || key.toLowerCase().includes('percentage')) {
        return `${(value * 100).toFixed(1)}%`;
    }
    return value.toFixed(3);
};

const EmptyState = () => (
    <div className="empty-state" role="status">
        <div className="empty-state-content">
            <svg className="empty-state-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
            <p className="empty-state-text">Run an attack to see statistics and analysis</p>
        </div>
    </div>
);

const AttackParameters = ({parameters}: {parameters: ParametersProps[]}) => (
    <section className="parameters-card" aria-labelledby="attack-parameters-title">
        <div className="parameters-card-header">
            <div>
                <h3 className="card-title" id="attack-parameters-title">Attack parameters</h3>
                <p className="card-description">Values used for this execution.</p>
            </div>
            <span className="parameters-count">{parameters.length} configured</span>
        </div>
        <div className="parameters-grid">
            {parameters.map((parameter) => (
                <div className="parameter-item" key={parameter.id}>
                    <div className="parameter-item-heading">
                        <span className="parameter-name">{parameter.name || parameter.id}</span>
                        <span className="parameter-value">{String(parameter.default)}</span>
                    </div>
                    {parameter.description && <span className="parameter-description">{parameter.description}</span>}
                </div>
            ))}
        </div>
    </section>
);

const PredictionSummary = ({prediction}: {prediction: Prediction}) => {
    const succeeded = prediction.original !== prediction.adversarial;
    return (
        <section className="result-card" aria-labelledby="prediction-title">
            <div className="section-heading">
                <div>
                    <h3 className="card-title" id="prediction-title">Prediction</h3>
                </div>
                <span className={`result-badge ${succeeded ? 'result-badge-success' : 'result-badge-failure'}`}>
                    {succeeded ? <CheckCircle2 size={15} aria-hidden="true"/> : <XCircle size={15} aria-hidden="true"/>}
                    {succeeded ? 'Evasion successful' : 'Evasion unsuccessful'}
                </span>
            </div>
            <div className={`card-predictions ${succeeded ? 'evasion' : ''}`}>
                <span>Original prediction: <b>{prediction.original}</b></span>
                <span>Adversarial prediction: <b>{prediction.adversarial}</b></span>
            </div>
        </section>
    );
};

const MetricsTable = ({results}: {results: Record<string, unknown>}) => {
    const metrics = Object.entries(results);
    return (
        <section className="statistics_container" aria-labelledby="statistics-title">
            <div>
                <h3 className="card-title" id="statistics-title">Statistics</h3>
                <p className="card-description">Metrics computed for the executed attack.</p>
            </div>
            {metrics.length === 0 ? <p className="section-empty">No metrics were returned.</p> : (
                <div className="table-wrapper">
                    <table className="metric_table">
                        <caption className="table_caption">Computed metrics</caption>
                        <thead><tr><th scope="col">Metric</th><th scope="col">Value</th></tr></thead>
                        <tbody>
                        {metrics.map(([key, value]) => (
                            <tr key={key}><th scope="row">{formatMetricLabel(key)}</th><td>{formatMetric(key, value)}</td></tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
};

export const AttackVisualization: React.FC<AttackVisualizationProps> = ({confidence, results, prediction, parameters}) => {
    if (!prediction && !results && !confidence && !parameters?.length) return <EmptyState/>;
    return (
        <div className="statistics-container">
            {parameters?.length ? <AttackParameters parameters={parameters}/> : null}
            {prediction ? <PredictionSummary prediction={prediction}/> : null}
            {results ? <MetricsTable results={results}/> : null}
            {confidence ? <ConfidenceChart confidence={confidence}/> : null}
        </div>
    );
};
