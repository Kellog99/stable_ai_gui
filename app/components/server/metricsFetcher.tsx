"use server"

import { getDuplicates, getOutliers } from "@/functionalities/BackendUtils";

type MetricType = "duplicates" | "outliers";

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

    console.log( "OUTLIER MODE:", metric )

    const analysisMap = {
        "duplicates": () => getDuplicates( datasetName as string, featureName, internalConfigs ),
        "outliers": () => getOutliers( datasetName as string, featureName, internalConfigs, outliers_mode! ),
    };

    try {
        const data = await analysisMap[ metric ]();
        return data

    } catch ( error ) {
        console.error( 'Error computing metric', error );
    }
}