import { LineChart } from '@mantine/charts';
import React from 'react'
import {ConfidenceData} from '@/interfaces/testInterfaces';

interface ConfidenceChartProps {
    confidence?: ConfidenceData,
}

const ConfidenceChart: React.FC<ConfidenceChartProps> = ({
    confidence
}) => {
    if (!confidence || Object.values(confidence).length == 0) {
        return
    }

    // ###################### Confidence Chart Data ######################
    const getSeriesValues = (series: ConfidenceData[string]): number[] =>
        Array.isArray(series) ? series : Object.keys(series)
            .sort((a, b) => Number(a) - Number(b))
            .map((step) => series[step]);

    const normalizedConfidence = Object.fromEntries(
        Object.entries(confidence).map(([key, series]) => [key, getSeriesValues(series)])
    );
    const longestSeries = Math.max(0, ...Object.values(normalizedConfidence).map((series) => series.length));
    const chartData = Array.from({length: longestSeries}, (_, step) => {
        const point: Record<string, number | null> = {step};
        Object.entries(normalizedConfidence).forEach(([key, series]) => {
            const value = series[step];
            point[key] = typeof value === 'number' && Number.isFinite(value)
                ? parseFloat(value.toFixed(3))
                : null;
        });
        return point;
    });


    const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];
    const series = Object.keys(normalizedConfidence).map((key, index) => ({
        name: key,
        color: colors[index % colors.length],
    }));
    // Calculate min and max from your chart data
    const getConfidenceBounds = () => {
        const allValues = chartData.flatMap(item =>
            series.map(s => item[s.name]).filter(val => val !== undefined && val !== null)
        );

        if (allValues.length === 0) return [0, 1];

        const minVal = Math.min(...allValues);
        const maxVal = Math.max(...allValues);
        const padding = minVal === maxVal
            ? Math.max(Math.abs(minVal) * 0.05, 0.01)
            : (maxVal - minVal) * 0.05;

        return [minVal - padding, maxVal + padding];
    };


    // ###################################################################


    return (
        <section className="confidence-section" aria-labelledby="confidence-chart-title">
            <div>
                <h3 className="card-title" id="confidence-chart-title">Confidence chart</h3>
                <p className="card-description">
                    Confidence trend for the model classes during the attack.
                </p>
            </div>

            <LineChart
                h={350}
                data={chartData}
                dataKey="step"
                curveType="natural"
                withLegend
                tickLine="xy"
                withDots={false}
                legendProps={{ verticalAlign: 'bottom', height: 50 }}
                xAxisLabel="Iteration Step"
                yAxisLabel="Model Confidence"
                yAxisProps={{ domain: getConfidenceBounds() }}
                series={series}
            />
        </section>
    )
}

export default ConfidenceChart
