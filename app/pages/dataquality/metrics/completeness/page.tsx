"use client";

import Config from "@/components/client/metrics/Config";
import classes from './page.module.css'
import { Box, Button, Flex } from "@mantine/core";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";


export default function Completeness ()
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
            <Config metricName="completeness" />
        </div>
    )
}