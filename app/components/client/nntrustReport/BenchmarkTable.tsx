import React, { useMemo, useState, useCallback } from 'react';
import { BenchmarkDataProps, MetricsProps } from '@/interfaces/reportInterfaces';

import { Trophy } from 'lucide-react';
import './BenchmarkTable.css';
import { Table, TableData } from '@mantine/core';
import { ScatterChart } from '@mantine/charts';


export const formatMetricLabel = (key: string): string => key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');

export const getMetricValue = (data: MetricsProps, key: string): number | undefined => {
    const value = data[key as keyof MetricsProps];
    return typeof value === 'number' ? value : undefined;
};

interface BenchmarkTableProps {
    modelName?: string;
    benchmark: BenchmarkDataProps[];
    data: MetricsProps;
}

const EXCLUDED_KEYS = new Set(['params', 'name', 'confusion_matrix', 'total benchmarks']);

const BenchmarkTable: React.FC<BenchmarkTableProps> = ({
    modelName,
    benchmark,
    data
}) => {
    // These are all the metrics that have been computed for the selected model
    const availableBenchmarkingMetrics: string[] = useMemo(
        () =>
            Object.keys(data).filter(
                (key) => !EXCLUDED_KEYS.has(key) && !key.endsWith('_rank')
            ),
        [data]
    );

    const [selectedMetric, setSelectedMetric] = useState<keyof MetricsProps>(availableBenchmarkingMetrics[0] as keyof MetricsProps);


    const sortedData = useMemo(() => {
        if (!selectedMetric) {
            return [];
        }

        const scored = benchmark
            .map((b: BenchmarkDataProps) => ({
                name: b.name,
                params: b.param,
                value: getMetricValue(b.metrics, selectedMetric)
            }))
            .filter((entry): entry is {
                name: string;
                params: number;
                value: number
            } => entry.value !== undefined);

        const sortedData: { name: string; params: number; value: number }[] = scored
            .sort((a, b) => b.value - a.value);

        return sortedData
    },
        [selectedMetric, benchmark, data, modelName]
    );

    const scatterData: { params: number, metric: number }[] = useMemo(() => {
        return benchmark.filter((value: BenchmarkDataProps) => typeof value.metrics[selectedMetric] === "number")
            .map((value: BenchmarkDataProps) => ({
                params: value.param,
                metric: value.metrics[selectedMetric] as number,
            }))
    }, [benchmark, selectedMetric])

    const tableData: TableData = {
        head: ['Rank', 'Model', 'Value'],
        body: sortedData.map((data, index) => [index + 1, data.name, data.value.toFixed(3)]),
    };

    return (
        <div className="benchmark-controls">
            <div className='benchmark_header'>
                <p style={{ margin: "0px" }}>Metric selected:</p>
                <select
                    id="benchmark-metric-select"
                    value={selectedMetric}
                    onChange={(e) => setSelectedMetric(e.target.value as keyof MetricsProps)}
                    className="benchmark-select"
                >
                    {availableBenchmarkingMetrics.map((key) => (
                        <option key={key} value={key}>
                            {formatMetricLabel(key)}
                        </option>
                    ))}
                </select>
            </div>

            <div className="results-grid">
                <div className="chart-container">
                    <ScatterChart
                        h={"100%"}
                        data={[
                            {
                                name: modelName ?? 'Models',
                                color: 'blue.5',
                                data: scatterData,
                            },
                        ]}
                        xAxisLabel='Parameters'
                        yAxisLabel='Value'
                        yAxisProps={{ domain: [0, 1] }}
                        dataKey={{ x: 'params', y: 'metric' }}
                        referenceLines={[
                            {
                                y: data[selectedMetric as keyof MetricsProps] as number,
                                label: 'Reference',
                                color: 'red.7'
                            },
                        ]}
                    />
                </div>

                <div className="leaderboard">
                    <div className="leaderboard-title">
                        <Trophy size={20} color="yellow" />
                        <p>
                            Leaderboard:{" "}
                            {selectedMetric ? formatMetricLabel(selectedMetric) : "—"}
                        </p>
                    </div>

                    <Table data={tableData} />
                </div>
            </div>
        </div>
    );
};

export default React.memo(BenchmarkTable);