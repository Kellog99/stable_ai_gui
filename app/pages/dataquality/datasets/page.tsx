"use client";
import RouterButton from "@/components/client/buttons/RouterButton";
import { Box, CloseButton, Flex, Text, Textarea } from "@mantine/core";
import { BarChart } from '@mantine/charts';
import '@mantine/charts/styles.css';
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react"
import classes from './page.module.css'
import useStore from '@/store/dsStore';
import SchemaShower from "@/components/client/SchemaShower";
import Dataset, { FeatureSchema } from "@/interfaces/DatasetInterface";
import ImageDisplayer from "@/components/server/ImageDisplayer";
import FeatureDisplayer from "@/components/client/FeatureDisplayer";
import featureLoader from "@/functionalities/FeatureLoader";
import { image_type, label_type, text_type } from "@/properties/types";
import { motion } from 'framer-motion'
import { IsFeatureBond } from "@/functionalities/Utils";



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
  const [ labelDict, setLabelDict ] = useState<{ [ key: number ]: string } | null>( null )

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
  const setFeatureToDisplay = useStore( ( state ) => state.setFeatureToDisplay )


  useEffect( () =>
  {
    if ( searchParams.get( "datasetName" ) ) {
      setDatasetName( searchParams.get( "datasetName" ) );

      const filteredDataset = datasets?.find( dataset =>
        dataset.name === searchParams.get( "datasetName" )
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
            
            if ( featureLoaded.type === image_type || featureLoaded.type === text_type ) {
              setFeature( featureLoaded );
              setFeatureType( featureLoaded.type )
              if (labelFeature && !IsFeatureBond(datasetUsed as Dataset, featureLoaded?.name as string, labelFeature.type, labelFeature.name)) {
                setLabelFeature(null)
              }
            } else if ( featureLoaded.type === label_type ) {
               if (IsFeatureBond(datasetUsed as Dataset, feature?.name as string, featureLoaded.type, featureLoaded.name)) {
                setLabelFeature( featureLoaded )
                if ( featureLoaded && featureLoaded.label_dict ) {
                setLabelDict( featureLoaded.label_dict )
              }
               }
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

      const labelFeature = datasetUsed.features.find( feature => feature.type === label_type );

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

  {/*
  const handleClick: (bar) => {
  }
*/}

  const handleonClose = () =>
  {
    setFeatureToDisplay( null );
    setLabelFeature( null )
  }


  return (
    <div className="w-full h-screen">
      <div className="max-w-4xl mx-auto px-4">
        
        <Box
          className={ classes.title }
          style={ { display: "flex", flexDirection: "column", gap: "0px" } }
        >
          <h1 style={ { marginTop: "0", marginBottom: "30px" } }>
            { datasetUsed?.name } dataset
          </h1>
        </Box>
        

        <div style={ { display: 'flex', alignItems: 'flex-start' } }>

          <div style={ { flex: 1, position: 'relative' } }>
            <Flex
              direction='column'
              align='center'>
              <motion.div
                animate={ {
                  transform: featureToDisplay && feature
                    ? 'translate(-100px, 150px)'
                    : 'translate(0, 0)'
                } }
                transition={ { duration: 0.5, ease: "easeInOut" } }
                style={ {
                  width: '100%',
                  willChange: 'transform'
                } }
              >
                <div ref={ containerRef } className="h-[600px] overflow-auto">
                  <SchemaShower
                    features={ features }
                    connections={ connections }
                    labelColorMap={ labelColorMap }
                  />
                </div>
              </motion.div>
              { !featureToDisplay && (
                <p>Click on the schema to explore the features!</p>
              ) }
            </Flex>
          </div>

          { featureToDisplay && feature && (
            <div style={ {
              width: '50%',        // Takes up 50% of the flex container width
              position: 'relative', // Now works as expected within the flex layout
              overflow: 'auto',    // Keep internal scroll if needed
              visibility: featureToDisplay && feature ? 'visible' : 'hidden',
              pointerEvents: featureToDisplay && feature ? 'auto' : 'none'
            } }>

              <motion.div
                initial={ { opacity: 0, transform: 'translateX(100px)' } }
                animate={ {
                  opacity: featureToDisplay && feature ? 1 : 0,
                  transform: featureToDisplay && feature ? 'translateX(0)' : 'translateX(100px)'
                } }
                transition={ { type: "tween", duration: 0.5, ease: "easeInOut" } }
                style={ { willChange: 'transform, opacity' } }
              >
                <Flex
                  direction='row'
                  align='center'
                  gap='md'>
                  <h3>Explore the { feature.name } feature</h3>
                  <CloseButton
                    onClick={ handleonClose } />
                </Flex>
                <div className="h-96 overflow-auto">
                  { labelFeature ? (
                    <FeatureDisplayer
                      indexes={ indexes }
                      featureData={ feature.datas }
                      featureType={ featureType }
                      labelData={ labelFeature.datas }
                      label_dict={ labelDict as { [ key: number ]: string } }
                      columns={ 2 }
                    />
                  ) : (
                    <FeatureDisplayer
                      indexes={ indexes }
                      featureData={ feature.datas }
                      featureType={ featureType }
                      columns={ 2 }
                    />
                  ) }
                </div>
              </motion.div>


            </div>
          ) }
        </div>

        <h2>
          Description
        </h2>

        <Box style={ { marginBottom: '70px' } }>
          <Text fw={ 600 } component="span">
            { datasetUsed?.name || "" }
          </Text>{ " " }
          is a dataset for { datasetUsed?.task || "" }.
          { datasetUsed?.n_classes ? <> { " " } It has { datasetUsed?.n_classes || "" } classes and {datasetUsed?.n_samples} samples. You can check the protoypes{ " " }
            { <Link
              href={ {
                pathname: "/pages/dataquality/prototypes",
                query: { datasetName: datasetName }
              } }
              style={ { color: 'blue' } }
            >here</Link> }. { " " }</> : <>It has {datasetUsed?.n_samples}{ " " }</> }
            
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
                      console.log( 'Clicked bar data:', bar.label );
                    }
                  } }
                  style={ { paddingRight: barSpacing / 2, paddingBottom: "20px"} }
                />
              </Box>
            </Flex>
          </div>
        </> ) : null }
    </div>
  )
}