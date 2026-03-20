import { LineChart } from '@mantine/charts';
import React from 'react'
import '@mantine/charts/styles.css'; // Add this import

interface ConfidenceChartProps {
    confidence?: { [key: string]: { [key: number]: number } },
}

const ConfidenceChart: React.FC<ConfidenceChartProps> = ({
    confidence
}) => {
    if (!confidence || Object.values(confidence).length == 0) {
        return
    }

    // ###################### Confidence Chart Data ######################
    // Collect all unique steps across all series
    const allSteps = new Set<number>();
    Object.values(confidence).forEach(series => {
        Object.keys(series).forEach(step => allSteps.add(Number(step)));
    });

    // Sort steps numerically
    const sortedSteps = Array.from(allSteps).sort((a, b) => a - b);

    // Build chart data with all steps, using null/undefined for missing values
    const chartData = sortedSteps.map(step => {
        const point: any = { step };
        Object.entries(confidence).forEach(([key, series]) => {
            // Use null or undefined if this step doesn't exist in this series
            point[key] = series[step] !== undefined
                ? parseFloat(series[step].toFixed(3))
                : null;
        });
        return point;
    });


    const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];
    const series = Object.keys(confidence).map((key, index) => ({
        name: key,
        color: colors[index % colors.length],
    }));
    // Calculate min and max from your chart data
    const getConfidenceBounds = () => {
        const allValues = chartData.flatMap(item =>
            series.map(s => item[s.name]).filter(val => val !== undefined && val !== null)
        );

        const minVal = Math.min(...allValues);
        const maxVal = Math.max(...allValues);

        return [minVal - 0.0, maxVal + 0.0];
    };


    // ###################################################################


    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px"
        }}>
            <div>
                <h3 className="card-title">Confidence Chart</h3>
                <span style={{ fontSize: "0.8rem" }}>
                    The following graph shows the trend in confidence for the original class and the opposing class.        </span>
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
        </div>
    )
}

export default ConfidenceChart