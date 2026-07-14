import React, { useMemo, useState, useCallback } from 'react';
import { BenchmarkDataProps, metricsProps } from '@/interfaces/reportInterfaces';
import {
    Chart as ChartJS,
    ScatterController,
    PointElement,
    LinearScale,
    Title,
    Tooltip,
    Legend,
    LineElement,
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import annotationPlugin from 'chartjs-plugin-annotation';
import { Trophy } from 'lucide-react';
import './BenchmarkTable.css';

ChartJS.register(
    annotationPlugin,
    ScatterController,
    PointElement,
    LineElement,
    LinearScale,
    Title,
    Tooltip,
    Legend
);

interface BenchmarkTableProps {
    modelName?: string;
    benchmark: BenchmarkDataProps[];
    data: metricsProps;
}

const EXCLUDED_KEYS = new Set(['params', 'name', 'confusion_matrix', 'total benchmarks']);

const getMetricValue = (data: metricsProps, key: string): number => {
    const value = data[key as keyof metricsProps];
    return typeof value === 'number' ? value : 0;
};

const BenchmarkTable: React.FC<BenchmarkTableProps> = ({ modelName, benchmark, data }) => {
    const availableBenchmarkingMetrics = useMemo(
        () =>
            Object.keys(data).filter(
                (key) => !EXCLUDED_KEYS.has(key) && !key.endsWith('_rank')
            ),
        [data]
    );

    // Lazy init avoids the extra "empty" render + effect that used to set this
    const [selectedBenchmark, setSelectedBenchmark] = useState<string>(
        () => availableBenchmarkingMetrics[0] ?? ''
    );

    // Guard: if the metric list changes (new `data`) and current selection
    // is no longer valid, fall back to the first available one.
    const activeBenchmark =
        availableBenchmarkingMetrics.includes(selectedBenchmark)
            ? selectedBenchmark
            : availableBenchmarkingMetrics[0] ?? '';

    const handleSelectBenchmark = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedBenchmark(e.target.value);
    }, []);

    // Single derivation pass instead of 3 states + an effect
    const { sortedData, chartBenchmarkData, chartValueData } = useMemo(() => {
        if (!activeBenchmark) {
            return { sortedData: [] as [string, number][], chartBenchmarkData: [] as { params: unknown; value: number }[], chartValueData: [] as { params: unknown; value: number }[] };
        }

        const benchmarkValues = benchmark.map((b) => b.metrics[activeBenchmark] ?? 0);
        const testedValue = getMetricValue(data, activeBenchmark);
        const hasTestedPoint = data.params !== undefined;

        const benchmarkPoints = benchmark
            .map((b, i) => ({ params: b.param, value: benchmarkValues[i] }))
            // drop the point that duplicates the tested model, if present
            .filter((entry) => !(hasTestedPoint && entry.params === data.params && entry.value === testedValue));

        const testedPoints = hasTestedPoint
            ? [{ params: data.params, value: testedValue }]
            : [];

        const combined: [string, number][] = benchmark.map((b, i) => [b.name, benchmarkValues[i]]);
        combined.sort((a, b) => b[1] - a[1]);

        return { sortedData: combined, chartBenchmarkData: benchmarkPoints, chartValueData: testedPoints };
    }, [activeBenchmark, benchmark, data]);

    const chartData = useMemo(
        () => ({
            datasets: [
                {
                    label: 'Benchmark Element',
                    data: chartBenchmarkData.map((d) => ({ x: d.params, y: d.value })),
                    backgroundColor: 'rgba(59, 130, 246, 0.7)',
                },
                {
                    label: modelName || 'Tested Model',
                    data: chartValueData.map((d) => ({ x: d.params, y: d.value })),
                    backgroundColor: 'rgba(239, 68, 68, 0.7)',
                },
            ],
        }),
        [chartBenchmarkData, chartValueData, modelName]
    );

    const referenceY = activeBenchmark ? getMetricValue(data, activeBenchmark) : undefined;
    const referenceLabel = modelName || 'Tested Model';

    const options = useMemo(
        () => ({
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top' as const },
                annotation: {
                    annotations: referenceY !== undefined
                        ? {
                              referenceLine: {
                                  type: 'line' as const,
                                  yMin: referenceY,
                                  yMax: referenceY,
                                  borderColor: 'rgba(239, 68, 68, 0.8)',
                                  borderWidth: 1,
                                  label: {
                                      display: true,
                                      content: referenceLabel,
                                      position: 'start' as const,
                                      color: 'rgba(239, 68, 68, 0.8)',
                                      backgroundColor: 'transparent',
                                      yAdjust: -10,
                                  },
                              },
                          }
                        : {},
                },
                tooltip: {
                    callbacks: {
                        title: () => '',
                        label: (context: any) => {
                            const point = context.raw;
                            return [
                                `Group: ${context.dataset.label ?? ''}`,
                                `Params: ${point.x}`,
                                `Value: ${point.y.toFixed(2)}`,
                            ];
                        },
                    },
                },
            },
            scales: {
                x: { title: { display: true, text: 'params' }, type: 'linear' as const, position: 'bottom' as const },
                y: { title: { display: true, text: activeBenchmark } },
            },
        }),
        [referenceY, referenceLabel, activeBenchmark]
    );

    return (
        <div className="benchmark-controls">
            <select value={activeBenchmark} onChange={handleSelectBenchmark} className="benchmark-select">
                {availableBenchmarkingMetrics.map((key) => (
                    <option key={key} value={key}>
                        {key}
                    </option>
                ))}
            </select>

            <div className="results-grid">
                <div style={{ width: '100%', height: 400 }}>
                    <Scatter data={chartData} options={options as any} />
                </div>

                <div className="leaderboard">
                    <div className="leaderboard-title">
                        <Trophy size={20} color="yellow" />
                        <p>
                            Leaderboard:{' '}
                            {activeBenchmark.charAt(0).toUpperCase() + activeBenchmark.slice(1).replace(/_/g, ' ')}
                        </p>
                    </div>
                    <div className="table-container">
                        <table className="entries-table">
                            <thead>
                                <tr>
                                    <th>Rank</th>
                                    <th>Name</th>
                                    <th>Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedData.map(([name, value], index) => (
                                    <tr key={`${name}-${index}`} className={name === modelName ? 'highlighted' : ''}>
                                        <td className="rank-cell">
                                            <div className="rank-circle">{index + 1}</div>
                                        </td>
                                        <td>{name}</td>
                                        <td style={{ textAlign: 'right' }}>{value.toFixed(3)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(BenchmarkTable);