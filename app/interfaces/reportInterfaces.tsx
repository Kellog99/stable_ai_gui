import Dataset from "./genericInterface";

export interface infoProps {
    id: string;
    name: string;
    parameters: number;
    task: string
    dataset: string
    classes: number;
    dimensionality: number[];

}

export interface metricsProps {
    params?: number;
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
    robustness?: number,
    confusionmatrix?: number[][]
}

//  Interface for the report page
export interface ReportAttacksProps {
    info: infoProps;
    metrics: metricsProps;
    attacks: { [key: string]: attacksProps }
}

// Interface associated for retriving the values in the report.
export interface BenchmarkDataProps {
    name: string
    param: number
    task: string
    metrics: { [key: string | number]: number[] }
}

export interface MetricsProps {
    internalConfigs: any;
    results: any;
}


export interface DQReportProps {
    id?: string;
    tool: string
    dataset: Dataset;
    metrics: MetricsProps[];
}

