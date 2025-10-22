"use client"

import FeatureDisplayer from "@/components/client/FeatureDisplayerFINAL";
import PDFPreviewModal from "@/components/client/ReportModal";
import SchemaShower from "@/components/client/SchemaShower";
import { FeatureSchema } from "@/interfaces/genericInterface";
import useStore from "@/store/dsStore";
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Button, Flex, Group, Paper, ScrollArea, Stack, Text, Title, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { InfoCircle } from "@vectopus/atlas-icons-react";
import { CheckCircle, MoveDown, MoveUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import '@mantine/charts/styles.css';

import { AlertCust } from "@/components/client/AlertCustom";
import { BarChartCustom } from "@/components/client/BarChart";
import { MetricResume } from "@/components/client/metrics/displayer/MetricResume";
import { labelColorMapType } from "@/properties/static";

export default function Report ()
{

    const report = useStore( ( state ) => state.report )
    const setReport = useStore( ( state ) => state.setReport )

    const [ features, setFeatures ] = useState<FeatureSchema[]>( [] )
    const [ connections, setConnections ] = useState<[ string, string ][]>( [] )
    const datasetUsed = useStore( ( state ) => state.datasetUsed )
    const [ descriptions, setDescriptions ] = useState<string[]>( [] )

    const [ outIndexes, setOutIndexes ] = useState<number[]>( [] )

    const prototypesData = useStore( ( state ) => state.prototypesData )
    const labelProtoData = useStore( ( state ) => state.labelProtoData )
    const protoType = datasetUsed?.prototype.type

    const labelToSamples = useStore( ( state ) => state.labelToSamples )

    const [ reportOpen, { open, close } ] = useDisclosure( false );

    const labelDict = useStore( ( state ) => state.labelDict )

    const showOverview = useStore( ( state ) => state.showOverview )
    const setShowOverview = useStore( ( state ) => state.setShowOverview )

    const [ showAccuracyCard, setShowAccuracyCard ] = useState<boolean>( true )

    useEffect( () =>
    {
        if ( datasetUsed ) {
            setConnections( datasetUsed.edges );

            const allDescriptions: string[] = [];

            if ( datasetUsed.description ) {
                allDescriptions.push( datasetUsed.description );
            }

            if ( Array.isArray( datasetUsed?.features ) ) {
                const extractedFeatures = datasetUsed.features.map( ( { type, name, depth } ) => ( {
                    type,
                    name,
                    depth,
                } ) );

                setFeatures( extractedFeatures );

                const featuresDescriptions = datasetUsed.features.map( ( { description } ) => ( {
                    description
                } ) );

                const filtered: string[] = featuresDescriptions
                    .map( ( { description } ) => description )
                    .filter( ( desc ): desc is string => typeof desc === 'string' );

                allDescriptions.push( ...filtered );
                setDescriptions( allDescriptions );
            }
        }
    }, [ datasetUsed ] );


    const originalAccuracyItems = useRef<Object[]>( [] );

    useEffect( () =>
    {
        // Save items that were originally at positions where name === "accuracy"
        const accuracyItems = report.filter( item => item.results.name === "accuracy" );
        originalAccuracyItems.current = accuracyItems;

        // Reorder the list
        const reordered = [
            ...accuracyItems,
            ...report.filter( item => item.results.name !== "accuracy" ),
        ];
        setReport( reordered );
    }, [] );

    useEffect( () =>
    {
        const currentIndexes = report.map( ( item, index ) =>
        {
            return originalAccuracyItems.current.includes( item ) ? index : -1;
        } ).filter( index => index !== -1 );

        setOutIndexes( currentIndexes );
    }, [ report ] );

    useEffect( () =>
    {

    }, [] )


    const handleMoveOutUp = ( indexes: number[] ) =>
    {
        if ( indexes.length === 0 ) return;
        const sortedIndexes = [ ...indexes ].sort( ( a, b ) => a - b );

        const insertBefore = Math.max( sortedIndexes[ 0 ] - 1, 0 );

        const block = sortedIndexes.map( i => report[ i ] );

        const remaining = report.filter( ( _, idx ) => !sortedIndexes.includes( idx ) );

        const newReport = [
            ...remaining.slice( 0, insertBefore ),
            ...block,
            ...remaining.slice( insertBefore ),
        ];

        setReport( newReport );
    };

    const handleMoveOutDown = ( indexes: number[] ) =>
    {
        if ( indexes.length === 0 ) return;

        const sortedIndexes = [ ...indexes ].sort( ( a, b ) => a - b );

        const lastIndex = report.length - 1;
        if ( sortedIndexes[ sortedIndexes.length - 1 ] === lastIndex ) return;

        const block = sortedIndexes.map( i => report[ i ] );

        const remaining = report.filter( ( _, idx ) => !sortedIndexes.includes( idx ) );

        const insertPos = sortedIndexes[ sortedIndexes.length - 1 ] + 1;

        const newReport = [
            ...remaining.slice( 0, insertPos ),
            ...block,
            ...remaining.slice( insertPos ),
        ];

        setReport( newReport );
    };

    const handleCancelOut = ( indexes: number[] ) =>
    {
        const newReport = report.filter( ( _, index ) => !indexes.includes( index ) );
        setReport( newReport );
        setShowAccuracyCard( false )
    };

    return (
        <>
            <Flex direction="row" justify="space-between" pb="md">
                <span style={ { display: 'flex', alignItems: 'center', gap: "8px" } }>
                    <Title order={ 2 }>Report Brief</Title>
                    <Tooltip
                        multiline
                        w={ 220 }
                        withArrow
                        transitionProps={ { duration: 200 } }
                        label="Here you can adjust your final report: you can eventually eliminate some sections and metrics or also re-order them">
                        <InfoCircle size={ 17 } color="white" />
                    </Tooltip>
                </span>
                <Flex direction="row" gap="sm">
                    <Button
                        radius="lg"
                        onClick={ open }
                        disabled={ report.length === 0 }
                    >
                        Show PDF Preview
                    </Button>

                    <PDFPreviewModal opened={ reportOpen } close={ close } />
                </Flex>
            </Flex>
            <Flex direction="column" gap="md" justify="center" align="flex-start">
                { showOverview ? (
                    <>
                        <Box style={ { border: '1px solid #e0e0e0', borderRadius: 4, padding: "15px" } } mb="md">
                            <span style={ { display: 'flex', alignItems: 'center', gap: "8px" } }>
                                <Title order={ 3 }>Overview Dataset</Title>
                                <Tooltip
                                    multiline
                                    withArrow
                                    transitionProps={ { duration: 200 } }
                                    label="Eliminate section from report">
                                    <Button
                                        variant="transparent"
                                        radius="xl"
                                        size="xs"
                                        onMouseDown={ ( e ) => e.stopPropagation() }
                                        onClick={ () => { setShowOverview( false ) } }
                                        style={ {
                                            transition: "background-color 0.2s ease",
                                        } }
                                        onMouseEnter={ ( e ) => e.currentTarget.style.backgroundColor = "#FCA5A5" } // Lighter red
                                        onMouseLeave={ ( e ) => e.currentTarget.style.backgroundColor = "transparent" }
                                    >
                                        <FontAwesomeIcon icon={ faTrashCan } />
                                    </Button>
                                </Tooltip>
                            </span>
                            <SchemaShower
                                features={ features }
                                connections={ connections }
                                labelColorMap={ labelColorMapType }
                                clickable={ false }
                            />

                            <Box style={ { marginBottom: '70px' } }>
                                <Text>
                                    <span style={ { fontWeight: 600 } }>
                                        { datasetUsed?.name || "" }
                                    </span>{ " " }
                                    is a dataset for { datasetUsed?.task || "" }.
                                    { datasetUsed?.n_classes ? (
                                        <> { " " } It has { datasetUsed?.n_classes || "" } classes and { datasetUsed?.n_samples } samples.{ " " }</>
                                    ) : (
                                        <>It has { datasetUsed?.n_samples }{ " " }</>
                                    ) }
                                    { descriptions?.map( ( description, index ) => (
                                        <span key={ index }>{ description } </span>
                                    ) ) }
                                </Text>
                            </Box>
                            <Title order={ 4 } mb="sm">Prototypes Preview</Title>
                            <ScrollArea >
                                { prototypesData ? ( <Flex
                                    mih={ 150 }
                                    justify="center"
                                    align="center"
                                    direction="column"
                                    wrap="wrap"
                                    style={ { width: '100%' } }
                                >
                                    <div className="overflow-auto">
                                        <FeatureDisplayer featureData={ prototypesData as string[] } featureType={ protoType as string } labelData={ labelProtoData as number[] } label_dict={ labelDict as { [ key: number ]: string } } columns={ 4 } />
                                    </div>
                                </Flex> ) : (
                                    <AlertCust result={ "warning" } textToDisplay={ "In order to see the preview of the prototypes you need to first compute them on the dedicated page. Otherwise you can see them on the PDF preview." } />
                                ) }
                            </ScrollArea>

                            { labelToSamples.length > 0 ? (
                                <>
                                    <Title order={ 4 } mt="md" mb="md">Graph Section</Title>
                                    <div style={ { width: '1000px', margin: '20px auto' } }>

                                        <Box
                                            style={ {
                                                marginLeft: "30px",
                                                marginRight: "30px",
                                                overflowX: 'auto',
                                                overflowY: 'hidden',
                                                maxWidth: '100%',
                                            } }
                                        >
                                            <BarChartCustom
                                                data={ labelToSamples }
                                                keyL="labels" />
                                        </Box>
                                    </div>
                                </> ) : null }
                        </Box>
                    </> ) : (
                    <>
                        <Button
                            variant="light"
                            onClick={ () => setShowOverview( true ) }>
                            Restore Overview
                        </Button>
                    </>
                ) }
                <Box style={ { border: '1px solid #e0e0e0', borderRadius: 4, padding: "15px" } } mt="md">
                    <span style={ { display: 'flex', alignItems: 'center', gap: "8px", marginBottom: "8px" } } >
                        <Title order={ 3 }>Metrics</Title>
                    </span>
                    <>
                        { report.map( ( metric, index ) =>
                        {
                            if ( metric.results.name === "accuracy" ) {
                                
                                const firstAccuracyIndex = report.findIndex( m => m.results.name === "accuracy" );
                                if ( index !== firstAccuracyIndex ) {
                                    return null;
                                }

                                if ( !showAccuracyCard ) return null;

                                const accuracyMetrics = report.filter( m => m.results.name === "accuracy" );
                                const accuracyIndexes = report
                                    .map( ( m, i ) => ( { metric: m, index: i } ) )
                                    .filter( ( { metric } ) => metric.results.name === "accuracy" )
                                    .map( ( { index } ) => index );
                                return (
                                    <Flex key={ `accuracy-block-${index}` } direction="row" align="center" justify="flex-start">
                                        <Paper
                                            shadow="sm"
                                            p="lg"
                                            radius="md"
                                            withBorder
                                            style={ {
                                                background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
                                                border: '1px solid #e9ecef',
                                                transition: 'all 0.2s ease',
                                                marginBottom: "8px"
                                            } }
                                            className="hover:shadow-lg hover:scale-[1.01] cursor-pointer"
                                        >
                                            <Stack gap="md">
                                                <Group justify="space-between" align="flex-start">
                                                    <Group gap="sm" align="center" mb="sm">
                                                        <CheckCircle size={ 20 } style={ { color: '#228be6' } } />
                                                        <Text fw={ 700 } size="lg" c="dark.7">Accuracy</Text>
                                                    </Group>
                                                </Group>
                                            </Stack>

                                            {/* Render all accuracy metrics */ }
                                            { accuracyMetrics.map( ( accuracyMetric, accuracyIndex ) => (
                                                <MetricResume
                                                    key={ `accuracy-metric-${accuracyIndex}` }
                                                    metric={ accuracyMetric as any }
                                                    index={ report.findIndex( m => m === accuracyMetric ) }
                                                    outIndexes={ outIndexes }
                                                />
                                            ) ) }
                                        </Paper>

                                        { firstAccuracyIndex > 0 && (
                                            <Tooltip
                                                multiline
                                                withArrow
                                                transitionProps={ { duration: 200 } }
                                                label="Move the metric up">
                                                <Button
                                                    variant="transparent"
                                                    radius="xl"
                                                    size="xs"
                                                    onClick={ () => handleMoveOutUp( accuracyIndexes ) }
                                                    style={ {
                                                        transition: "background-color 0.2s ease",
                                                    } }
                                                    onMouseEnter={ ( e ) => ( e.currentTarget.style.backgroundColor = "#a5d8ff" ) }
                                                    onMouseLeave={ ( e ) => ( e.currentTarget.style.backgroundColor = "transparent" ) }
                                                >
                                                    <MoveUp size={ 14 } />
                                                </Button>
                                            </Tooltip>
                                        ) }

                                        { accuracyIndexes[ accuracyIndexes.length - 1 ] < report.length - 1 && (
                                            <Tooltip
                                                multiline
                                                withArrow
                                                transitionProps={ { duration: 200 } }
                                                label="Move the metric down">
                                                <Button
                                                    variant="transparent"
                                                    radius="xl"
                                                    size="xs"
                                                    onClick={ () => handleMoveOutDown( accuracyIndexes ) }
                                                    style={ {
                                                        transition: "background-color 0.2s ease",
                                                    } }
                                                    onMouseEnter={ ( e ) => e.currentTarget.style.backgroundColor = "#a5d8ff" }
                                                    onMouseLeave={ ( e ) => e.currentTarget.style.backgroundColor = "transparent" }
                                                >
                                                    <MoveDown size={ 14 } />
                                                </Button>
                                            </Tooltip>
                                        ) }

                                        <Tooltip
                                            multiline
                                            withArrow
                                            transitionProps={ { duration: 200 } }
                                            label="Eliminate metric from report">
                                            <Button
                                                variant="transparent"
                                                radius="xl"
                                                size="xs"
                                                onClick={ () => handleCancelOut( accuracyIndexes ) }
                                                style={ {
                                                    transition: "background-color 0.2s ease",
                                                } }
                                                disabled={ report.length === accuracyIndexes.length }
                                                onMouseLeave={ ( e ) => e.currentTarget.style.backgroundColor = "transparent" }
                                            >
                                                <FontAwesomeIcon icon={ faTrashCan } />
                                            </Button>
                                        </Tooltip>
                                    </Flex>
                                );
                            } else {
                                return (
                                    <MetricResume
                                        key={ `other-${index}` }
                                        metric={ metric as any }
                                        index={ index }
                                        outIndexes={ outIndexes } />
                                );
                            }
                        } ) }
                    </>
                </Box>
            </Flex>
        </>
    )
}