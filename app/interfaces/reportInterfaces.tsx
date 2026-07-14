import Dataset from "./genericInterface";
import { ModelInfo } from "./homePageInterface";
import { ParametersProps } from "./NNInterfaces";

export interface metricsProps {
    params: number;
    accuracy?: number;
    precision?: number;
    f1score?: number;
    confusion_matrix?: number[][];
    robustness?: number;
    wobbliness?: number;
}

export interface AttackMetricsProps {
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
export interface ReportAttackProps {
    name: string,
    metrics: AttackMetricsProps
    parameters: ParametersProps[]
}

//  Interface for the report page
export interface ModelReportProps {
    info: ModelInfo;
    metrics: metricsProps;
    attacks: { [key: string]: ReportAttackProps }
}

// Interface associated for retriving the values in the report.
export interface BenchmarkDataProps {
    name: string
    param: number
    task: string
    metrics: { [key: string | number]: number[] }
}

export interface DQReportProps {
    id: string;
    tool: string
    dataset: Dataset;
    metrics: Object[];
}