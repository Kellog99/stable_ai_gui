"use client";

import RouterButton from "@/components/client/buttons/RouterButton";
import { Box, Button, Flex, Loader, Select, Space } from "@mantine/core";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import classes from './page.module.css'
import useStore from '../../../store/dsStore';
import { image_type, label_type, text_type } from "@/properties/types";
import { getPrototypes } from "@/functionalities/Utils";
import FeatureDisplayer from "@/components/server/FeatureDisplayer";

interface PrototypesData
{
    data: any,
    label_data: number
}
interface Prototypes
{
    type: string,
    datas: PrototypesData[]
}

export default function Prototypes ()
{
    const searchParams = useSearchParams();
    const containerRef = useRef<HTMLDivElement>( null );

    const [ datasetName, setDatasetName ] = useState<string | null>( "" )
    const [ features, setFeatures ] = useState<string[]>( [] )
    const [ labelFeatures, setLabelFeatures ] = useState<string[]>( [] )
    const [ featureName, setFeatureName ] = useState<any>( "" )
    const [ labelFeatureName, setLabelFeatureName ] = useState<string>( "" )
    const [ prototypes, setPrototypes ] = useState<Prototypes | null>( null )
    const [ labelDict, setLabelDict ] = useState<{ [ key: number ]: string } | null>( null )
    const [ featureData, setFeatureData ] = useState<string[] | null>( null )
    const [ featureType, setFeatureType ] = useState<any>( "" )
    const [ labelData, setLabelData ] = useState<number[] | null>( null )
    const [ isLoading, setIsLoading ] = useState<boolean>( false )

    const datasetUsed = useStore( ( state ) => state.datasetUsed )

    useEffect( () =>
    {
        if ( searchParams.get( "datasetName" ) ) {
            setDatasetName( searchParams.get( "datasetName" ) )
        }
    }, [ searchParams ] )


    useEffect( () =>
    {
        if ( Array.isArray( datasetUsed?.features ) ) {
            const extractedFeatures = datasetUsed.features
                .filter( ( { type } ) => type === image_type || type === text_type )
                .map( ( { name } ) => name );

            const extractedlabelFeatures = datasetUsed.features
                .filter( ( { type } ) => type === label_type )
                .map( ( { name } ) => name );

            setFeatures( extractedFeatures );
            setLabelFeatures( extractedlabelFeatures )

            const labelFeature = datasetUsed.features.find( feature => feature.type === label_type );
            if ( labelFeature.label_dict ) {
                setLabelDict( labelFeature.label_dict )
            }

        }
    }, [ datasetUsed ] )


    useEffect( () =>
    {
        if ( featureName && labelFeatureName ) {
            setIsLoading( true );
            getPrototypes( datasetName as string, featureName, labelFeatureName )
                .then( fetchedData =>
                {
                    setPrototypes( fetchedData );

                } )
                .finally( () =>
                {
                    setIsLoading( false );
                } );
        }
    }, [ featureName, labelFeatureName ] );



    useEffect( () =>
    {
        if ( prototypes ) {
            setFeatureType( prototypes.type );
            const data = prototypes.datas.map( ( { data } ) => data );
            const labelData = prototypes.datas.map( ( { label_data } ) => label_data );
            setFeatureData( data )
            setLabelData( labelData )
        }

    }, [ prototypes ] )


    return (
        <div className="w-full h-screen">
            <div className="max-w-4xl mx-auto px-4">
                <Box className={ classes.title }>
                    <h1>Prototypes for { datasetName } dataset</h1>
                    <RouterButton name={ datasetName! } route={ "/pages/dataquality/datasets" }>
                        <Button>Go Back to Dataset Page</Button>
                    </RouterButton>
                </Box>
                <Space h="md" />
            </div>

            <div style={ { width: '300px', position: 'relative', marginBottom: '20px' } }>
                <Flex
                    direction="row"
                    gap="xs">

                    <Select
                        id="feature"
                        radius="md"
                        label="Feature"
                        placeholder="Choose feature to visualize"
                        data={ features }
                        value={ featureName }
                        onChange={ ( value ) => setFeatureName( value ) }
                        required={ true }
                    />

                    <Select
                        id="labelFeature"
                        radius="md"
                        label="Label Feature"
                        placeholder="Choose label"
                        data={ labelFeatures }
                        value={ labelFeatureName }
                        onChange={ ( value ) => setLabelFeatureName( value as string ) }
                        required={ true }
                    />
                </Flex>
            </div>
            { isLoading ? (
                <>
                    <Flex
                        mih={ 150 }
                        justify="center"
                        align="center"
                        direction="column"
                        wrap="wrap"
                        style={ { width: '100%' } }
                    >
                        <p>Loading...</p>
                        <Loader />
                    </Flex>
                </>
            ) : ( <>
                { prototypes && featureData && labelData ? (
                    <>
                        <Flex
                            mih={ 150 }
                            justify="center"
                            align="center"
                            direction="column"
                            wrap="wrap"
                            style={ { width: '100%' } }
                        >
                            <div ref={ containerRef } className="h-[600px] overflow-auto">
                                <FeatureDisplayer featureData={ featureData } featureType={ featureType } labelData={ labelData } label_dict={ labelDict as { [ key: number ]: string } } columnCount={ 4 } />
                            </div>
                        </Flex>

                    </>
                ) : (
                    <p>Select Feature and Label</p>
                ) }
            </> ) }

        </div>
    )
}