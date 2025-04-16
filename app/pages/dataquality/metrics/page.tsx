"use client";

import { Accordion, Box, Text, Space, Button, Divider, Paper, Flex, Blockquote } from "@mantine/core";
import classes from './page.module.css'
import { useRouter, useSearchParams } from 'next/navigation';
import useStore from '../../../store/dsStore';
import { useEffect, useState } from "react";
import Config from "@/components/client/metrics/Config";
import { IconInfoCircle } from '@tabler/icons-react';

export default function Metrics ()
{
    const router = useRouter()
    const searchParams = useSearchParams();
    const itemParam = searchParams.get( 'metric' );

    const [ datasetName, setDatasetName ] = useState<string | null>( "" )
    const configs = useStore( ( state ) => state.metricsConfig )
    const addToReport = useStore( ( state ) => state.addToReport )



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

    const icon = <IconInfoCircle />;
    return (
        <>
            <div className="max-w-4xl mx-auto px-4">
                <Box className={ classes.title }>
                    <h1>Metrics evaluation for { datasetName } dataset</h1>
                    <Button>
                        Obtain report with default configurations
                    </Button>
                </Box>

                <Flex
                    direction="row"
                    justify="left"
                    align="start"
                >

                    <Blockquote
                        color="yellow"
                        icon={ icon } 
                        
                        style={ {
                            marginTop: 80,
                            width: '300px',
                            visibility: addToReport === true ? 'visible' : 'hidden',
                            backgroundColor: '#FFFAE6',
                        } }
                    >
                        <Text fw={700} td="underline">Metrics added to report</Text>
                        
                    </Blockquote>

                    <Box style={ { marginLeft: 100, marginRight: 50, marginTop: 80, width: '60%' } }>
                        <Divider />
                        <Accordion value={ openedItem } onChange={ handleAccordionChange }>
                            <Accordion.Item value="duplicates">
                                <Accordion.Control>
                                    <Text fw={ 700 } size="lg">Duplicates</Text>
                                </Accordion.Control>
                                <Accordion.Panel>
                                    <Config metricName="duplicates" />
                                </Accordion.Panel>
                            </Accordion.Item>
                            <Accordion.Item value="outliers">
                                <Accordion.Control>
                                    <Text fw={ 700 } size="lg">Outliers</Text>
                                </Accordion.Control>
                                <Accordion.Panel>
                                    <Config metricName="outliers" labelFeatureReq={ true } />
                                </Accordion.Panel>
                            </Accordion.Item>
                        </Accordion>
                    </Box>
                </Flex>
            </div>
        </>
    )
}