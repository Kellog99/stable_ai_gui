import React, { useEffect, useState, useMemo } from 'react';
import { BenchmarkDataProps, metricsProps } from '@/interfaces/reportInterfaces';
import { ScatterChart } from '@mantine/charts';
import { Trophy } from 'lucide-react';
import './BenchmarkTable.css';

interface BenchmarkTableProps {
    modelName?: string;                                    // name of the tested model
    benchmark: { [key: string]: BenchmarkDataProps };     // stored benchmarks from previous models
    data: metricsProps;                                   // metrics result from the benchmark
}

const BenchmarkTable: React.FC<BenchmarkTableProps> = ({
    modelName,
    benchmark,
    data
}) => {
    // These are the metrics that were used during the evaluation of this model.
    const availableBenchmarkingMetrics = useMemo(() =>
        Object.keys(data).filter((key) => !["params", "name", "confusion_matrix"].includes(key)),
        [data]
    );

    const [benchmarkData, setBenchmarkData] = useState<Array<{
        name: string;
        param: number;
        task: string;
        metrics: { [key: string]: number };
    }>>([]);

    useEffect(() => {
        const out = Object.entries(benchmark).map(([id, benchmarkProps]) => ({
            name: benchmarkProps.name,
            param: benchmarkProps.param,
            task: benchmarkProps.task,
            metrics: availableBenchmarkingMetrics.reduce((acc, metricKey) => {
                if (benchmarkProps.metrics[metricKey] !== undefined) {
                    acc[metricKey] = benchmarkProps.metrics[metricKey];
                }
                return acc;
            }, {} as { [key: string]: number })
        }));

        setBenchmarkData(out);
    }, [benchmark, availableBenchmarkingMetrics]);

    console.log("benchmarkData = ", benchmarkData);

    const [selectedBenchmark, setSelectedBenchmark] = useState<string>("");

    useEffect(() => {
        if (availableBenchmarkingMetrics.length > 0) {
            setSelectedBenchmark(availableBenchmarkingMetrics[0]);
        }
    }, [availableBenchmarkingMetrics]);

    // Sort data by value, descending
    const [sortedData, setSortedData] = useState<[string, number][]>([]);
    const [chartBenchmarkData, setChartBenchmarkData] = useState<{ [key: string]: number }[]>([]);
    const [chartValueData, setChartValueData] = useState<{ [key: string]: number }[]>([]);

    useEffect(() => {
        if (!selectedBenchmark) return;

        // Flatten and filter to ensure we only have numbers
        const flattenValue = (val: any): number[] => {
            if (val === undefined || val === null) return [];
            if (typeof val === 'number') return [val];
            if (Array.isArray(val)) {
                return val.flatMap(item => flattenValue(item));
            }
            return [];
        };

        // Extract benchmark values for the selected metric
        const benchmarkEntries = Object.entries(benchmark);
        const benchmarkValues = benchmarkEntries.map(([id, benchmarkProp]) =>
            benchmarkProp.metrics[selectedBenchmark] ?? 0
        );

        const dataValue = flattenValue(data[selectedBenchmark as keyof metricsProps]);

        // Create chart data for benchmark points
        if (benchmarkValues.length > 0) {
            const benchmarkChartData = benchmarkEntries.map(([id, benchmarkProp], index) => ({
                "params": benchmarkProp.param,
                [selectedBenchmark]: benchmarkValues[index],
            }));

            setChartBenchmarkData(benchmarkChartData);
        } else {
            setChartBenchmarkData([]);
        }

        // Create chart data for the tested model value
        if (dataValue.length > 0 && data.params !== undefined) {
            setChartValueData([{
                "params": data.params,
                [selectedBenchmark]: dataValue[0],
            }]);
        } else {
            setChartValueData([]);
        }

        // Combine into [name, value] tuples and sort by value descending
        const combined: [string, number][] = [];

        // Add benchmark values with their names
        benchmarkEntries.forEach(([id, benchmarkProp], index) => {
            combined.push([benchmarkProp.name, benchmarkValues[index]]);
        });

        // Add the tested model value
        if (dataValue.length > 0) {
            combined.push([modelName || 'Target Model', dataValue[0]]);
        }

        // Sort by value (descending)
        combined.sort((a, b) => b[1] - a[1]);
        setSortedData(combined);
    }, [selectedBenchmark, benchmark, data, modelName]);

    // Chart data
    const chartData = [
        {
            color: 'blue.5',
            name: 'Benchmark Elements',
            data: chartBenchmarkData
        },
        {
            color: 'red.5',
            name: 'Tested Model',
            data: chartValueData
        },
    ];

    const isHighlighted = (value: number) => {
        const testedValue = data[selectedBenchmark as keyof metricsProps];
        const flatValue = typeof testedValue === 'number' ? testedValue :
            Array.isArray(testedValue) ? testedValue[0] : null;
        return value === flatValue ? "row highlighted" : "row";
    };

    console.log("sorted elements", sortedData);

    return (
        <div className="benchmark-controls">
            {/* Benchmark selector */}
            <select
                value={selectedBenchmark}
                onChange={(e) => setSelectedBenchmark(e.target.value)}
                className="benchmark-select"
            >
                {availableBenchmarkingMetrics.map((key) => (
                    <option key={key} value={key}>
                        {key}
                    </option>
                ))}
            </select>

            <div className='results-grid'>
                {/* Scatter plot */}
                <ScatterChart
                    h={350}
                    data={chartData}
                    dataKey={{ x: 'params', y: selectedBenchmark }}
                    xAxisLabel="params"
                    yAxisLabel={selectedBenchmark}
                    referenceLines={[
                        {
                            y: data[selectedBenchmark as keyof metricsProps] as number,
                            label: modelName ? modelName : 'Tested Model',
                            color: 'red.7',
                        },
                    ]}
                />

                {/* Leaderboard */}
                <div className="leaderboard">
                    <h3 className="leaderboard-title">
                        <Trophy className="icon trophy-large" />
                        Leaderboard -{' '}
                        {selectedBenchmark.charAt(0).toUpperCase() +
                            selectedBenchmark.slice(1).replace(/_/g, ' ')}
                    </h3>

                    <div className="entries">
                        {sortedData.map(([name, value], index) => (
                            <div key={index} className={isHighlighted(value)}>
                                <div className="row-left">
                                    <div className="rank-circle">{index + 1}</div>
                                    <span className="row-label">{name}</span>
                                </div>
                                <div className="row-right">
                                    <span className="row-value">
                                        {value.toFixed(3)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BenchmarkTable;