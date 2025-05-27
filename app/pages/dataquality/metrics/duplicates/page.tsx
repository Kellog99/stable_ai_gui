"use client";

import Config from "@/components/client/metrics/Config";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";


export default function Duplicates ()
{
    const searchParams = useSearchParams();
    const [ datasetName, setDatasetName ] = useState<string | null>( "" )
    useEffect( () =>
    {
        if ( searchParams.get( "datasetName" ) ) {
            setDatasetName( searchParams.get( "datasetName" ) )
        }
    }, [ searchParams ] )

    return (
        <div style={{
            marginTop:"50px"
        }}>
            {/*
            <Box className={ classes.title }>
                <h1>Duplicates evaluation for { datasetName } dataset</h1>
            </Box>
            */}
            <Config metricName="duplicates" />
        </div>
    )
}