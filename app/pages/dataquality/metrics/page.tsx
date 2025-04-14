"use client";

import DuplicatesDisplayer from "@/components/client/metrics/DuplicatesDisplayer";
import OutlierDisplayer from "@/components/client/metrics/OutlierDisplayer";
import { Box, Divider, Flex, Space } from "@mantine/core";
import classes from './page.module.css'

export default function Metrics ()
{

    const name_dpl = "Uniqueness"
    const featureName = "Image"
    const score_dpl = 90
    const indexes_dpl: [ number, number ][] = [ [ 1, 1 ], [ 2, 2 ], [ 3, 3 ] ]

    const name_otl = "Outliers"
    const score_otl = 85
    const indexes = [ 10, 11, 12 ]
    const score_per_sample = [ 10, 20, 80, 98, 67, 99 ]


    return (
        <>
            <div className="max-w-4xl mx-auto px-4">
                <Box className={ classes.title }>
                    <h1>This is the metrics page</h1>
                </Box>
                <Space h="md" />
            </div>
            <div style={ { width: '100%', height: '100%' } }>
                <Flex
                    direction="row"
                    align="start"
                    style={ { width: '100%', height: '100%', justifyContent: 'space-between' } }>
                    <DuplicatesDisplayer name={ name_dpl } featureName={ featureName } score={ score_dpl } indexes={ indexes_dpl } />
                    <Divider orientation="vertical" />
                    <OutlierDisplayer name={ name_otl } featureName={ featureName } score={ score_otl } indexes={ indexes } score_per_sample={ score_per_sample } />
                </Flex>
            </div>
        </>
    )
}