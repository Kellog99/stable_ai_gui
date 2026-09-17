import {RegisterObjectProps, supportsTask} from '@/interfaces/NNInterfaces';
import {Check, ChevronDown, CircleArrowRight, RotateCcw} from 'lucide-react';
import React, {useEffect, useMemo, useState} from 'react';
import './BenchmarkActions.css';
import useNNTrustStore from "@/store/nnTrustStore";
import {getDisabledDescription} from "@/pages/redteam/benchmark/utils";

interface BenchmarkActionsProps {
    onRun: (metrics: RegisterObjectProps[]) => void;
    onReset: () => void;
    selectedAttacks: { [key: string]: RegisterObjectProps };
    isExecuting: boolean;
}

const BenchmarkActions: React.FC<BenchmarkActionsProps> = (
    {
        onRun,
        onReset,
        selectedAttacks,
        isExecuting,
    }
) => {
    const {
        model,
        dataset,
        metrics
    } = useNNTrustStore();

    // Filtering the list of all possible metrics through the model's task
    const availableMetrics: { [k: string]: RegisterObjectProps } = useMemo(
        () => Object.fromEntries(
            Object.entries(metrics).filter(
                ([, metric]: [string, RegisterObjectProps]): boolean => {
                    if (!model || !model.task || !metric.task) return false
                    return supportsTask(metric, model!.task!)
                },
            ),
        ),
        [metrics, model],
    );
    const numAvailableMetrics: number = useMemo(
        () => Object.entries(availableMetrics).length,
        [availableMetrics]
    )

    //This is the list that contains all the ids of the metrics that are selected
    //By default, its initial state contains all the metrics
    const [selectedMetrics, setSelectedMetrics] = useState<string[]>(Object.keys(availableMetrics))
    useEffect(() => {
        if (!availableMetrics) setSelectedMetrics([])
        setSelectedMetrics(Object.keys(availableMetrics))
    }, [availableMetrics]);

    const selectedMetricObjects = useMemo(
        () => Object.fromEntries(
            selectedMetrics
                .filter((id: string) => availableMetrics[id] !== undefined)
                .map((id: string) => [id, availableMetrics[id]]),
        ),
        [availableMetrics, selectedMetrics],
    );

    const disabledDescription = useMemo(
        () => getDisabledDescription(
            dataset,
            selectedAttacks,
            selectedMetricObjects,
            isExecuting,
        ),
        [dataset, selectedAttacks, selectedMetricObjects, isExecuting],
    );
    const isRunDisabled = disabledDescription !== '';
    const onSelectAll = () => setSelectedMetrics(
        availableMetrics ?
            Object.keys(availableMetrics)
            : []
    )
    const onSelectNone = () => setSelectedMetrics([])
    return (
        <section className="benchmark-actions" aria-label="Benchmark actions">
            <div className="benchmark-metric-control">
                <details className="benchmark-metrics-dropdown">
                    <summary>
                        <span>Metrics {Object.keys(selectedMetrics).length} / {numAvailableMetrics} selected</span>
                        <ChevronDown size={16} aria-hidden="true"/>
                    </summary>
                    <div className="benchmark-metrics-menu">
                        <div className="benchmark-metrics-shortcuts">
                            <button type="button" onClick={onSelectAll}>All</button>
                            <button type="button" onClick={onSelectNone}>None</button>
                        </div>
                        <div className="benchmark-metrics-options">
                            {numAvailableMetrics === 0 ? (
                                    <p>No metrics are available.</p>
                                ) :
                                Object.entries(availableMetrics).map(
                                    ([id, metric]: [string, RegisterObjectProps]) => {
                                        const isSelected = selectedMetrics.includes(id);
                                        return (
                                            <label key={id}>
                                                <input type="checkbox" checked={isSelected}
                                                       onChange={() => {
                                                           if (selectedMetrics.includes(id)) {
                                                               setSelectedMetrics(
                                                                   (prev: string[]) => prev.filter(
                                                                       (metric: string) => metric != id
                                                                   )
                                                               )
                                                           } else setSelectedMetrics(prev => [...prev, id])
                                                       }}/>
                                                <span className="benchmark-metric-check" aria-hidden="true">
                                            {isSelected && <Check size={13}/>} 
                                        </span>
                                                <span>{metric.name}</span>
                                            </label>
                                        );
                                    })}
                        </div>
                    </div>
                </details>
            </div>
            <div className="benchmark-action-buttons">
                <button
                    type="button"
                    className="benchmark-reset-button"
                    onClick={onReset}
                    disabled={isExecuting}
                    title="Clear the current benchmark and selections"
                >
                    <RotateCcw size={17} aria-hidden="true"/>
                    Reset
                </button>
                <button
                    type="button"
                    className="benchmark-run-button"
                    onClick={() => onRun(Object.values(selectedMetricObjects))}
                    disabled={isRunDisabled}
                    title={isRunDisabled ? disabledDescription : undefined}
                >
                    {isExecuting ? 'Starting…' : 'Run benchmark'}
                    <CircleArrowRight size={21} aria-hidden="true"/>
                </button>
            </div>
        </section>
    );
};

export default BenchmarkActions;
