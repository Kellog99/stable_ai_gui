export type MetricType = "duplicates" | "outliers" | "completeness";

export interface DuplicatesDTO
{
    name: string,
    featureName: string,
    score: number,
    indexes: [ number, number ][]
}

export interface OutliersDTO
{
    name: string,
    mode: string,
    featureName: string,
    score: number,
    indexes: number[],
    score_per_sample: number[]
}

export interface CompletenessDTO 
{
    name: string,
    featureName: string,
    score: number,
    giniScore: number,
    score_per_requirement: number[],
    combinedScore: number,
    indexes_per_requirement: number[][]
}

export interface ResultPoll
{
    origin: string,
    data: any
}