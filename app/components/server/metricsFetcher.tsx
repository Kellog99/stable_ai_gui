"use server"

import { getDuplicates, getOutliers } from "@/functionalities/Utils";

type MetricType = "duplicates" | "outliers";

export default async function metricsFetcher(
                                metric: MetricType, 
                                datasetName: string, 
                                featureName: string, 
                                internalConfigs: any, 
                                labelFeatureName?: string,
                                outliers_mode?: string) {


    const analysisMap = {
        "duplicates": () => getDuplicates(datasetName as string, featureName, internalConfigs),
        "outliers": () => getOutliers(datasetName as string, featureName, internalConfigs, outliers_mode!),
    };
    
    try {
       const data =  await analysisMap[metric]();
       return data
       
    } catch ( error ) {
        console.error( 'Error computing metric', error );}
}