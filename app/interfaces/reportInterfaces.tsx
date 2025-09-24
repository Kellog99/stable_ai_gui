// Report information
interface infoProps {
    name: string;
    parameters: number;
    classes: number;
    dimensionality: number[];

}

export interface metricsProps {
    params: number;
    accuracy?: number;
    precision?: number;
    f1score?: number;
    confusion_matrix?: number[][];
    robustness?: number;
    wobbliness?: number;
}

export interface attacksProps {
    name: string,
    risk: number,
    accuracy?: number,
    precision?: number,
    f1score?: number,
    misclassification?: number,
    power?: number,
    num_queries?: number,
    robustness?: number[],
    confusion_matrix?: number[][]
}

export interface ReportProps {
    info: infoProps;
    metrics: metricsProps;
    attacks: { [key: string]: attacksProps }
}

export interface BenchmarkDataProps {
    accuracy?: number[];
    precision?: number[];
    f1score?: number[];
    robustness?: number[];
    wobbliness?: number[];
    params: number[]
}