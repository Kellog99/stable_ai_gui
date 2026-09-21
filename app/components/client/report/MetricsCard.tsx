import {BarChart} from '@mantine/charts';
import React, {useMemo} from 'react';
import './ModelMetrics.css';

export interface MetricCardItem {
    key: string;
    label: string;
    value: unknown;
    description?: string;
}

interface ClassMetricDatum {
    classIndex: string;
    value: number;
}

type ChartItem = MetricCardItem & { data: ClassMetricDatum[] };

const isClassMetric = (key: string) => /class/i.test(key);

// Object.entries copre sia array che oggetti.
function getClassMetricData(key: string, value: unknown): ClassMetricDatum[] {
    if (!isClassMetric(key) || value === null || typeof value !== 'object') return [];
    return Object.entries(value)
        .map(([classIndex, v]) => ({classIndex, value: v}))
        .filter((d): d is ClassMetricDatum => typeof d.value === 'number' && Number.isFinite(d.value));
}

const formatMetricValue = (value: unknown) =>
    typeof value === 'number' ? value.toFixed(2) : String(value ?? '—');

const Card: React.FC<{
    label: string;
    description?: string;
    chart?: boolean;
    children: React.ReactNode;
}> = (
    {
        label,
        description,
        chart,
        children
    }
) => (
    <article className={`metrics-card${chart ? ' metrics-card--chart' : ''}`}>
        <p className="metrics-card__label">
            {label}
            {description && <p className="metrics-card__description">{description}</p>}
        </p>
        {children}
    </article>
);

const ChartCard: React.FC<ChartItem> = (
    {
        label,
        description,
        data
    }
) => (
    <Card
        label={label}
        description={description}
        chart>
        <div
            className="metrics-card__chart"
            role="img"
            aria-label={`${label}: values by class`}>

            <BarChart
                h="100%"
                data={data}
                dataKey="classIndex"
                series={[{name: 'value', color: 'cyan.5'}]}
                xAxisLabel="Classes"
                yAxisLabel="Value"
                withLegend={false}
            />
        </div>
    </Card>
);

const ValueCard: React.FC<MetricCardItem> = (
    {
        label,
        description,
        value
    }
) => (
    <Card label={label} description={description}>
        {Array.isArray(value) && value.every(v => typeof v === 'number') ? (
            <div className="metrics-card__values">
                {value.map((v, i) => <span key={i}>{formatMetricValue(v)}</span>)}
            </div>
        ) : (
            <p className="metrics-card__value">{formatMetricValue(value)}</p>
        )}
    </Card>
);

const MetricsCard: React.FC<{ items: MetricCardItem[] }> = ({items}) => {
    if (items.length === 0) return <p className="model-metrics__empty-state">No metrics computed.</p>;

    const {values, charts} = useMemo(() => {
        const values: MetricCardItem[] = [];
        const charts: ChartItem[] = [];
        for (const item of items) {
            const data = getClassMetricData(item.key, item.value);
            if (data.length) charts.push({...item, data});
            else values.push(item);
        }
        return {values, charts};
    }, [items]);


    return (
        <div className="metrics-cards-grid">
            {values.map(item => <ValueCard {...item}/>)}
            {charts.map(item => <ChartCard {...item}/>)}
        </div>
    );
};

export default MetricsCard;