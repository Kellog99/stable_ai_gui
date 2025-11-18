import React, { useEffect, useState, useMemo } from 'react';
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

import annotationPlugin from 'chartjs-plugin-annotation';

import { Trophy } from 'lucide-react';
import './BenchmarkTable.css';
import { Scatter } from 'react-chartjs-2';


ChartJS.register(annotationPlugin);
ChartJS.register(
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
    benchmark: { [key: string]: BenchmarkDataProps };     
    data: metricsProps;                                   
}

const BenchmarkTable: React.FC<BenchmarkTableProps> = ({
    modelName,
    benchmark,
    data
}) => {

    // These are the metrics that were used during the evaluation of this model.
    const availableBenchmarkingMetrics = useMemo(() =>
        Object.keys(data).filter((key) => !["params", "name", "confusion_matrix", "total benchmarks"].includes(key) &&
            !key.endsWith("_rank")),
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


    const [selectedBenchmark, setSelectedBenchmark] = useState<string>("");

    useEffect(() => {
        if (availableBenchmarkingMetrics.length > 0) {
            setSelectedBenchmark(availableBenchmarkingMetrics[0]);
        }
    }, [availableBenchmarkingMetrics]);

    
    const [sortedData, setSortedData] = useState<[string, number][]>([]);
    const [chartBenchmarkData, setChartBenchmarkData] = useState<{ [key: string]: number }[]>([]);
    const [chartValueData, setChartValueData] = useState<{ [key: string]: number }[]>([]);

    useEffect(() => {
        if (!selectedBenchmark) return;

        const flattenValue = (val: any): number[] => {
            if (val === undefined || val === null) return [];
            if (typeof val === 'number') return [val];
            if (Array.isArray(val)) {
                return val.flatMap(item => flattenValue(item));
            }
            return [];
        };

        const benchmarkEntries = Object.entries(benchmark);
        const benchmarkValues = benchmarkEntries.map(([id, benchmarkProp]) =>
            benchmarkProp.metrics[selectedBenchmark] ?? 0
        );

        const dataValue = flattenValue(data[selectedBenchmark as keyof metricsProps]);


        if (benchmarkValues.length > 0) {
            let benchmarkChartData = benchmarkEntries.map(([id, benchmarkProp], index) => ({
                params: benchmarkProp.param,
                [selectedBenchmark]: benchmarkValues[index],
            }));

            let chartValueData: any[] = [];
            if (dataValue.length > 0 && data.params !== undefined) {
                chartValueData = [{
                    params: data.params,
                    [selectedBenchmark]: dataValue[0],
                }];

                benchmarkChartData = benchmarkChartData.filter(
                    (entry) =>
                        !(entry.params === data.params && entry[selectedBenchmark] === dataValue[0])
                )
            }

            setChartBenchmarkData(benchmarkChartData);
            setChartValueData(chartValueData);
        } else {
            setChartBenchmarkData([]);
            setChartValueData([]);
        }

        const combined: [string, number][] = [];

        benchmarkEntries.forEach(([id, benchmarkProp], index) => {
            combined.push([benchmarkProp.name, benchmarkValues[index]]);
        });

        combined.sort((a, b) => b[1] - a[1]);

        setSortedData(combined);
    }, [selectedBenchmark, benchmark, data, modelName]);

    const chartData2 = {
        datasets: [
            {
                label: 'Benchmark Element',
                data: chartBenchmarkData.map((d) => ({
                    x: d.params,
                    y: d[selectedBenchmark],
                })),
                backgroundColor: 'rgba(59, 130, 246, 0.7)',
            },
            {
                label: 'Tested Model',
                data: chartValueData.map((d) => ({
                    x: d.params,
                    y: d[selectedBenchmark],
                })),
                backgroundColor: 'rgba(239, 68, 68, 0.7)',
            },
        ],
    };


    const isHighlighted = (value: number) => {
        const testedValue = data[selectedBenchmark as keyof metricsProps];
        const flatValue = typeof testedValue === 'number' ? testedValue :
            Array.isArray(testedValue) ? testedValue[0] : null;
        return value === flatValue ? "row highlighted" : "row";
    };

    console.log("sorted elements", sortedData);

    const referenceY = data[selectedBenchmark as keyof metricsProps];
    const referenceLabel = modelName || 'Tested Model';

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top' as const },
            annotation: {
                annotations: {
                    referenceLine: {
                        type: 'line',
                        yMin: referenceY,
                        yMax: referenceY,
                        borderColor: 'rgba(239, 68, 68, 0.8)', // red.7
                        borderWidth: 1,
                        label: {
                            display: true,
                            content: referenceLabel,
                            position: 'start',
                            color: 'rgba(239, 68, 68, 0.8)', // red.7
                            backgroundColor: 'transparent',
                            yAdjust: -10,
                        },
                    },
                },
            },
            tooltip: {
                callbacks: {
                    title: () => '', // Remove title to eliminate the color box there
                    label: (context: any) => {
                        const point = context.raw;
                        const params = point.x;
                        const value = point.y;
                        const modelName = context.dataset.label || '';

                        return [
                            `Group: ${modelName}`,
                            `Params: ${params}`,
                            `Value: ${value.toFixed(2)}`
                        ];
                    },
                },
            },
        },
        scales: {
            x: {
                title: { display: true, text: 'params' },
                type: 'linear' as const,
                position: 'bottom' as const,
            },
            y: {
                title: { display: true, text: selectedBenchmark },
            },
        },
    };




    return (
        <div className="benchmark-controls">
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
            
                <div style={{ width: '100%', height: 400 }}>
                    <Scatter data={chartData2} options={options as any} />
                </div>


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