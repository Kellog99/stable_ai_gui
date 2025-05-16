"use client";

import ScatterPlotVisualization from '../../../components/client/ScatterPlotVisualization';
import { useSearchParams } from 'next/navigation';
import { Suspense, useState, useEffect, useRef, useCallback } from 'react';
import { Autocomplete, Flex, Button, Text, Box, Space, Select, Textarea, TextInput, Modal, MultiSelect, MultiSelectProps, Group } from '@mantine/core';
import { FixedSizeGrid, GridChildComponentProps } from "react-window";
import featureLoader from '../../../functionalities/FeatureLoader';
import useStore from '../../../store/dsStore';
import LassoDrawer from '@/components/client/Lasso';
import RouterButton from '@/components/client/buttons/RouterButton';
import classes from './page.module.css'
import FeatureDisplayer, { FeatureCard } from '@/components/client/FeatureDisplayer';
import { image_type, label_type, text_type } from '@/properties/types';
import { useDisclosure } from '@mantine/hooks';
import { Rnd } from "react-rnd";
import MovableWindow from '@/components/client/MovableWindow';

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
  const [ opened, { open, close } ] = useDisclosure( false );
  const [ feature, setFeature ] = useState<Feature | null>( null )
  const [ featureData, setFeatureData ] = useState<string[]>( [] )
  const [ labelFeature, setLabelFeature ] = useState<Feature | null>( null )
  const [ labelDict, setLabelDict ] = useState<{ [ key: number ]: string } | null>( null )
  const [ labelData, setLabelData ] = useState<number[]>( [] )
  const [ featureType, setFeatureType ] = useState<any>( "" )
  const [ labelFeatureType, setLabelFeatureType ] = useState<any>( "" )
  const [ featureName, setFeatureName ] = useState<any>( "" )
  const [ labelFeatureName, setLabelFeatureName ] = useState<string>( "" )
  const [ queryRetrieve, setQueryRetrieve ] = useState<string>( "" )
  const colorMap = useStore( ( state ) => state.colorMap )

  const filteredLabels = useStore( ( state ) => state.filteredLabels )
  const setFilteredLabels = useStore( ( state ) => state.setFilteredLabels )

  const [ features, setFeatures ] = useState<string[]>( [] )
  const [ labelFeatures, setLabelFeatures ] = useState<string[]>( [] )
  const [ datasetName, setDatasetName ] = useState<string | null>( "" )

  const containerRef = useRef<HTMLDivElement>( null );

  const indexes = useStore( ( state ) => state.selectedIndexes );
  const datasetUsed = useStore( ( state ) => state.datasetUsed )
  const isLoadingEmbs = useStore( ( state ) => state.isLoadingEmbs )
  const dimensions = useStore( ( state ) => state.size )

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
    // Only proceed if labelFeatureName is not an empty string
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

  const handleTextareaKeyDown = useCallback( ( event: any ) =>
  {
    // Prevent the keydown event from bubbling up to DeckGL listeners
    event.stopPropagation();
    setQueryRetrieve( event.target.value )
    // You can add other logic here if needed
    // console.log('Textarea KeyDown:', event.key);
  }, [] );


  console.log( "LABEL DATA:", labelData )
  console.log( "FEATURE DATA", feature )
  console.log( "FILTERED", featureData )


  console.log( "indexes:", indexes )


  const legendData = labelDict && colorMap
    ? Object.keys( labelDict ).map( ( key ) => ( {
      value: labelDict[ key ],
      label: labelDict[ key ],
      color: `rgb(${colorMap[ key ].join( ',' )})`,
    } ) )
    : [];

  const renderMultiSelectOption: MultiSelectProps[ 'renderOption' ] = ( { option } ) =>
  {
    const item = legendData.find( ( entry ) => entry.value === option.value );

    return (
      <Group gap="sm">
        <Box
          style={ {
            width: 12,
            height: 12,
            borderRadius: '50%',
            backgroundColor: item?.color ?? 'black',
          } }
        />
        <Text size="sm">{ option.label }</Text>
      </Group>
    );
  };



  return (
    <div className="w-full h-screen">

      <div style={{
            marginTop:"50px",
            marginLeft: "100px"
        }}>

        <Space h="md" />


        <div style={ { width: '100%', position: 'relative' } }>

          <Flex direction="row" justify="space-between" align="flex-start">
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

              { labelFeatureName && labelDict ? (
                <>
                  <MultiSelect
                    data={ legendData }
                    renderOption={ renderMultiSelectOption }
                    maxDropdownHeight={ 300 }
                    radius="md"
                    size='xs'
                    label="Labels"
                    placeholder="Choose one or more labels to visualize"
                    value={ filteredLabels as string[] }
                    onChange={ ( value ) => setFilteredLabels( value ) }
                    searchable
                    clearable
                  />
                </> ) : null }

            </Flex>
          </Flex>


        </div>
      </div>

      { featureName !== "" ? (
        <>
          <Flex
            direction="column"
            align="center">

            <div style={ { position: 'relative' } }>

              <Flex
                justify="left"
                align="center"
                direction="column"
                wrap="wrap"
                style={ { width: '100%' } }
              >
                { !isLoadingEmbs ? ( <p>
                  { indexes.length } point{ indexes.length !== 1 ? 's' : '' } selected
                </p> ) : null }

              </Flex>

              <Suspense>
                <Box style={ { pointerEvents: 'none' } }>
                  <div style={ { pointerEvents: 'auto' } }>

                    <ScatterPlotVisualization datasetName={ datasetName as string } featureName={ featureName } labelFeatureName={ labelFeatureName } />

                  </div>
                </Box>
              </Suspense>


            </div>
          </Flex>



          { indexes.length > 0 ? (

            <MovableWindow >
              <Flex
                mih={ 150 }
                justify="center"
                align="center"
                direction="column"
                style={ { marginLeft: '30px', borderRadius: '12px' } }
              >
                { indexes.length > 0 ? ( <div ref={ containerRef } className="h-[600px] overflow-auto">
                  <FeatureDisplayer indexes={ indexes } featureData={ featureData } featureType={ featureType } labelData={ labelData } label_dict={ labelDict as { [ key: number ]: string } } dimensions={ dimensions } />
                </div> ) : null }
              </Flex>
            </MovableWindow> ) : null }
        </>
      ) : (
        <Text size="sm" style={ { marginTop: "20px", marginLeft:"100px" } }>Select Feature</Text>
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
