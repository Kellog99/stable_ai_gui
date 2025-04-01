"use client";
import RouterButton from "@/components/client/buttons/RouterButton";
import { Box, Button, Text } from "@mantine/core";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react"
import classes from './datasets.module.css'
import useStore from '@/store/dsStore';
import CircleSchema from "@/components/client/SchemaShower3";
import SchemaShower2 from "@/components/client/SchemaShower2";
import SchemaVisualization from "@/components/client/SchemaShower3";
import HorizontalTreeSchema from "@/components/client/treediagram";

export default function Datasets ()
{

  const searchParams = useSearchParams();
  const [ datasetName, setDatasetName ] = useState<string | null>( "" )
  const datasets = useStore( ( state ) => ( state.datasets ) )
  const setDatasets: ( datasets: null ) => void = useStore( ( state ) => state.setDatasets );

  const datasetUsed = useStore( ( state ) => state.datasetUsed )
  const setData = useStore( ( state ) => ( state.setData ) );

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

  /*
  const [features, setFeatures] = useState<string[]>([])

  useEffect(() => {
    if (Array.isArray(datasetUsed?.features))  {
      const names = datasetUsed.features.map((feature) => feature.name);
      setFeatures(names);
    }
  }, []);

  console.log("features names:", features)
  */


  /*
  const features = [
    {
      type: "IMAGE_FEATURE",
      name: "image",
      description: "The dataset has 5400 images"
    },
    {
      type: "BBOX_FEATURE",
      name: "bbox",
      description: "The dataset has 10800 bboxes"
    }, 
    {
      type: "LABEL_FEATURE",
      name: "bbox_label",
      description: "The dataset has 10800 bbox labels"
    }

  ]

  const connections: [number, number][] = [
    [0, 1], [0,2]
  ];

*/



  const features = [
    {
      type: "IMAGE_FEATURE",
      name: "image",
      
    },
    {
      type: "EMBEDDINGS_FEATURE",
      name: "image_embeddings",
     
    }, 
    {
      type: "IMAGE_FEATURE",
      name: "image",
      
    },
    {
      type: "BBOX_FEATURE",
      name: "bbox",
      
    }, 
    {
      type: "LABEL_FEATURE",
      name: "bbox_label",
      
    },
    {
      type: "CROP_FEATURE",
      name: "image_crops",
  
    },

  ]

  const connections: [number, number][] = [
    [0, 1], [0,3], [1,2], [3,4], [3,5]
  ];

  

  const labelColorMap: Record<string, string> = {
    image: '#FFDDC1',  // Light Red
    image_crops: '#FFDDC1',
    bbox: '#C1E1DC',  // Light Blue
    label: '#F7D1CD',  // Light Pink
    image_label: '#F7D1CD',
    bbox_label: '#F7D1CD',
    text: '#C1F7C1',  // Light Green
    image_embeddings: '#FFABAB',
    bbox_embeddings: '#FFABAB',
    image_crops_embeddings: '#FFABAB',
    "...": '#FFABAB',  // Light Coral
  };

  return (
    <div>
      <Box
        className={ classes.title }>
        <h1> { datasetName } dataset</h1>
        { datasetName ?
          <RouterButton name={ datasetName } route={ "/pages/dataquality/embeddings" }>
            <Button>Embeddings</Button>
          </RouterButton> : null }
          <HorizontalTreeSchema features={features} connections={connections} labelColorMap={labelColorMap}/>
          {/*
          <SchemaVisualization
          features={features}
          connections={connections}
          labelColorMap={labelColorMap}/>
          */}

        
      </Box>
      <h2>
        Description
      </h2>
      <Box style={ { display: 'flex', alignItems: 'center', gap: '4px' } }>
        <Text fw={ 600 }>{ datasetUsed?.name || "" }</Text> is a dataset for { datasetUsed?.task || "" }.
        It has { datasetUsed?.n_classes || "" } classes.
      </Box>
    </div>
  )
}