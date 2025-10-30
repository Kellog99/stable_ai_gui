import React, { useEffect, useState, useMemo } from 'react';
import { BenchmarkDataProps, metricsProps } from '@/interfaces/reportInterfaces';
import { ScatterChart } from '@mantine/charts';
import { Trophy } from 'lucide-react';
import './BenchmarkTable.css';

interface BenchmarkTableProps {
    modelName?: string                  // name of the tested model
    benchmark: BenchmarkDataProps;      // stored benchmarks from previous models
    data: metricsProps;                 // metrics result from the benchmark
}

const BenchmarkTable: React.FC<BenchmarkTableProps> = ({
    modelName,
    benchmark,
    data
}) => {
    console.log("data keys = ", Object.keys(data))
    const availableBenchmarks = useMemo(() =>
        Object.keys(data).filter((key) => !["params", "name", "confusion_matrix"].includes(key))
        , [data]);

    const [selectedBenchmark, setSelectedBenchmark] = useState<string>("");

    useEffect(() => {
        if (availableBenchmarks.length > 0) {
            setSelectedBenchmark(availableBenchmarks[0]);
        }
    }, [availableBenchmarks]);

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

        const benchmarkValue = flattenValue(benchmark[selectedBenchmark as keyof BenchmarkDataProps]);
        const dataValue = flattenValue(data[selectedBenchmark as keyof metricsProps]);

        // Create chart data for benchmark points
        if (benchmarkValue.length > 0) {
            // Check if params exists and is an array            
            const benchmarkChartData = benchmark.params.map((param, index) => ({
                "params": param,
                [selectedBenchmark]: benchmarkValue[index],
            }));
            console.log("Setting benchmarkChartData:", benchmarkChartData);

            setChartBenchmarkData(benchmarkChartData);
        } else {
            console.log("benchmarkValue is empty, setting empty array");
            setChartBenchmarkData([{}]);
        }

        // Create chart data for the tested model value
        setChartValueData([{
            "params": data.params,
            [selectedBenchmark]: dataValue[0],
        }]);


        // Combine into [name, value] tuples and sort by value descending
        const combined: [string, number][] = [];

        // Add benchmark values with their names
        benchmarkValue.forEach((val, index) => {
            combined.push([benchmark.names[index], val]);
        });

        // Add the tested model value
        combined.push([modelName || 'Target Model', dataValue[0]]);

        // Sort by value (descending)
        combined.sort((a, b) => b[1] - a[1]);
        console.log("combined = ", combined)
        setSortedData(combined)
    }, [selectedBenchmark, benchmark, data]);



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
        return value === testedValue ? "row highlighted" : "row";
    };

    console.log("sorted elements", sortedData )
    return (
        <div className="benchmark-controls">
            {/* Benchmark selector */}
            <select
                value={selectedBenchmark}
                onChange={(e) => setSelectedBenchmark(e.target.value)}
                className="benchmark-select"
            >
                {availableBenchmarks.map((key) => (
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