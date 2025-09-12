// Report information
interface infoProps {
    name: string;
    parameters: number;
    classes: number;
    dimensionality: number[];

}

interface metricsProps {
    accuracy?: number;
    precision?: number;
    f1score?: number;
    confusion_matrix?: number[][];
    robustness?: number;
    wobbliness?:number;
}

interface attacksProps {
    risk:number,
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