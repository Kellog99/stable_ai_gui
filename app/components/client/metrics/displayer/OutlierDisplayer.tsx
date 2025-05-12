"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import
    {
        Chart as ChartJS,
        LinearScale,
        PointElement,
        LineElement,
        Tooltip,
        Legend,
        ChartOptions,
        ChartData,
        InteractionItem,
    } from 'chart.js';
import { Scatter, getElementAtEvent } from 'react-chartjs-2';
import { Flex, RingProgress, Text, Image, Box, Card, Group, Badge, Button, CloseButton } from "@mantine/core";

import { OutliersDTO } from "@/interfaces/metricsInterface";
import { FeatureDTO } from "@/interfaces/DatasetInterface";
import featureLoader from "@/functionalities/FeatureLoader";
import { image_type, text_type } from "@/properties/types";
import FeatureDisplayer, { FeatureCard } from '@/components/client/FeatureDisplayer';


ChartJS.register( LinearScale, PointElement, LineElement, Tooltip, Legend );


interface DataPoint
{
    index: number;
    score: number;
    group: string;
}

interface ChartJsPoint
{
    x: number;
    y: number;
    originalData: DataPoint;
}

function OutlierDisplayer ( { outliers: outliersProp }: { outliers: OutliersDTO } )
{
    const searchParams = useSearchParams();
    const { featureName, mode, score, indexes, score_per_sample } = outliersProp;

    const scoreRound = ( score * 100 ).toFixed( 1 );
    const [ feature, setFeature ] = useState<FeatureDTO | null>( null );
    const [ type, setType ] = useState( "" );
    const [ datasetName, setDatasetName ] = useState<string | null>( "" );

    const [ clickedOutlierData, setClickedOutlierData ] = useState<DataPoint | null>( null );
    const [ clicked, setClicked ] = useState<boolean>( false )
    const [ showAll, setShowAll ] = useState<boolean>( false )
    const [ outlierSel, setOutlierSel ] = useState<string>( "" )

    const [ allOutliers, setAllOutliers ] = useState<string[]>( [] )
    const [ allScores, setAllScores ] = useState<number[]>( [] )
    const [ allGroups, setAllGroups ] = useState<string[]>( [] )



    const chartRef = React.useRef<ChartJS<'scatter'>>( null );
    const containerRef = React.useRef<HTMLDivElement>( null );


    const maxIndex = useMemo( () =>
    {
        return score_per_sample ? score_per_sample.length - 1 : 0;
    }, [ score_per_sample ] );

    useEffect( () =>
    {
        if ( searchParams.get( "datasetName" ) ) {
            setDatasetName( searchParams.get( "datasetName" ) );
        }
    }, [ searchParams ] );


    useEffect( () =>
    {
        if ( datasetName && featureName ) {
            const loadFeature = async () =>
            {
                try {
                    const featureLoaded = await featureLoader( datasetName, featureName );
                    console.log( "FEATURE LOADED:", featureLoaded );
                    if ( featureLoaded.type === image_type || featureLoaded.type === text_type ) {
                        setFeature( featureLoaded );
                        setType( featureLoaded.type );
                    }
                } catch ( error ) {
                    console.error( 'Error loading feature:', error );
                }
            };
            loadFeature();
        }
    }, [ datasetName, featureName ] );

    useEffect( () =>
    {
        if ( feature?.datas && clickedOutlierData?.index !== undefined ) {
            const index = clickedOutlierData.index;
            if ( index >= 0 && index < feature.datas.length ) {
                setOutlierSel( feature.datas[ index ] );
            }
        }
    }, [ feature, clickedOutlierData ] );

    const chartData = useMemo<ChartData<'scatter', ChartJsPoint[]>>( () =>
    {
        const outlierSet = new Set( indexes );
        const inliersPoints: ChartJsPoint[] = [];
        const outliersPoints: ChartJsPoint[] = [];

        score_per_sample.forEach( ( sampleScore, i ) =>
        {
            const isOutlier = outlierSet.has( i );
            const originalData: DataPoint = {
                index: i,
                score: sampleScore,
                group: isOutlier ? "Outlier" : "Inlier",
            };
            const point: ChartJsPoint = {
                x: i,
                y: sampleScore,
                originalData: originalData,
            };

            if ( isOutlier ) {
                outliersPoints.push( point );


            } else {
                inliersPoints.push( point );
            }
        } );


        const allScoresOut: number[] = outliersPoints.map( point => point.originalData.score );
        setAllScores( allScoresOut )
        const allGroupsOut: string[] = outliersPoints.map( point => point.originalData.group );
        setAllGroups( allGroupsOut )



        return {
            datasets: [
                {
                    label: 'Inliers',
                    data: inliersPoints,
                    backgroundColor: '#228be6',
                    pointRadius: 4,
                    pointHoverRadius: 6,
                },
                {
                    label: 'Outliers',
                    data: outliersPoints,
                    backgroundColor: '#fa5252',
                    pointRadius: 5,
                    pointHoverRadius: 7,
                },
            ],
        };
    }, [ score_per_sample, indexes ] );


    const handlePointClick = ( event: React.MouseEvent<HTMLCanvasElement> ) =>
    {
        const chart = chartRef.current;
        if ( !chart ) {
            return;
        }

        const elements: InteractionItem[] = getElementAtEvent( chart, event );

        if ( elements.length > 0 ) {
            const firstElement = elements[ 0 ];
            const datasetIndex = firstElement.datasetIndex;
            const index = firstElement.index;
            const clickedPointData = chart.data.datasets[ datasetIndex ].data[ index ] as ChartJsPoint;
            setTimeout( () =>
            {
                if ( clickedPointData && clickedPointData.originalData ) {
                    setClicked( true )
                    console.log( 'Clicked point (Chart.js):', clickedPointData.originalData );
                    setClickedOutlierData( clickedPointData.originalData );

                } else {
                    setClickedOutlierData( null );
                }
            }, 10 );
        }
    };

    const handleShowAll = () =>
    {

        const indicesFlat = indexes.flat()
        const allOutliersList: string[] = indicesFlat.map( i => feature?.datas[ i ] ).filter( Boolean );
        setAllOutliers( allOutliersList )
        setShowAll( !showAll )
        setClicked( false )
    }

    const maxScore = useMemo( () =>
    {
        if ( !score_per_sample || score_per_sample.length === 0 ) return 1;
        return Math.max( ...score_per_sample ) * 1.05; // Add 5% padding at the top
    }, [ score_per_sample ] );

    const minScore = useMemo( () =>
    {
        if ( !score_per_sample || score_per_sample.length === 0 ) return 1;
        return Math.min( ...score_per_sample ) * 1.05; // Add 5% padding at the bottom
    }, [ score_per_sample ] );


    const options = useMemo<ChartOptions<'scatter'>>( () => ( {
        responsive: true,
        maintainAspectRatio: false,
        responsiveAnimationDuration: 0,
        onHover: ( event: any, chartElement: any[] ) =>
        {
            const canvas = event?.native?.target as HTMLCanvasElement | null;
            if ( canvas ) {
                canvas.style.cursor = chartElement.length ? 'pointer' : 'default';
            }
        },

        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    boxWidth: 10,
                    padding: 10,
                    font: {
                        size: 12
                    }
                }
            },
            tooltip: {
                enabled: true,
                callbacks: {
                    label: function ( context )
                    {
                        const pointData = context.raw as ChartJsPoint;
                        if ( pointData && pointData.originalData ) {
                            const orig = pointData.originalData;
                            return [
                                `Group: ${orig.group}`,
                                `Index: ${orig.index}`,
                                `Score: ${orig.score.toFixed( 3 )}`
                            ];
                        }
                        return `Index: ${context.parsed.x}, Score: ${context.parsed.y.toFixed( 3 )}`;
                    },
                },
            },
        },
        scales: {
            x: {
                type: 'linear',
                position: 'bottom',
                title: {
                    display: true,
                    text: 'Index',
                    color: '#868e96',
                    font: { size: 14 }
                },
                grid: {
                    color: '#dee2e6',
                    borderDash: [ 2, 4 ], // Dotted line pattern for grid
                    lineWidth: 1
                },
                border: {
                    dash: [ 2, 4 ],
                    width: 1,
                    color: '#868e96'
                },
                ticks: {
                    color: '#868e96',
                    font: { size: 12 },
                    maxRotation: 0,
                    autoSkip: true,
                    maxTicksLimit: 10
                },
                min: 0,
                max: maxIndex,
                afterDataLimits: ( scale ) =>
                {
                    scale.max = maxIndex;
                    scale.min = 0;
                }
            },
            y: {
                type: 'linear',
                title: {
                    display: true,
                    text: 'Score',
                    color: '#868e96',
                    font: { size: 14 }
                },
                grid: {
                    color: '#dee2e6',
                    borderDash: [ 2, 4 ],
                    lineWidth: 1
                },
                border: {
                    dash: [ 2, 4 ],
                    width: 1,
                    color: '#868e96'
                },
                ticks: {
                    color: '#868e96',
                    font: { size: 12 },
                    autoSkip: true,
                    maxTicksLimit: 8
                },
                min: minScore,
                max: maxScore,
                afterDataLimits: ( scale ) =>
                {
                    scale.max = maxScore;
                    scale.min = minScore;
                }
            },
        },
        parsing: false,
        normalized: true,
        spanGaps: false,
        interaction: {
            mode: 'nearest' as const,
            axis: 'xy' as const,
            intersect: true,
        },
    } ), [ maxIndex, maxScore ] );

    useEffect( () =>
    {
        const handleResize = () =>
        {
            if ( chartRef.current ) {
                chartRef.current.resize();
            }
        };

        window.addEventListener( 'resize', handleResize );
        return () =>
        {
            window.removeEventListener( 'resize', handleResize );
        };
    }, [] );

    return (
        <Flex direction="column" align="center" style={ { width: '100%', maxWidth: '100%' } }>
            <h3>Score computed on { featureName } with { mode } mode</h3>
            <RingProgress
                size={ 180 }
                roundCaps
                sections={ [ { value: score * 100, color: 'green' } ] }
                transitionDuration={ 1000 }
                label={ <Text ta="center" fw={ 700 } size="lg">{ scoreRound }%</Text> }
            />

            <Box
                ref={ containerRef }
                style={ {
                    width: '100%',
                    maxWidth: '100%',
                    height: '400px',
                    marginTop: '20px',
                    position: 'relative',
                    overflow: 'hidden'
                } }
            >
                <Scatter
                    ref={ chartRef }
                    options={ options }
                    data={ chartData }
                    onClick={ handlePointClick }
                    style={ { maxWidth: '100%', maxHeight: '100%' } }
                />

            </Box>

            <Button onClick={ handleShowAll }>
                { showAll ? "Hide outliers" : "Show all outliers" }
            </Button>

            <Box
                ref={ containerRef }
                style={ {
                    maxWidth: '100%',
                    marginTop: '20px',
                    position: 'relative',
                    overflow: 'hidden'
                } }
            >

                { clicked && outlierSel !== "" ? (
                    <>
                        <Box style={ { width: "260px", position: "relative" } }>
                            <CloseButton
                                style={ {
                                    position: 'absolute',
                                    top: 8,
                                    right: 8,
                                    zIndex: 1,
                                } }
                                onClick={ () => setClicked( false ) }
                            />
                            <FeatureCard
                                data={ outlierSel }
                                featureType={ type }
                                outlier={ clickedOutlierData?.group }
                                score={ clickedOutlierData?.score }
                            />
                        </Box>
                    </> ) : null }

                { showAll ? (
                    <FeatureDisplayer featureData={ allOutliers } featureType={ type } outliers={ allGroups } scores={ allScores } columns={ 4 } />
                ) : null }
            </Box>
        </Flex>
    );
}

export default OutlierDisplayer;