import { BarChart } from "@mantine/charts";
import '@mantine/charts/styles.css';

interface BarChartProps {
    data: { label: string; samples: number }[]
    keyL: string; 
    dynamicWidth?: boolean;
    xAxisSets?: boolean;
    tooltipsSets?: boolean;
    tooltipsUM?: string; //tooltips unit measure 
}


export function BarChartCustom({ data, keyL, dynamicWidth = false, xAxisSets = false, tooltipsSets = false, tooltipsUM}: BarChartProps) {
    const barSize = 60;            // Width of each bar
    const barSpacing = 30;         // Space between each bar
    const numberOfBars = data.length;
    const chartWidth = numberOfBars * (barSize + barSpacing);
    const dynamicChartWidth = Math.max(chartWidth, data.length * barSize * 1.5);
    const width = dynamicWidth ? Math.min(dynamicChartWidth, 500) : chartWidth;

    const dataLength = data?.length ?? 0;
    const numberOfTicks = 10;

    let ticks: string[] = [];

    if (dataLength > 0) {
        const tickIndexes = Array.from({ length: numberOfTicks }, (_, i) =>
            Math.floor(i * (dataLength - 1) / (numberOfTicks - 1))
        );
        ticks = tickIndexes.map(i => data[i]?.label ?? '');
    }

    const xAxisConf = {
        ticks,
        tickFormatter: (label: string | number) => {
            const strLabel = String(label);

            if (strLabel.includes("-")) {
                const [min, max] = strLabel.split("-").map(Number);

                if (!isNaN(min) && !isNaN(max)) {
                    const midpoint = Math.round((min + max) / 2);
                    const nearestMultiple = Math.round(midpoint / 200) * 200;
                    return nearestMultiple.toString();
                }
            }

            return strLabel;
        }
    };

    const tooltipConf = {
        content: (props: any) => {
            const { label, payload } = props;
            if (payload && payload.length > 0) {
                return (
                    <div
                        style={{
                            backgroundColor: "white",
                            padding: "8px 12px",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        }}
                    >
                        <p style={{ margin: 0, fontWeight: "bold" }}>{label} {tooltipsUM}</p>
                        <p style={{ margin: 0, color: "#666" }}>
                            Samples: {payload[0].value}
                        </p>
                    </div>
                );
            }
            return null;
        },
    };

    return (
        <BarChart
            key={keyL}
            h={400}
            w={width}
            data={data}
            dataKey="label"
            series={[{ name: 'samples', color: '#a9adb9' }]}
            barProps={{
                barSize: barSize,
                onClick: (bar) => {
                    console.log('Clicked bar data:', bar.label);
                }
            }}
            xAxisProps={xAxisSets ? xAxisConf : undefined}
            withTooltip
            tooltipProps={tooltipsSets ? tooltipConf : undefined}
            style={{ paddingRight: barSpacing / 2, paddingBottom: "20px", overflow: "hidden" }}
        />
    )
}