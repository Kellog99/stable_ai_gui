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