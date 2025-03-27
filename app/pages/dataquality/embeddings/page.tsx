"use client";

import PointCloudVisualization from '../../../components/client/PointCloudVisualization';
import { useSearchParams } from 'next/navigation';
import { Suspense, useState, useEffect, useRef } from 'react';
import ImageDisplayer from '../../../components/server/ImageDisplayer';
import TextDisplayer from '../../../components/server/TextDisplayer';
import { Card, Text, Badge, Group, CardSection, GridCol, Autocomplete, Flex, ScrollArea } from '@mantine/core';
import { image_type, text_type } from "../../../properties/types";
import featureLoader from '../../../functionalities/FeatureLoader';
import useStore from '../../../store/dsStore';
import { FixedSizeGrid as Grid, GridChildComponentProps } from 'react-window';

interface Feature
{

  type: string;
  name: string;
  datas: string[];
  is_logic: boolean

}

function FeatureCard ( { data, featureType }: { data: string, featureType: string } )
{
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <CardSection>
        { featureType === image_type ? (
          <ImageDisplayer data={ data } alt="" />
        ) : featureType === text_type ? (
          <TextDisplayer data={ data } />
        ) : null }
      </CardSection>
      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={ 700 } size="lg">INFO</Text>
        <Badge color="#ec777e">INFO</Badge>
      </Group>
      <Text size="sm" c="dimmed">
        INFO
      </Text>
    </Card>
  );
}



function Home ()
{

  const searchParams = useSearchParams();
  const [ feature, setFeature ] = useState<Feature | null>( null )
  const [ featureData, setFeatureData ] = useState<string[]>( [] )
  const [ featureType, setFeatureType ] = useState<any>( "" )
  const [ featureName, setFeatureName ] = useState<any>( "" )
  const [ datasetName, setDatasetName ] = useState<string | null>( "" )

  const containerRef = useRef<HTMLDivElement>( null );
  const COLUMN_COUNT = 4;
  const COLUMN_WIDTH = 320;
  const ROW_HEIGHT = 450;
  const rowCount = Math.ceil( featureData.length / COLUMN_COUNT );

  //setDatasetName(searchParams.get("name"))
  //const datasetName = "Animals"
  const indexes = useStore( ( state ) => state.selectedIndexes );
  //const featureName = "image"
  //const datasetName = "Animal Dataset"

  useEffect( () =>
  {
    if ( searchParams.get( "name" ) ) {
      setDatasetName( searchParams.get( "name" ) )
    }
  }, [ searchParams ] )

  //const feature = getFeatureResources(indexes,featureName)

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
    // Only proceed if indexes is not null
    if ( indexes != null && feature != null ) {
      const filterFeature = async () =>
      {
        try {
          let filteredArr: string[] = [];
          indexes.forEach( index =>
          {
            filteredArr.push( feature.datas[ index ] );
          } );
          setFeatureData( filteredArr )
        } catch ( error ) {
          console.error( 'Error loading feature:', error );
        }
      };
      filterFeature();
    }
  }, [ indexes ] ); // Still keep indexes and featureName in the dependency array





  return (
    <div className="w-full h-screen">
      <div>
        <h1>This is the Embedding Visualization Page</h1>
        <h2>You are using { datasetName } dataset</h2>
      </div>

      <label htmlFor="feature" className="font-bold">Feature</label>
      <div id="autocomplete-container" style={ { width: '300px', position: 'relative', marginBottom: '20px' } }>
        <Autocomplete
          id="feature"
          radius="md"
          placeholder="Choose feature to visualize"
          data={ [ 'image' ] }
          value={ featureName }
          onChange={ ( value ) => setFeatureName( value ) }
        />
      </div>

      { featureName !== "" ? (
        <>
          <Flex
            mih={ 150 }
            justify="center"
            align="center"
            direction="column"
            wrap="wrap"
            style={ { width: '100%' } }
          >
            <Suspense>
              <PointCloudVisualization />
            </Suspense>

            <div className="absolute top-4 left-4 bg-black/50 text-white px-4 py-2 rounded-lg z-50">
              <p className="text-sm font-medium">
                { indexes.length } point{ indexes.length !== 1 ? 's' : '' } selected
              </p>
            </div>

            <div className="flex justify-center w-full">
              <div ref={ containerRef } className="h-[600px] overflow-auto">
                <Grid
                  columnCount={ COLUMN_COUNT }
                  columnWidth={ COLUMN_WIDTH }
                  height={ 600 }
                  rowCount={ rowCount }
                  rowHeight={ ROW_HEIGHT }
                  width={ COLUMN_COUNT * COLUMN_WIDTH }
                  className="mx-auto"
                >
                  { ( { columnIndex, rowIndex, style }: GridChildComponentProps ) =>
                  {
                    const index = rowIndex * COLUMN_COUNT + columnIndex;
                    if ( index >= featureData.length ) return null;

                    return (
                      <div style={ {
                        ...style,
                        padding: '8px',
                      } }>
                        <FeatureCard data={ featureData[ index ] } featureType={ featureType } />
                      </div>
                    );
                  } }
                </Grid>
              </div>
            </div>
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