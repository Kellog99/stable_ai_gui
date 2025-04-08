"use client";
import RouterButton from "@/components/client/buttons/RouterButton";
import { Box, Flex, Text } from "@mantine/core";
import { BarChart } from '@mantine/charts';
import '@mantine/charts/styles.css';
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react"
import classes from './page.module.css'
import useStore from '@/store/dsStore';
import SchemaShower from "@/components/client/SchemaShower";
import { FeatureSchema } from "@/interfaces/DatasetInterface";
import ImageDisplayer from "@/components/server/ImageDisplayer";
import FeatureDisplayer from "@/components/server/FeatureDisplayer";
import featureLoader from "@/functionalities/FeatureLoader";
import { image_type, label_type, text_type } from "@/properties/types";

interface Feature
{

  type: string;
  name: string;
  datas: any[];
  is_logic: boolean

}

export default function Datasets ()
{

  const searchParams = useSearchParams();

  const containerRef = useRef<HTMLDivElement>( null );

  const [ datasetName, setDatasetName ] = useState<string | null>( "" )
  const [ features, setFeatures ] = useState<FeatureSchema[]>( [] )
  const [ connections, setConnections ] = useState<[ string, string ][]>( [] )
  const [ descriptions, setDescriptions ] = useState<string[]>( [] )
  const [ feature, setFeature ] = useState<Feature | null>( null )
  const [ featureType, setFeatureType ] = useState<any>( "" )
  const [ indexes, setIndexes ] = useState<number[]>( [] );
  const [ labelToSamples, setLabelToSamples ] = useState<{ label: string; samples: number }[]>( [] );
  const [ labelFeature, setLabelFeature ] = useState<Feature | null>( null )

  const barSize = 60;            // Width of each bar
  const barSpacing = 30;         // Space between each bar
  const numberOfBars = labelToSamples.length;
  const chartWidth = numberOfBars * ( barSize + barSpacing );

  const containerWidth = 800; // for example
  const availableWidth = containerWidth - 30;


  const datasets = useStore( ( state ) => ( state.datasets ) )
  const setDatasets: ( datasets: null ) => void = useStore( ( state ) => state.setDatasets );
  const datasetUsed = useStore( ( state ) => state.datasetUsed )
  const setData = useStore( ( state ) => ( state.setData ) );

  const featureToDisplay = useStore( ( state ) => state.featureToDisplay );


  //console.log("DATASETS:",datasets)

  useEffect( () =>
  {
    if ( searchParams.get( "name" ) ) {
      setDatasetName( searchParams.get( "name" ) );

      const filteredDataset = datasets?.find( dataset =>
        dataset.name === searchParams.get( "name" )
      );

      if ( filteredDataset ) {
        setData( filteredDataset );
        setDatasets( null )
      }
    }
  }, [ searchParams, datasets, setData, setDatasets ] );

  console.log( "datasetUsed:", datasetUsed )




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
        const filtered = featuresDescriptions
          .map( ( { description } ) => description )
          .filter( ( desc ) => desc !== null && desc !== undefined );

        // Append feature descriptions to allDescriptions
        allDescriptions.push( ...filtered );
        setDescriptions( allDescriptions );

      }
    }
  }, [ datasetUsed ] );


  useEffect( () =>
  {
    if ( featureToDisplay ) {
      const loadFeature = async () =>
      {
        try {
          if ( datasetName && featureToDisplay ) {
            const featureLoaded = await featureLoader( datasetName, featureToDisplay );
            console.log( "FEATURE LOADED:", featureLoaded );
            if ( featureLoaded.type === image_type || featureLoaded.type === text_type ) {
              setFeature( featureLoaded );
              setFeatureType( featureLoaded.type )
            } else if ( featureLoaded.type === label_type ) {
              setLabelFeature( featureLoaded )
            }
          }
        } catch ( error ) {
          console.error( 'Error loading feature:', error );
        }
      };
      loadFeature();
    }
  }, [ featureToDisplay ] );


  useEffect( () =>
  {
    if ( Array.isArray( datasetUsed?.features ) ) {

      const labelFeature = datasetUsed?.features.find( feature => feature.type === label_type );

      if ( labelFeature ) {
        const samplesPerClass = datasetUsed.samples_per_class;

        if ( labelFeature.label_dict ) {
          const labelDict = labelFeature.label_dict;
          const mapping = Object.entries( labelDict ).map( ( [ labelKey, labelName ] ) =>
          {
            const key = parseInt( labelKey );
            return {
              label: labelName as string,
              samples: samplesPerClass && samplesPerClass[ key ] ? samplesPerClass[ key ] : 0
            };
          } );
          setLabelToSamples( mapping );

        } else {

          const fallbackMapping = samplesPerClass
            ? Object.entries( samplesPerClass ).map( ( [ key, count ] ) => ( {
              label: key.toString(),
              samples: count as number,
            } ) )
            : [];
          setLabelToSamples( fallbackMapping );
        }
      }
    }
  }, [ datasetUsed ] );

  // *********************************************************************************************************************

  /*  
      const features = [
        { type: "IMAGE_FEATURE", name: "image", depth: 0 },
        { type: "EMBEDDINGS_FEATURE", name: "image_embeddings", depth: 1 },
        { type: "TEXT_FEATURE", name: "text", depth: 2 },
        { type: "BBOX_FEATURE", name: "bbox", depth: 1 },
        { type: "LABEL_FEATURE", name: "bbox_label", depth: 2 },
        { type: "CROP_FEATURE", name: "image_crops", depth: 2 },
      ];
    
      const connections: [ string, string ][] = [
        [ "image", "image_embeddings" ],
        [ "image", "bbox" ],
        [ "image_embeddings", "text" ],
        [ "bbox", "bbox_label" ],
        [ "bbox", "image_crops" ],
      ];
    
      const labelColorMap: Record<string, string> = {
        image: "#FFDDC1",
        image_crops: "#FFDDC1",
        bbox: "#C1E1DC",
        label: "#F7D1CD",
        image_label: "#F7D1CD",
        bbox_label: "#F7D1CD",
        text: "#C1F7C1",
        image_embeddings: "#FFABAB",
        bbox_embeddings: "#FFABAB",
        image_crops_embeddings: "#FFABAB",
      };
*/

  const labelColorMap: Record<string, string> = {
    image: "#FFDDC1",
    image_crops: "#FFDDC1",
    bbox: "#C1E1DC",
    label: "#F7D1CD",
    image_label: "#F7D1CD",
    bbox_label: "#F7D1CD",
    text: "#C1F7C1",
    image_embeddings: "#FFABAB",
    bbox_embeddings: "#FFABAB",
    image_crops_embeddings: "#FFABAB",
  };

  useEffect( () =>
  {
    if ( feature && Array.isArray( feature.datas ) ) {
      const indexesList = Array.from( { length: feature.datas.length }, ( _, i ) => i );
      setIndexes( indexesList );
    }
  }, [ feature ] );

  return (
    <div className="w-full h-screen">
      <div className="max-w-4xl mx-auto px-4">

        <Box className={ classes.title } style={ { display: "flex", flexDirection: "column", gap: "0px" } }>
          <h1 style={ { marginTop: "0", marginBottom: "30px" } }>{ datasetName } dataset</h1>
          <SchemaShower features={ features } connections={ connections } labelColorMap={ labelColorMap } />
        </Box>

        <h2>
          Description
        </h2>
        <Box style={ { marginBottom: '70px' } }>
          <Text fw={ 600 } component="span">
            { datasetUsed?.name || "" }
          </Text>{ " " }
          is a dataset for { datasetUsed?.task || "" }.
          { datasetUsed?.n_classes ? <> { " " } It has { datasetUsed?.n_classes || "" } classes.{ " " }</> : <>{ " " }</> }
          { descriptions?.map( ( description, index ) => (
            <span key={ index }>{ description } </span>
          ) ) }
        </Box>
      </div>

      { datasetUsed?.samples_per_class ?
        ( <>
          <h2>Numerosity per class</h2>
          <div style={ { width: '1000px', margin: '20px auto' } }>

            <Flex
              justify="center"
              align="center"
              direction="column"
              wrap="wrap"
            >
              <Box
                style={ {
                  marginLeft: "30px",
                  marginRight: "30px",
                  overflowX: 'auto',
                  overflowY: 'hidden',
                  maxWidth: '100%',
                } }
              >
                <BarChart
                  h={ 400 }
                  w={ chartWidth }
                  data={ labelToSamples }
                  dataKey="label"
                  series={ [ { name: 'samples', color: '#a9adb9' } ] }
                  barProps={ {
                    barSize: barSize,
                    onClick: ( bar ) =>
                    {
                      console.log( 'Clicked bar data:', bar );
                      // You can do anything here — route, open modal, filter data, etc.
                    }
                  } }
                  style={ { paddingRight: barSpacing / 2 } }
                />
              </Box>
            </Flex>
          </div>
        </> ) : null }


      { featureToDisplay && feature ? (
        <div className="w-full" style={ { position: 'relative', marginBottom: '20px' } }>
          <h2>Explore the { feature.name } feature</h2>
          <Flex
            mih={ 150 }
            justify="center"
            align="center"
            direction="column"
            wrap="wrap"
            style={ { width: '100%' } }
          >
            <div ref={ containerRef } className="h-[600px] overflow-auto">
              { labelFeature ? (
                <FeatureDisplayer
                  indexes={ indexes }
                  featureData={ feature.datas }
                  featureType={ featureType }
                  labelData={ labelFeature.datas }
                />
              ) : (
                <FeatureDisplayer
                  indexes={ indexes }
                  featureData={ feature.datas }
                  featureType={ featureType }
                />
              ) }
            </div>
          </Flex>
        </div>
      ) : (
        <>
          <h2>Explore</h2>
          <p>Click on the schema to explore the features!</p>
        </>
      ) }

    </div>
  )
}