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

export interface ReportProps {
    prototype: string;
    id: string,
    dataset: string;
    tool: string;
    info: infoProps;
    metrics: metricsProps;
    attacks: { [key: string]: attacksProps }
}

// ##################### Benchmark Data #####################
// This interface refears to a single model-dataset 
// Hence the whole dataset of past results is given by a list of BenchmarkDataProps
export interface BenchmarkDataProps {
    name: string
    param: number
    task: string
    metrics: { [key: string | number]: number }
}

// ##################### Data Quality Report #####################
export interface DQReportProps {
    id?: string;
    tool: string;
    dataset: Dataset;
    metrics: Object[];
}