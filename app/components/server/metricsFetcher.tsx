"use server"

import { getCompleteness, getDuplicates, getOutliers } from "@/functionalities/BackendUtils";
import { MetricType } from "@/interfaces/metricsInterface";


export default async function metricsFetcher (
    metric: MetricType,
    datasetName: string,
    featureName: string,
    internalConfigs: any,
    labelFeatureName?: string,
    outliers_mode?: string )
{


    if ( outliers_mode == "isolation forest" ) {
        outliers_mode = "iforest"
    }

    const analysisMap = {
        "duplicates": () => getDuplicates( datasetName as string, featureName, internalConfigs ),
        "outliers": () => getOutliers( datasetName as string, featureName, internalConfigs, outliers_mode! ),
        "completeness": () => getCompleteness(datasetName as string, featureName, internalConfigs)

    };

    try {
        const data = await analysisMap[ metric ]();
        return data

    } catch ( error ) {
        console.error( 'Error computing metric', error );
    }
}