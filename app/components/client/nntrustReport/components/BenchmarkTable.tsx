import React, { useState } from 'react';
import { BenchmarkDataProps, metricsProps } from '@/interfaces/reportInterfaces';
import { ScatterChart } from '@mantine/charts';
import { Trophy, TrendingUp, TrendingDown } from 'lucide-react';
import './BenchmarkTable.css';

interface BenchmarkTableProps {
    benchmark: BenchmarkDataProps;      // stored benchmarks from previous models
    data: metricsProps;                 // metrics result from the benchmark
}

const BenchmarkTable: React.FC<BenchmarkTableProps> = ({ benchmark, data }) => {
    const availableBenchmarks = Object.keys(data).filter((key) => key !== 'params');
    const [selectedBenchmark, setSelectedBenchmark] = useState<string>(availableBenchmarks[0]);

    if (!data || !selectedBenchmark) return <div>Loading...</div>;

    // Sort data by value, descending
    const sortedData = benchmark?[selectedBenchmark as keyof BenchmarkDataProps].push(data?[selectedBenchmark as keyof metricsProps])
        .sort((a, b) => b.value - a.value);

    // Chart data
    const chartData = [
        {
            color: 'blue.5',
            name: 'Benchmark Elements',
            data:
                benchmark.params?.map((param, index) => ({
                    params: param,
                    [selectedBenchmark]: benchmark[selectedBenchmark as keyof BenchmarkDataProps]?.[index],
                })) || [],
        },
        {
            color: 'red.5',
            name: 'Tested Model',
            data: [
                {
                    params: data.params,
                    [selectedBenchmark]: data[selectedBenchmark as keyof metricsProps],
                },
            ],
        },
    ];
    const isHighlighted = (value: number) => {
        if (value === data[selectedBenchmark as keyof metricsProps]) {
            return "row highlighted"
        }
        else{
            return "row"
        }
    }
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
                            y: data[selectedBenchmark as keyof metricsProps],
                            label: 'Tested Model',
                            color: 'red.7',
                        },
                    ]}
                />

                {/* Leaderboard */}
                <div className="leaderboard">
                    <h3 className="leaderboard-title">
                        <Trophy className="icon trophy-large" />
                        Leaderboard - {' '}
                        {selectedBenchmark.charAt(0).toUpperCase() +
                            selectedBenchmark.slice(1).replace(/_/g, ' ')}
                    </h3>

                    <div className="entries">
                        {sortedData.map((item, index) => (
                            <div className={isHighlighted(item.value)}>
                                <div className="row-left">
                                    <div className="rank-circle">{index + 1}</div>
                                    <span className="row-label">Name {item.originalIndex}</span>
                                </div>
                                <div className="row-right">
                                    <span className="row-value">{Number((item.value).toFixed(3))}</span>
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
