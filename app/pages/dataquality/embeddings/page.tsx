"use client";

import ScatterPlotVisualization from '../../../components/client/ScatterPlotVisualization';
import { useSearchParams } from 'next/navigation';
import { Suspense, useState, useEffect, useRef } from 'react';
import ImageDisplayer from '../../../components/server/ImageDisplayer';
import TextDisplayer from '../../../components/server/TextDisplayer';
import { Card, Text, Badge, Group, CardSection, GridCol, Autocomplete, Flex, ScrollArea, Button, Box, Space } from '@mantine/core';
import { image_type, text_type } from "../../../properties/types";
import featureLoader from '../../../functionalities/FeatureLoader';
import useStore from '../../../store/dsStore';
import { FixedSizeGrid, GridChildComponentProps } from 'react-window';
import LassoDrawer from '@/components/client/Lasso';
import style from 'styled-jsx/style';
import RouterButton from '@/components/client/buttons/RouterButton';
import classes from './page.module.css'
import {log} from 'console';

interface Feature
{

  type: string;
  name: string;
  datas: string[];
  is_logic: boolean

}

function FeatureCard ( { index, data, featureType, label }: { index: number, data: string, featureType: string, label: number } )
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
        <Text fw={ 700 } size="lg">Sample: { index }</Text>
        <Badge color="#ec777e">Class: { label }</Badge>
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
  const [ labelFeature, setLabelFeature ] = useState<number[]>( [] )
  const [ labelData, setLabelData ] = useState<number[]>( [] )
  const [ featureType, setFeatureType ] = useState<any>( "" )
  const [ featureName, setFeatureName ] = useState<any>( "" )
  const [ datasetName, setDatasetName ] = useState<string | null>( "" )

  const [ lassoMode, setLassoMode ] = useState<boolean>( false )

  const containerRef = useRef<HTMLDivElement>( null );
  const COLUMN_COUNT = 4;
  const COLUMN_WIDTH = 320;
  const ROW_HEIGHT = 450;
  const rowCount = Math.ceil( featureData.length / COLUMN_COUNT );

  //setDatasetName(searchParams.get("name"))
  //const datasetName = "Animals"
  const indexes = useStore( ( state ) => state.selectedIndexes );
  const lazoModeSetter = useStore( ( state ) => state.setLazoMode );

  const datasetUsed = useStore( ( state ) => state.datasetUsed )

  //const featureName = "image"
  //const datasetName = "Animal Dataset"

  useEffect( () =>
  {
    if ( searchParams.get( "name" ) ) {
      setDatasetName( searchParams.get( "name" ) )
    }
  }, [ searchParams ] )

  const toggleLassoMode = () =>
  {
    const prev = !lassoMode
    setLassoMode(prev)
  }

  useEffect(() => {
    const handleMouseDown = () => {
      toggleLassoMode()
      console.log("DOWN")
    };

    const handleMouseUp = () => {
      toggleLassoMode()
      console.log("UP")
    };
  }, []); 

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
    if ( datasetUsed ) {
      if ( Array.isArray( datasetUsed.features ) ) {
        const labelF = datasetUsed.features.find( ( feature ) => feature.type === "LABEL_FEATURE" );
        setLabelFeature( labelF.datas )
      }
    }
  }, [] )

  useEffect( () =>
  {
    // Only proceed if indexes is not null
    if ( indexes != null && feature != null ) {
      const filterFeature = async () =>
      {
        try {
          let filteredArr: string[] = [];
          let filteredLabel: number[] = [];

          indexes.forEach( index =>
          {
            filteredArr.push( feature.datas[ index ] );
            filteredLabel.push( labelFeature[ index ] )
          } );
          setFeatureData( filteredArr )
          setLabelData( filteredLabel )

        } catch ( error ) {
          console.error( 'Error loading feature:', error );
        }
      };

      filterFeature();
    }
  }, [ indexes ] ); // Still keep indexes and featureName in the dependency array

  console.log( "LABEL DATA:", labelData )





  return (
    <div className="w-full h-screen">
      {/* Centered content section */}
      <div className="max-w-4xl mx-auto px-4">
        <Box className={classes.title}>
          <h1>Embeddings for {datasetName} dataset</h1>
          <RouterButton name={datasetName!} route={"/pages/dataquality/datasets"}>
            <Button>Go Back to Dataset Page</Button>
          </RouterButton>
        </Box>
        <Space h="md" />
        <label htmlFor="feature" className="font-bold">Feature</label>
        <div id="autocomplete-container" style={{ width: '300px', position: 'relative', marginBottom: '20px' }}>
          <Autocomplete
            id="feature"
            radius="md"
            placeholder="Choose feature to visualize"
            data={['image']}
            value={featureName}
            onChange={(value) => setFeatureName(value)}
          />
        </div>
      </div>
  
      {featureName !== "" ? (
        <>
          {/* Full-width visualization container that breaks out of the centered layout */}
          <div className="w-full" style={{ position: 'relative', marginBottom: '20px' }}>
            <Suspense>
              <div className="w-full">
                <LassoDrawer>
                  <ScatterPlotVisualization />
                </LassoDrawer>
              </div>
            </Suspense>
            
            <Flex
            mih={ 150 }
            justify="center"
            align="center"
            direction="column"
            wrap="wrap"
            style={ { width: '100%', marginTop:'6px' } }
          >
              <p className="text-sm font-medium">
                {indexes.length} point{indexes.length !== 1 ? 's' : ''} selected
              </p>
            </Flex>
          </div>
  
          {/* Back to centered layout */}
          <Flex
            mih={ 150 }
            justify="center"
            align="center"
            direction="column"
            wrap="wrap"
            style={ { width: '100%' } }
          >
              <div ref={containerRef} className="h-[600px] overflow-auto">
                <FixedSizeGrid
                  columnCount={COLUMN_COUNT}
                  columnWidth={COLUMN_WIDTH}
                  height={600}
                  rowCount={rowCount}
                  rowHeight={ROW_HEIGHT}
                  width={COLUMN_COUNT * COLUMN_WIDTH}
                  className="mx-auto"
                >
                  {({ columnIndex, rowIndex, style }: GridChildComponentProps) => {
                    const index = rowIndex * COLUMN_COUNT + columnIndex;
                    if (index >= featureData.length) return null;
                    return (
                      <div style={{
                        ...style,
                        padding: '8px',
                      }}>
                        <FeatureCard index={indexes[index]} data={featureData[index]} featureType={featureType} label={labelData[index]} />
                      </div>
                    );
                  }}
                </FixedSizeGrid>
              </div>
            </Flex>
        </>
      ) : (
          <p>Select Feature</p>
      )}
  
      <button
        onClick={toggleLassoMode}
        style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          zIndex: 1000,
          padding: '6px 12px',
          borderRadius: '4px',
          backgroundColor: lassoMode ? '#dc2626' : '#16a34a',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        {lassoMode ? 'Exit Lasso Mode' : 'Enter Lasso Mode'}
      </button>
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