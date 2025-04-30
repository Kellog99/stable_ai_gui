"use client";

import ScatterPlotVisualization from '../../../components/client/ScatterPlotVisualization';
import { useSearchParams } from 'next/navigation';
import { Suspense, useState, useEffect, useRef } from 'react';
import { Autocomplete, Flex, Button, Text, Box, Space, Select } from '@mantine/core';
import { FixedSizeGrid, GridChildComponentProps } from "react-window";
import featureLoader from '../../../functionalities/FeatureLoader';
import useStore from '../../../store/dsStore';
import LassoDrawer from '@/components/client/Lasso';
import RouterButton from '@/components/client/buttons/RouterButton';
import classes from './page.module.css'
import FeatureDisplayer, { FeatureCard } from '@/components/server/FeatureDisplayer';
import { image_type, label_type, text_type } from '@/properties/types';

interface Feature
{

  type: string;
  name: string;
  datas: any[];
  is_logic: boolean

}

function Home ()
{

  const searchParams = useSearchParams();
  const [ feature, setFeature ] = useState<Feature | null>( null )
  const [ featureData, setFeatureData ] = useState<string[]>( [] )
  const [ labelFeature, setLabelFeature ] = useState<Feature | null>( null )
  const [ labelDict, setLabelDict ] = useState<{ [ key: number ]: string } | null>( null )
  const [ labelData, setLabelData ] = useState<number[]>( [] )
  const [ featureType, setFeatureType ] = useState<any>( "" )
  const [ labelFeatureType, setLabelFeatureType ] = useState<any>( "" )
  const [ featureName, setFeatureName ] = useState<any>( "" )
  const [ labelFeatureName, setLabelFeatureName ] = useState<string>( "" )

  const [ features, setFeatures ] = useState<string[]>( [] )
  const [ labelFeatures, setLabelFeatures ] = useState<string[]>( [] )
  const [ datasetName, setDatasetName ] = useState<string | null>( "" )

  const containerRef = useRef<HTMLDivElement>( null );
  const indexes = useStore( ( state ) => state.selectedIndexes );
  const datasetUsed = useStore( ( state ) => state.datasetUsed )
  const isLoadingEmbs = useStore( ( state ) => state.isLoadingEmbs )

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
      console.log( features )
      console.log( labelFeatures )
    }
  }, [ datasetUsed ] )

  console.log( "PAGE", datasetUsed )
  console.log( "PAGE", features )
  console.log( "PAGE", labelFeatures )

  useEffect( () =>
  {
    if ( searchParams.get( "datasetName" ) ) {
      setDatasetName( searchParams.get( "datasetName" ) )
    }
  }, [ searchParams ] )




  useEffect( () =>
  {
    // Only proceed if featureName is not an empty string
    if ( featureName != "" ) {
      const loadFeature = async () =>
      {
        try {
          if ( datasetName && featureName ) {
            const feature = await featureLoader( datasetName, featureName );
            console.log( feature );
            setFeature( feature );
            setFeatureType( feature.type )
          }
        } catch ( error ) {
          console.error( 'Error loading feature:', error );
        }
      };
      loadFeature();

    }
  }, [ featureName ] ); // Still keep indexes and featureName in the dependency array

  useEffect( () =>
  {
    // Only proceed if featureName is not an empty string
    if ( labelFeatureName != "" ) {
      const loadFeature = async () =>
      {
        try {
          if ( datasetName && labelFeatureName ) {
            const labelFeature = await featureLoader( datasetName, labelFeatureName );
            console.log( "FETCHING", labelFeature );
            setLabelFeature( labelFeature );
            setLabelFeatureType( labelFeature.type )
            if ( labelFeature.label_dict ) {
              setLabelDict( labelFeature.label_dict )
            }
          }
        } catch ( error ) {
          console.error( 'Error loading feature:', error );
        }
      };
      loadFeature();

    }
  }, [ labelFeatureName ] ); // Still keep indexes and featureName in the dependency array

  console.log( "LABEL FEATURE:", labelFeature )

  useEffect( () =>
  {
    // Only proceed if indexes is not null
    if ( indexes != null && feature != null ) {
      const filterFeature = async () =>
      {
        try {
          let filteredArr: any[] = [];
          let filteredLabel: any[] = [];

          indexes.forEach( index =>
          {
            filteredArr.push( feature.datas[ index ] );
            if ( labelFeature != null ) {
              filteredLabel.push( labelFeature.datas[ index ] )
            }
          } );
          console.log( "DATA", feature.datas )
          setFeatureData( filteredArr )
          if ( labelFeature != null ) {
            setLabelData( filteredLabel )
          }

        } catch ( error ) {
          console.error( 'Error loading feature:', error );
        }
      };

      filterFeature();
    }
  }, [ indexes ] ); // Still keep indexes and featureName in the dependency array



  console.log( "LABEL DATA:", labelData )
  console.log( "FEATURE DATA", feature )
  console.log( "FILTERED", featureData )


  console.log( "indexes:", indexes )



  return (
    <div className="w-full h-screen">
      {/* Centered content section */ }
      <div className="max-w-4xl mx-auto px-4">
        <Box className={ classes.title }>
          <h1>Embeddings for { datasetName } dataset</h1>
          {/*
          <RouterButton name={ datasetName! } route={ "/pages/dataquality/datasets" }>
            <Button>Go Back to Dataset Page</Button>
          </RouterButton>
          */}
        </Box>
        <Space h="md" />


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
              onClear={ () => setLabelFeatureName( "" ) }
              clearable={ true }
            />

          </Flex>
        </div>
      </div>

      { featureName !== "" ? (
        <>
          <Flex
            direction="row"
            align="start">

            <div style={ { position: 'relative', marginBottom: '20px' } }>
              <Suspense>
                <div>
                  <LassoDrawer>
                    <ScatterPlotVisualization datasetName={ datasetName as string } featureName={ featureName } labelFeatureName={ labelFeatureName } />
                  </LassoDrawer>
                </div>
              </Suspense>

              <Flex
                mih={ 150 }
                justify="left"
                align="center"
                direction="column"
                wrap="wrap"
                style={ { width: '100%', marginTop: '6px' } }
              >
                <p className="text-sm font-medium">
                  { indexes.length } point{ indexes.length !== 1 ? 's' : '' } selected
                </p>
              </Flex>
            </div>

            { !isLoadingEmbs ? (
              <Flex
                mih={ 150 }
                justify="center"
                align="center"
                direction="column"
                wrap="wrap"
                style={ { width: '50%', backgroundColor: '#f0f0f0', marginLeft: '30px', borderRadius: '12px' } }
              >

                { indexes.length > 0 ? ( <div ref={ containerRef } className="h-[600px] overflow-auto">
                  <FeatureDisplayer indexes={ indexes } featureData={ featureData } featureType={ featureType } labelData={ labelData } label_dict={ labelDict as { [ key: number ]: string } } columnCount={ 2 } />
                </div> ) : ( <Text>Click on a point or draw a lazzo to see the samples</Text> ) }
              </Flex>
            ) : null }

          </Flex>
        </>
      ) : (
        <p>Select Feature</p>
      ) }

    </div>
  );
}

export default function Embeddings ()
{
  return (
    <Suspense>
      <Home />
    </Suspense>
  )
}
