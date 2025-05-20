"use client"

import "@mantine/core/styles.css";
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useRef, useState } from "react";
import Link from 'next/link'
import
{
    Stack,
    Button,
    Text,
    Box,
    Space, Group,
    Menu,
    Divider,
    Tooltip,
    Indicator
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import
{
    faHouse, faImage, faChartLine, faBolt, faDatabase
} from '@fortawesome/free-solid-svg-icons';
import
{
    IconChevronDown,
    IconChevronUp,
    IconChevronRight
} from '@tabler/icons-react';
import classes from './AppNavbarDataQuality.module.css';
import RouterButton from "@/components/client/buttons/RouterButton";
import useStore from "@/store/dsStore";
import { IsFeaturePresent } from "@/functionalities/Utils";
import Dataset from "@/interfaces/DatasetInterface";
import { embedding_type } from "@/properties/types";


function AppNavbarDataQuality ()
{
    const router = useRouter();


    const [ opened, { toggle, close } ] = useDisclosure( false )
    const pathName = usePathname();
    const isActive = ( path: string ) => pathName === path;

    const datasetUsed = useStore( ( state ) => state.datasetUsed )
    const isDatasetUndefined = datasetUsed == undefined;

    const [ visualVisible, setVisualVisible ] = useState( false );
    const [ metricVisible, setMetricVisible ] = useState( false );
    const [ actionVisible, setActionVisible ] = useState( false );

    const searchParams = useSearchParams();
    const [ datasetName, setDatasetName ] = useState<string | null>( "" )
    const [ areEmbeddings, setAreEmbeddings ] = useState<boolean>( false )

    const [ showNotification, setShowNotification ] = useState<boolean>( false )
    const previousValue = useRef( datasetUsed );

    useEffect( () =>
    {
        if ( datasetUsed ) {
            const embeddings = IsFeaturePresent( datasetUsed as Dataset, embedding_type )
            setAreEmbeddings( embeddings )
        }
    }, [ datasetUsed ] )

    useEffect( () =>
    {
        if ( searchParams.get( "datasetName" ) ) {
            setDatasetName( searchParams.get( "datasetName" ) )
        }
    }, [ searchParams ] )

    const isMetricActive = ( metricName: string ) =>
    {
        return pathName === "/pages/dataquality/metrics" && searchParams.get( 'metric' ) === metricName;
    };

    const handleButtonClick = ( itemId: any ) =>
    {
        const params = new URLSearchParams( searchParams );
        params.set( 'metric', itemId );
        router.push( `/pages/dataquality/metrics?${params.toString()}` );
    };

    useEffect( () =>
    {
        console.log( "previous:", previousValue.current )
        console.log( "current:", datasetUsed )
        console.log( "equals??", previousValue.current !== datasetUsed )
        if ( previousValue.current !== datasetUsed ) {
            if ( !previousValue.current )
                console.log( "sono qui " )
            setShowNotification( false )
            setShowNotification( true );
            previousValue.current = datasetUsed;
            // Optionally auto-hide after some time
            setTimeout( () => setShowNotification( false ), 5000 ); // hide after 3s
        }
    }, [ datasetUsed ] );

    console.log( "shownotification", showNotification )

    useEffect( () =>
    {
        if ( pathName === '/pages/dataquality/embeddings'
            || pathName === '/pages/dataquality/prototypes' ) {
            setVisualVisible( true );
        } else if ( pathName === '/pages/dataquality/metrics/duplicates'
            || pathName === '/pages/dataquality/metrics/outliers'
            || pathName === '/pages/dataquality/metrics/completeness'
        ) {
            setMetricVisible( true )
        } else if ( pathName === '/pages/dataquality/actions/embeddings'
            || pathName === '/pages/dataquality/actions/cleanDuplicates' ) {
            setActionVisible( true )
        }

    }, [ pathName ] );

    return (
        <Box p="md" style={ { height: '100%' } }>
            <Stack h="100%" gap="md">
                <Box>
                    <Link href="/" style={ { textDecoration: 'none' } }>
                        <Button
                            leftSection={ <FontAwesomeIcon icon={ faDatabase } /> }
                            radius="xl"
                            variant={ isActive( "/" ) ? "filled" : "subtle" }
                        >
                            Datasets
                        </Button>
                    </Link>
                    <Space h="xs" />

                    <RouterButton name={ datasetUsed?.name } route={ "/pages/dataquality/datasets" }>
                        <div style={ { position: 'relative', display: 'inline-block' } }>
                            <Indicator disabled={ !showNotification } inline color="red" offset={ 6 } size={ 11 }>
                                <Button
                                    leftSection={ <FontAwesomeIcon icon={ faHouse } /> }
                                    radius="xl"
                                    variant={ isActive( "/pages/dataquality/datasets" ) ? "filled" : "subtle" }
                                    disabled={ isDatasetUndefined }
                                >
                                    Dataset Description
                                </Button>
                            </Indicator>
                            { isDatasetUndefined ? (
                                <Tooltip
                                    label="Choose a dataset"
                                    radius="md"
                                    withArrow
                                    position="top"
                                    multiline
                                    styles={ {
                                        tooltip: {
                                            width: "200px",
                                            textAlign: 'center',
                                            lineHeight: 1.3,
                                        }
                                    } }
                                >
                                    <div
                                        style={ {
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            cursor: "not-allowed"
                                        } }
                                        aria-hidden="true"
                                    />
                                </Tooltip> ) : null }

                        </div>
                    </RouterButton>

                </Box>


                <Divider />


                <Box>
                    <Group gap="xs" mb="xs" mr="xs">
                        <Button
                            className={ classes.navbar }
                            onClick={ () => setVisualVisible( ( prev ) => !prev ) }
                            rightSection={
                                visualVisible ? (
                                    <IconChevronDown size={ 18 } stroke={ 1.5 } />
                                ) : (
                                    <IconChevronRight size={ 18 } stroke={ 1.5 } />

                                )
                            }
                            pr={ 12 }
                            leftSection={
                                <FontAwesomeIcon
                                    icon={ faImage }
                                    size="sm"
                                    style={ { opacity: 0.6 } }
                                />
                            }
                        >
                            <Text size="sm" fw={ 600 } c="dimmed">
                                Visualization
                            </Text>
                        </Button>
                    </Group>

                    { visualVisible && (
                        <Stack mt="sm">
                            <Box >
                                <RouterButton name={ datasetName } route={ "/pages/dataquality/embeddings" }>
                                    <div style={ { position: 'relative', display: 'inline-block' } }>
                                        <Button
                                            radius="xl"
                                            variant={ isActive( "/pages/dataquality/embeddings" ) ? "filled" : "subtle" }
                                            disabled={ isDatasetUndefined || !areEmbeddings }
                                        >
                                            <Text size="sm" fw={ 600 } c="dimmed">
                                                Embeddings
                                            </Text>
                                        </Button>
                                        { isDatasetUndefined || !areEmbeddings ? (
                                            <Tooltip
                                                label="Choose a dataset or provide the embeddings"
                                                radius="md"
                                                withArrow
                                                position="top"
                                                multiline
                                                styles={ {
                                                    tooltip: {
                                                        width: "200px",
                                                        textAlign: 'center',
                                                        lineHeight: 1.3,
                                                    }
                                                } }
                                            >
                                                <div
                                                    style={ {
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        right: 0,
                                                        bottom: 0,
                                                        cursor: "not-allowed"
                                                    } }
                                                    aria-hidden="true"
                                                />
                                            </Tooltip> ) : null }

                                    </div>


                                </RouterButton>
                                <RouterButton name={ datasetName } route={ "/pages/dataquality/prototypes" }>
                                    <div style={ { position: 'relative', display: 'inline-block' } }>
                                        <Button
                                            radius="xl"
                                            variant={ isActive( "/pages/dataquality/prototypes" ) ? "filled" : "subtle" }
                                            disabled={ isDatasetUndefined || !areEmbeddings }
                                        >
                                            <Text size="sm" fw={ 600 } c="dimmed">
                                                Prototypes
                                            </Text>
                                        </Button>
                                        { isDatasetUndefined || !areEmbeddings ? (
                                            <Tooltip
                                                label="Choose a dataset or provide the embeddings"
                                                radius="md"
                                                withArrow
                                                position="top"
                                                multiline
                                                styles={ {
                                                    tooltip: {
                                                        width: "200px",
                                                        textAlign: 'center',
                                                        lineHeight: 1.3,
                                                    }
                                                } }
                                            >
                                                <div
                                                    style={ {
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        right: 0,
                                                        bottom: 0,
                                                        cursor: "not-allowed"
                                                    } }
                                                    aria-hidden="true"
                                                />
                                            </Tooltip> ) : null }
                                    </div>

                                </RouterButton>
                            </Box>
                        </Stack>
                    ) }
                </Box>

                <Box>
                    <Group gap="xs" mb="xs" mr="xs">
                        <Button
                            className={ classes.navbar }
                            onClick={ () => setMetricVisible( ( prev ) => !prev ) }
                            rightSection={
                                metricVisible ? (
                                    <IconChevronDown size={ 18 } stroke={ 1.5 } />
                                ) : (
                                    <IconChevronRight size={ 18 } stroke={ 1.5 } />

                                )
                            } pr={ 12 }
                            leftSection={ <FontAwesomeIcon icon={ faChartLine } size="sm" style={ { opacity: 0.6 } } /> }>
                            <Text size="sm" fw={ 600 } c="dimmed">
                                Metrics
                            </Text>
                        </Button>
                    </Group>

                    { metricVisible && (
                        <Stack mt="sm">
                            <Box>
                                {/*}
                                <RouterButton name={ datasetName } route={ "/pages/dataquality/metrics" }>
                                    <Button
                                        radius="xl"
                                        variant={ isActive( "/pages/dataquality/metrics" ) ? "filled" : "subtle" }
                                        disabled={ isDatasetUndefined }
                                    >
                                        <Text size="sm" fw={ 600 } c="dimmed">
                                            Metric Page
                                        </Text>
                                    </Button>
                                </RouterButton>
                                */}

                                <RouterButton name={ datasetName } route={ "/pages/dataquality/metrics/duplicates" }>
                                    <div style={ { position: 'relative', display: 'inline-block' } }>
                                        <Button
                                            radius="xl"
                                            variant={ isActive( "/pages/dataquality/metrics/duplicates" ) ? "filled" : "subtle" }
                                            disabled={ isDatasetUndefined || !areEmbeddings }
                                        >
                                            <Text size="sm" fw={ 600 } c="dimmed">
                                                Duplicates
                                            </Text>
                                        </Button>
                                        { isDatasetUndefined || !areEmbeddings ? (
                                            <Tooltip
                                                label="Choose a dataset or provide the embeddings"
                                                radius="md"
                                                withArrow
                                                position="top"
                                                multiline
                                                styles={ {
                                                    tooltip: {
                                                        width: "200px",
                                                        textAlign: 'center',
                                                        lineHeight: 1.3,
                                                    }
                                                } }
                                            >
                                                <div
                                                    style={ {
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        right: 0,
                                                        bottom: 0,
                                                        cursor: "not-allowed"
                                                    } }
                                                    aria-hidden="true"
                                                />
                                            </Tooltip> ) : null }
                                    </div>

                                </RouterButton>

                                <RouterButton name={ datasetName } route={ "/pages/dataquality/metrics/outliers" }>
                                    <div style={ { position: 'relative', display: 'inline-block' } }>
                                        <Button
                                            radius="xl"
                                            variant={ isActive( "/pages/dataquality/metrics/outliers" ) ? "filled" : "subtle" }
                                            disabled={ isDatasetUndefined || !areEmbeddings }
                                        >
                                            <Text size="sm" fw={ 600 } c="dimmed">
                                                Outliers
                                            </Text>
                                        </Button>
                                        { isDatasetUndefined || !areEmbeddings ? (
                                            <Tooltip
                                                label="Choose a dataset or provide the embeddings"
                                                radius="md"
                                                withArrow
                                                position="top"
                                                multiline
                                                styles={ {
                                                    tooltip: {
                                                        width: "200px",
                                                        textAlign: 'center',
                                                        lineHeight: 1.3,
                                                    }
                                                } }
                                            >
                                                <div
                                                    style={ {
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        right: 0,
                                                        bottom: 0,
                                                        cursor: "not-allowed"
                                                    } }
                                                    aria-hidden="true"
                                                />
                                            </Tooltip> ) : null }
                                    </div>
                                </RouterButton>

                                <RouterButton name={ datasetName } route={ "/pages/dataquality/metrics/completeness" }>
                                    <div style={ { position: 'relative', display: 'inline-block' } }>
                                        <Button
                                            radius="xl"
                                            variant={ isActive( "/pages/dataquality/metrics/completeness" ) ? "filled" : "subtle" }
                                            disabled={ isDatasetUndefined || !areEmbeddings }
                                        >
                                            <Text size="sm" fw={ 600 } c="dimmed">
                                                Completeness
                                            </Text>
                                        </Button>
                                        { isDatasetUndefined || !areEmbeddings ? (
                                            <Tooltip
                                                label="Choose a dataset or provide the embeddings"
                                                radius="md"
                                                withArrow
                                                position="top"
                                                multiline
                                                styles={ {
                                                    tooltip: {
                                                        width: "200px",
                                                        textAlign: 'center',
                                                        lineHeight: 1.3,
                                                    }
                                                } }
                                            >
                                                <div
                                                    style={ {
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        right: 0,
                                                        bottom: 0,
                                                        cursor: "not-allowed"
                                                    } }
                                                    aria-hidden="true"
                                                />
                                            </Tooltip>
                                        ) : null }
                                    </div>
                                </RouterButton>

                                {/*
                                <Button
                                    radius="xl"
                                    variant={ isMetricActive( "duplicates" ) ? "filled" : "subtle" }
                                    disabled={ isDatasetUndefined }
                                    onClick={ () => handleButtonClick( "duplicates" ) }
                                >
                                    <Text size="sm" fw={ 600 } c="dimmed">
                                        Duplicates
                                    </Text>
                                </Button>

                                <Button
                                    radius="xl"
                                    variant={ isMetricActive( "outliers" ) ? "filled" : "subtle" }
                                    disabled={ isDatasetUndefined }
                                    onClick={ () => handleButtonClick( "outliers" ) }
                                >
                                    <Text size="sm" fw={ 600 } c="dimmed">
                                        Outliers
                                    </Text>
                                </Button>
                                */}
                            </Box>
                        </Stack>
                    ) }
                </Box>


                <Box>
                    <Group gap="xs" mb="xs" mr="xs">
                        <Button
                            className={ classes.navbar }
                            onClick={ () => setActionVisible( ( prev ) => !prev ) }
                            rightSection={
                                actionVisible ? (
                                    <IconChevronDown size={ 18 } stroke={ 1.5 } />
                                ) : (
                                    <IconChevronRight size={ 18 } stroke={ 1.5 } />

                                )
                            }
                            leftSection={ <FontAwesomeIcon icon={ faBolt } size="sm" style={ { opacity: 0.6 } } /> }>
                            <Text size="sm" fw={ 600 } c="dimmed">
                                Actions
                            </Text>
                        </Button>
                    </Group>

                    { actionVisible && (
                        <Stack mt="sm">
                            <Box>
                                <RouterButton name={ datasetName } route={ "/pages/dataquality/actions/embeddings" }>
                                    <div style={ { position: 'relative', display: 'inline-block' } }>
                                        <Button
                                            radius="xl"
                                            variant={ isActive( "/pages/dataquality/actions/embeddings" ) ? "filled" : "subtle" }
                                            disabled={ isDatasetUndefined }
                                        >
                                            <Text size="sm" fw={ 600 } c="dimmed">
                                                Embedder
                                            </Text>
                                        </Button>
                                        { isDatasetUndefined ? (
                                            <Tooltip
                                                label="Choose a dataset"
                                                radius="md"
                                                withArrow
                                                position="top"
                                                multiline
                                                styles={ {
                                                    tooltip: {
                                                        width: "200px",
                                                        textAlign: 'center',
                                                        lineHeight: 1.3,
                                                    }
                                                } }
                                            >
                                                <div
                                                    style={ {
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        right: 0,
                                                        bottom: 0,
                                                        cursor: "not-allowed"
                                                    } }
                                                    aria-hidden="true"
                                                />
                                            </Tooltip> ) : null }
                                    </div>
                                </RouterButton>

                                <RouterButton name={ datasetName } route={ "/pages/dataquality/actions/cleanDuplicates" }>
                                    <div style={ { position: 'relative', display: 'inline-block' } }>
                                        <Button
                                            radius="xl"
                                            variant={ isActive( "/pages/dataquality/actions/cleanDuplicates" ) ? "filled" : "subtle" }
                                            disabled={ isDatasetUndefined || !areEmbeddings }
                                        >
                                            <Text size="sm" fw={ 600 } c="dimmed">
                                                Clean Duplicates
                                            </Text>
                                        </Button>
                                        { isDatasetUndefined ? (
                                            <Tooltip
                                                label="Choose a dataset or provide the embeddings"
                                                radius="md"
                                                withArrow
                                                position="top"
                                                multiline
                                                styles={ {
                                                    tooltip: {
                                                        width: "200px",
                                                        textAlign: 'center',
                                                        lineHeight: 1.3,
                                                    }
                                                } }
                                            >
                                                <div
                                                    style={ {
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        right: 0,
                                                        bottom: 0,
                                                        cursor: "not-allowed"
                                                    } }
                                                    aria-hidden="true"
                                                />
                                            </Tooltip> ) : null }
                                    </div>
                                </RouterButton>
                            </Box>
                        </Stack>
                    ) }
                </Box>
            </Stack>
        </Box>
    )
}

export default React.memo( AppNavbarDataQuality )