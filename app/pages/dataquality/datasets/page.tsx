"use client";
import RouterButton from "@/components/client/buttons/RouterButton";
import { Box, Button, Text } from "@mantine/core";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react"
import classes from './datasets.module.css'
import useStore from '@/store/dsStore';
import SchemaShower from "@/components/client/SchemaShower";
import { FeatureSchema } from "@/interfaces/DatasetInterface";
import ImageDisplayer from "@/components/server/ImageDisplayer";


export default function Datasets ()
{

  const searchParams = useSearchParams();

  const [ datasetName, setDatasetName ] = useState<string | null>( "" )
  const [ features, setFeatures ] = useState<FeatureSchema[]>( [] )
  const [ connections, setConnections ] = useState<[ string, string ][]>( [] )
  const [ descriptions, setDescriptions ] = useState<string[]>( [] )


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


  const collectFeatureData = ( name: string ) =>
  {
    if ( datasetUsed ) {
      if ( Array.isArray( datasetUsed?.features ) ) {
        const featureId = datasetUsed.features.find( ( feature ) => feature.name === name );

        if ( featureId ) {
          const datas = featureId.datas
          return datas;
        } else {
          console.log( 'Feature not found' );
          return null;
        }
      }
      return null;
    }
  }


  
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
 
  const datas = featureToDisplay ? collectFeatureData(featureToDisplay) : [];
 
  return (
    <div>
      <Box className={ classes.title } style={ { display: "flex", flexDirection: "column", gap: "0px" } }>
        <h1 style={ { marginTop: "0", marginBottom: "30px" } }>{ datasetName } dataset</h1>
        <SchemaShower features={ features } connections={ connections } labelColorMap={ labelColorMap } />
      </Box>

      <Box style={ { marginLeft: "50px", marginRight: "50px" } }>
        <h2>
          Description
        </h2>
        <Box style={ { display: 'flex', alignItems: 'center', gap: '4px' } }>
          <Text fw={ 600 }>{ datasetUsed?.name || "" }</Text> is a dataset for { datasetUsed?.task || "" }.
          It has { datasetUsed?.n_classes || "" } classes. { " " }
          { descriptions?.map( ( description, index ) => (
            <span key={ index }>{ description } </span> // Adds space after each description
          ) ) }
        </Box>
        
        {
        /*{datas.length > 0 ? (
          datas.map( ( data: string) => <ImageDisplayer data={ data } alt="" /> )
        ) : null }
         */}
      </Box>
    </div>
  )
}