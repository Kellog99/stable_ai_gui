import {Boxes, Workflow} from 'lucide-react';
import {sanitizePath} from '@/functionalities/report_utils';
import './InfoTable.css';
import {ModelInfo} from "@/interfaces/homePageInterface";

interface InfoTableProps {
    info: ModelInfo;
}

const LABELS: Record<string, string> = {
    num_classes: 'Classes',
    num_samples: 'Samples',
    input_dimensionality: 'Input shape',
    model_type: 'Framework',
    source_path: 'Source',
    repository: 'Source',
    weights: 'File size',
    std: 'Std. dev.',
    size: 'Resize',
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
    value !== null && typeof value === 'object' && !Array.isArray(value);

const formatLabel = (key: string): string => LABELS[key] ?? key
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .split('_')
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

const formatCompactNumber = (value: number): string => {
    if (Math.abs(value) >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(2)}B`;
    if (Math.abs(value) >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`;
    if (Math.abs(value) >= 1_000) return new Intl.NumberFormat().format(value);
    return String(value);
};

const formatDetailValue = (key: string, value: unknown): string => {
    if (value === null || value === undefined || value === '') return 'N/A';
    if (Array.isArray(value)) return value.join(' × ');

    if (typeof value === 'number') {
        if (key === 'parameters') return formatCompactNumber(value);
        return new Intl.NumberFormat().format(value);
    }

    if (typeof value === 'string') {
        if (['repository', 'source_path', 'path'].includes(key)) return sanitizePath(value);
        if (key === 'date') {
            const date = new Date(value);
            if (!Number.isNaN(date.getTime())) {
                return new Intl.DateTimeFormat('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                }).format(date);
            }
        }
        return value;
    }

    return JSON.stringify(value);
};

const InfoTable = ({info}: InfoTableProps) => {
    const transformation = isRecord(info.transformation) ? info.transformation : null;
    const detailEntries = Object.entries(info).filter(
        ([key]) => !['id', 'image', 'transformation'].includes(key)
    );

    return (
        <section className="info_table__section" aria-labelledby="model-information-title">
            <div className="info_table__heading">
                <Boxes size={32}/>
                <h2 id="model-information-title">Model information</h2>
            </div>

            <div className="info_table__content">
                <dl className="info_table__grid">
                    {detailEntries.map(([key, value]) => (
                        <div key={key}>
                            <dt>{formatLabel(key)}</dt>
                            <dd className={['repository', 'source_path', 'path'].includes(key)
                                ? 'info_table__path_value'
                                : undefined}
                            >
                                {formatDetailValue(key, value)}
                            </dd>
                        </div>
                    ))}
                </dl>

                {transformation && (
                    <section className="info_table__preprocessing" aria-labelledby="preprocessing-title">
                        <div className="info_table__preprocessing_title">
                            <Workflow size={20}/>
                            <h3 id="preprocessing-title">Input preprocessing</h3>
                        </div>
                        <dl>
                            {Object.entries(transformation).map(([key, value]) => (
                                <div key={key}>
                                    <dt>{formatLabel(key)}</dt>
                                    <dd>{formatDetailValue(key, value)}</dd>
                                </div>
                            ))}
                        </dl>
                    </section>
                )}
            </div>
        </section>
    );
};

export default InfoTable;
