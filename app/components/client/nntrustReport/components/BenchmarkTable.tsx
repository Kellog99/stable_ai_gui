import React, { useEffect, useState } from 'react'
import { BenchmarkDataProps, metricsProps } from '@/interfaces/reportInterfaces';
import { ScatterChart } from '@mantine/charts';
import './BenchmarkTable.css';
import { benchmarkData } from '../examples';

const BenchmarkTable = (
    benchmark: metricsProps
) => {
    const [data, setBenchmarkData] = useState<BenchmarkDataProps>();
    const [error, setError] = useState<string>('');
    const [selectedBenchmark, setSelectedBenchmark] = useState<string>('');

    // Mock data structure - replace with actual JSON fetch
    useEffect(() => {
        const fetchData = async () => {
            try {
                setBenchmarkData(benchmarkData);
            } catch (err) {
                setError('Failed to load data');
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (data) {
            const availableBench = Object.keys(data).filter(key => key !== "params");
            if (availableBench.length > 0 && !selectedBenchmark) {
                setSelectedBenchmark(availableBench[0]);
            }
        }
    }, [data, selectedBenchmark]);

    if (error) {
        return <div className="error">{error}</div>;
    }

    if (!data || !selectedBenchmark) {
        return <div>Loading...</div>;
    }

    const availableBench = Object.keys(data).filter(key => key !== "params");
    console.log(availableBench);
    console.log(Object.keys(benchmark));
    // Transform data for ScatterChart
    const chartData = [{
        color: 'blue.5',
        name: 'Benchmark Elements',
        data: data.params?.map((param, index) => ({
            params: param,
            [selectedBenchmark]: data[selectedBenchmark as keyof BenchmarkDataProps]?.[index]
        })) || []
    },
    {
        color: 'red.5',
        name: 'Tested Model',
        data: [{
            params: benchmark.params,
            [selectedBenchmark]: benchmark[selectedBenchmark as keyof metricsProps]
        }]
    }];
    console.log(chartData)
    return (
        <div className="benchmark-controls">
            <select
                value={selectedBenchmark}
                onChange={(e) => setSelectedBenchmark(e.target.value)}
                className="benchmark-select"
            >
                {availableBench.map((key) => (
                    <option key={key} value={key}>
                        {key}
                    </option>
                ))}
            </select>
            <ScatterChart
                h={350}
                data={chartData}
                dataKey={{ x: 'params', y: `${selectedBenchmark}` }}
                xAxisLabel="params"
                yAxisLabel={`${selectedBenchmark}`}
                referenceLines={[
                    { y: benchmark[selectedBenchmark as keyof metricsProps], label: 'Tested Model', color: 'red.7' },
                ]}
            />
        </div>
    );
};


export default BenchmarkTable