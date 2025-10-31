"use server"

import { getCompleteness, getDuplicates, getOutliers } from "@/functionalities/BackendUtils";
import { MetricType } from "@/interfaces/metricsInterface";
import { completeness_start, duplicates_start, outliers_start } from "@/properties/urls";
import internal from "stream";


export default async function metricsFetcher (
    metric: MetricType,
    internalConfigs: any,
    outliers_mode?: string )
{

    if ( outliers_mode == "isolation forest" ) {
        outliers_mode = "iforest"
    }


    const analysisMap = {
        "duplicates": duplicates_start,
        "outliers": outliers_start,
        "completeness": completeness_start

    };

    try {
        const data = await analysisMap[ metric ];
        console.log("data from metric fetcher", data)
        return data

    } catch ( error ) {
        console.error( 'Error computing metric', error );
    }
}


