export interface DuplicatesDTO
{
    name: string,
    featureName: string,
    score: number,
    indexes: [ number, number ][]
}