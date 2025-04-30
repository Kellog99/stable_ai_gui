"use client";

import Config from "@/components/client/metrics/Config";
import classes from './page.module.css'
import { Box, Button, Flex } from "@mantine/core";
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
        <div className="max-w-4xl mx-auto px-4">
            <Box className={ classes.title }>
                <h1>Duplicates evaluation for { datasetName } dataset</h1>
            </Box>
            <Config metricName="duplicates" />
        </div>
    )
}