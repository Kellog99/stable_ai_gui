import Dataset from "../interfaces/genericInterface";

interface infoProps {
    name: string;
    parameters: number;
    task: string
    dataset: string
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

export interface ReportProps {
    prototype: string;
    id: string,
    dataset: string;
    tool: string;
    info: infoProps;
    metrics: metricsProps;
}

export interface DQReportProps {
    id?: string;
    tool: string;
    dataset: Dataset;
    metrics: Object[];
}