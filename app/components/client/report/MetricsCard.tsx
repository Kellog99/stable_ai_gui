import {Gauge} from 'lucide-react';
import './ModelMetrics.css';
import React from "react";
import {MetricsProps} from "@/interfaces/reportInterfaces";

interface ModelMetricsProps {
    metrics: MetricsProps;
}

const MetricsCard: React.FC<ModelMetricsProps> = (
    {
        metrics
    }: ModelMetricsProps
) => {

    const allMetricCards = Object.entries(metrics)
        .filter(([key, value]: [string, any]) =>
            value != null
            && key !== "confusion_matrix"
        )
        .map(([key, value]: [string, any]) => {
            const formatted =
                typeof value === "number"
                    ? value.toFixed(3)
                    : Array.isArray(value) && value.every((v) => typeof v === "number")
                        ? value.map((v) => v.toFixed(3))
                        : value;
            return [key, formatted] as [string, any];
        });
    return (
        <section className="model-metrics" aria-labelledby="metrics-title">
            <div className="model-metrics__title">
                <Gauge size={32}/>
                <h2 id="metrics-title">Metrics</h2>
            </div>
            {
                allMetricCards.length > 0 ?
                    <div className="model-metrics__grid">
                        {allMetricCards.map(([key, value]: [string, any]) => (
                            <div
                                className={`model-metrics__card${Array.isArray(value) ? ' model-metrics__card--list' : ''}`}
                                key={key}
                            >
                                <span>{key}</span>
                                {Array.isArray(value) ? (
                                    <div className="model-metrics__values">
                                        {value.map((item, index) => <b key={index}>{item}</b>)}
                                    </div>
                                ) : <b>{value}</b>}
                            </div>
                        ))}
                    </div> :
                    <p className="model-metrics__empty-state">No metrics computed.</p>

            }
        </section>
    );
};

export default MetricsCard;
