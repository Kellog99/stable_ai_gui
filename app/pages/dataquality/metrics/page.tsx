"use client";

import DuplicatesDisplayer from "@/components/client/metrics/DuplicatesDisplayer";
import OutlierDisplayer from "@/components/client/metrics/OutlierDisplayer";
import { Accordion, Box, Text, Space, Button } from "@mantine/core";
import classes from './page.module.css'
import { useRouter, useSearchParams } from 'next/navigation';

import { useEffect, useState } from "react";
import Config from "@/components/client/metrics/Config";

export default function Metrics ()
{
    const router = useRouter()
    const searchParams = useSearchParams();
    const itemParam = searchParams.get( 'metric' );

    const [ datasetName, setDatasetName ] = useState<string | null>( "" )

    const name_dpl = "Uniqueness"
    const featureName = "Image"
    const score_dpl = 90
    const indexes_dpl: [ number, number ][] = [ [ 1, 1 ], [ 2, 2 ], [ 3, 3 ] ]

    const name_otl = "Outliers"
    const score_otl = 85
    const indexes = [ 10, 11, 12 ]
    const score_per_sample = [ 10, 20, 80, 98, 67, 99 ]


    const [ openedItem, setOpenedItem ] = useState<string | null>( null );
    useEffect( () =>
    {
        if ( searchParams.get( "datasetName" ) ) {
            setDatasetName( searchParams.get( "datasetName" ) )
        }
    }, [ searchParams ] )

    useEffect( () =>
    {
        if ( itemParam ) {
            setOpenedItem( itemParam );
        }
    }, [ itemParam ] );


    const handleAccordionChange = ( itemId: string | null ) =>
    {
        setOpenedItem( itemId );

        const params = new URLSearchParams( searchParams );

        if ( itemId ) {
            params.set( 'metric', itemId );
        } else {
            params.delete( 'metric' ); // if you want to remove it when nothing is selected
        }

        router.push( `/pages/dataquality/metrics?${params.toString()}` );
    };

    return (
        <>
            <div className="max-w-4xl mx-auto px-4">
                <Box className={ classes.title }>
                    <h1>Metrics evaluation for { datasetName } dataset</h1>
                    <Button>
                        Obtain report with default configurations
                    </Button>
                </Box>
                <Space h="md" />


                <Box style={ {
                    marginLeft: 400,
                    marginRight: 400
                } }>
                    <Accordion value={ openedItem } onChange={ handleAccordionChange }>
                        <Accordion.Item value="duplicates">
                            <Accordion.Control>
                                <Text fw={ 700 } size="lg">Duplicates</Text>
                            </Accordion.Control>
                            <Accordion.Panel>
                                <Config />
                            </Accordion.Panel>
                        </Accordion.Item>
                        <Accordion.Item value="outliers">
                            <Accordion.Control>
                                <Text fw={ 700 } size="lg">Outliers</Text>
                            </Accordion.Control>
                            <Accordion.Panel>
                                <Config labelFeatureReq={true}/>
                            </Accordion.Panel>
                        </Accordion.Item>
                    </Accordion>
                </Box>
            </div>
        </>
    )
}