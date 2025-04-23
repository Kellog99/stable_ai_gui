"use client";

import { OutliersDTO } from "@/interfaces/metricsInterface";

import
{
    ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    TooltipProps,
} from 'recharts';

import { Center, Flex, Paper, RingProgress, Stack, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { FeatureDTO } from "@/interfaces/DatasetInterface";
import { useSearchParams } from "next/navigation";
import featureLoader from "@/functionalities/FeatureLoader";
import { image_type, text_type } from "@/properties/types";
import { FeatureCard } from "@/components/server/FeatureDisplayer";



interface DataPoint
{
    index: number;
    score: number;
    group: string;
}

export default function OutlierDisplayer ( props: { outliers: OutliersDTO } )
{
    const searchParams = useSearchParams();
    const { featureName, mode, score, indexes, score_per_sample } = props.outliers;

    const scoreRound = ( score * 100 ).toFixed( 1 )
    const [ feature, setFeature ] = useState<FeatureDTO | null>( null )
    const [ type, setType ] = useState( "" )
    const [ datasetName, setDatasetName ] = useState<string | null>( "" )
    const [clicked, setClicked] = useState<boolean>(false)
    const [outlierData, setOutlierData] = useState(null)

    useEffect( () =>
    {
        if ( searchParams.get( "datasetName" ) ) {
            setDatasetName( searchParams.get( "datasetName" ) );
        }
    }, [ searchParams ] );


    useEffect( () =>
    {
        if ( datasetName ) {
            const loadFeature = async () =>
            {
                try {
                    const featureLoaded = await featureLoader( datasetName, featureName );
                    console.log( "FEATURE LOADED:", featureLoaded );
                    if ( featureLoaded.type === image_type || featureLoaded.type === text_type ) {
                        setFeature( featureLoaded );
                        setType( featureLoaded.type )
                    }
                } catch ( error ) {
                    console.error( 'Error loading feature:', error );
                }
            };
            loadFeature();
        }
    }, [ datasetName ] );
    

    const outlierSet = new Set( indexes );

    const outliers: DataPoint[] = [];
    const inliers: DataPoint[] = [];

    score_per_sample.forEach( ( score, i ) =>
    {
        const isOutlier = outlierSet.has( i );
        const point = {
            index: i,
            score: score,
            group: isOutlier ? "Outlier" : "Inlier"
        };

        if ( isOutlier ) {
            outliers.push( point );
        } else {
            inliers.push( point );
        }
    } );


    const handlePointClick = ( data: any ) =>
    {
        console.log( 'Clicked point:', data );
        if (data) {
        setOutlierData(data)
        console.log("outlierData:", feature?.datas[data.index])
        setClicked(true)
    }
    };

    

    const CustomTooltip = ( { active, payload }: TooltipProps<number, string> ) =>
    {
        if ( active && payload && payload.length ) {
            const point = payload[ 0 ].payload as DataPoint;

            return (
                <Paper shadow="md" radius="md" p="sm" withBorder>
                    <Center>
                        <Text fw={ 600 } size="sm">{ point.group }</Text>
                    </Center>
                    <Text size="sm">
                        Index: { point.index }
                    </Text>
                    <Text size="sm">
                        Score: { point.score.toFixed( 3 ) }
                    </Text>
                </Paper>
            );
        }
        return null;
    };



    return (
        <>
            <Flex
                direction="column"
                align="center">
                <h3>Score computed on { featureName } with { mode } mode</h3>

                <RingProgress
                    size={ 180 }
                    roundCaps
                    sections={ [ { value: score * 100, color: 'green' } ] }
                    transitionDuration={ 1000 }
                    label={ <Text ta="center" fw={ 700 } size="lg">{ scoreRound }%</Text> }
                />

                <ResponsiveContainer width="100%" height={ 400 }>
                    <ScatterChart margin={ { top: 20, right: 20, bottom: 20, left: 20 } }>
                        <CartesianGrid stroke="#dee2e6" strokeDasharray="3 3" />
                        <XAxis
                            type="number"
                            dataKey="index"
                            name="Index"
                            domain={ [ 'dataMin', 'dataMax' ] }
                            axisLine={ false }
                            tickLine={ false }
                            tick={ { fill: '#868e96', fontSize: 12 } }
                        />
                        <YAxis
                            type="number"
                            dataKey="score"
                            name="Score"
                            label={ {
                                value: 'Score',
                                angle: -90,
                                position: 'insideLeft',
                                fill: '#868e96',
                                fontSize: 14,
                            } }
                            axisLine={ false }
                            tickLine={ false }
                            tick={ { fill: '#868e96', fontSize: 12 } }
                        />
                        <Tooltip content={ <CustomTooltip /> } />
                        <Legend />

                        <Scatter
                            name="Inliers"
                            data={ inliers }
                            fill="#228be6"
                            onClick={ handlePointClick }
                        />
                        <Scatter
                            name="Outliers"
                            data={ outliers }
                            fill="#fa5252"
                            onClick={ handlePointClick }
                        />
                    </ScatterChart>
                </ResponsiveContainer>

                {clicked && feature? (
                    <FeatureCard data={feature?.datas[outlierData?.index]} featureType={ type }/>
                ) : null}
            </Flex>
        </>
    )

}