"use client";

import { Flex } from "@mantine/core";

interface OutliersDTO{
    name: string,
    featureName: string,
    score: number,
    indexes: number[], 
    score_per_sample: number[]
}
export default function OutlierDisplayer(outliers: OutliersDTO){
    return(
        <>
        <Flex
        direction="column">
        <h2>This is the Outlier Displayer component</h2>
        <h3>{outliers.name} metric computed on {outliers.featureName}</h3>
        </Flex>
        </>
    )

}