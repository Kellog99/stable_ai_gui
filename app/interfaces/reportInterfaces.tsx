// Report information
interface infoProps {
    name: string;
    description: string;
    parameters: number;
    classNames: string[]
}

interface metricsProps {
    accuracy: number;
    precision: number;
    f1_score: number;
    confusion_matrix: number[][]
}

interface attacksProps {
    accuracy: number,
    precision: number,
    f1_score: number,
    misclassification: number,
    power: number,
    num_queries: number,
    robustness: number[],
    confusion_matrix: number[][]
}

export interface ReportProps {
    info: infoProps;
    metrics: metricsProps;
    attacks: { [key:string] : attacksProps }
}