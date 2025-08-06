"use client";

import FeatureDisplayer from "@/components/client/FeatureDisplayer";
import SchemaShower from "@/components/client/SchemaShower";
import featureLoader from "@/functionalities/FeatureLoader";
import { IsFeatureBond, IsFeaturePresent } from "@/functionalities/Utils";
import Dataset, { FeatureSchema } from "@/interfaces/genericInterface";
import { bbox_type, embedding_type, image_type, label_type, text_type } from "@/properties/types";
import useStore from '@/store/dsStore';
import { BarChart } from '@mantine/charts';
import '@mantine/charts/styles.css';
import { Box, CloseButton, Flex, Text } from "@mantine/core";
import { motion } from 'framer-motion';
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import classes from './page.module.css';
import { labelColorMap } from "@/properties/static";



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
  //const [ labelToSamples, setLabelToSamples ] = useState<{ label: string; samples: number }[]>( [] );
  const labelToSamples = useStore((state) => state.labelToSamples)
  const setLabelToSamples = useStore((state) => state.setLabelToSamples)
  
  const [ labelFeature, setLabelFeature ] = useState<Feature | null>( null )
  const [ labelDict, setLabelDict ] = useState<{ [ key: number ]: string } | null>( null )
  const [bboxesHistogramData, setBboxesHistogramData] = useState<{ label: string; samples: number }[]>([]);
  const [bboxesAreaHistogramData, setBboxesAreaHistogramData] = useState<{ label: string; samples: number }[]>([]);
  const [ areEmbeddings, setAreEmbeddings ] = useState<boolean>( false )

  const barSize = 60;            // Width of each bar
  const barSpacing = 30;         // Space between each bar
  const numberOfBars = labelToSamples.length;
  const chartWidth = numberOfBars * ( barSize + barSpacing );
  const dynamicChartWidth = Math.max(chartWidth, bboxesHistogramData.length * barSize * 1.5);


  const datasets = useStore( ( state ) => ( state.datasets ) )
  const setDatasets: ( datasets: null ) => void = useStore( ( state ) => state.setDatasets );
  const datasetUsed = useStore( ( state ) => state.datasetUsed )
  const setData = useStore( ( state ) => ( state.setData ) );
  const setReport = useStore((state) => state.setReport)

  const setPrototypesData = useStore((state) => state.setPrototypesData)
  const setLabelProtoData = useStore((state) => state.setLabelProtoData)

  const featureToDisplay = useStore( ( state ) => state.featureToDisplay );
  const setFeatureToDisplay = useStore( ( state ) => state.setFeatureToDisplay )

  function buildHistogram(
  values: number[],
  binCount?: number
): { label: string; samples: number }[] {
  if (!Array.isArray(values) || values.length === 0) return [];

  const n = values.length;
  const bins = binCount || Math.ceil(Math.sqrt(n));
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min;
  const binWidth = range === 0 ? 1 : Math.ceil((range + 1) / bins);

  const histogramBins = Array.from({ length: bins }, (_, i) => {
    const start = min + i * binWidth;
    const end = start + binWidth - 1;
    return {
      start,
      end,
      count: 0
    };
  });

  values.forEach(value => {
    const index = Math.min(
      Math.floor((value - min) / binWidth),
      bins - 1
    );
    if (index >= 0 && index < histogramBins.length) {
      histogramBins[index].count += 1;
    }
  });

  return histogramBins.map(bin => ({
    label: bin.start === bin.end ? `${bin.start}` : `${bin.start}-${bin.end}`,
    samples: bin.count
  }));
}


  const dataLength = bboxesAreaHistogramData?.length ?? 0;
  const numberOfTicks = 10;

  let ticks: string[] = [];

  if (dataLength > 0) {
    const tickIndexes = Array.from({ length: numberOfTicks }, (_, i) =>
      Math.floor(i * (dataLength - 1) / (numberOfTicks - 1))
    );
    ticks = tickIndexes.map(i => bboxesAreaHistogramData[i]?.label ?? '');
  }

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
        setReport([])

        setPrototypesData(null)
        setLabelProtoData(null)
        setLabelToSamples([])

      }
    }

  }, [ searchParams, datasets, setData, setDatasets, datasetName ] );

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
        const extractedFeatures = datasetUsed.features.map( ( { type, name, depth, model_name } ) => ( {
          type,
          name,
          depth,
          model_name
        } ) );

        setFeatures( extractedFeatures );

        const featuresDescriptions = datasetUsed.features.map( ( { description } ) => ( {
          description
        } ) );

        const filtered: string[] = featuresDescriptions
          .map( ( { description } ) => description )
          .filter( ( desc ): desc is string => typeof desc === 'string' );

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
              if ( labelFeature && !IsFeatureBond( datasetUsed as Dataset, featureLoaded?.name as string, labelFeature.type, labelFeature.name ) ) {
                setLabelFeature( null )
              }
            } else if ( featureLoaded.type === label_type ) {
              if ( IsFeatureBond( datasetUsed as Dataset, feature?.name as string, featureLoaded.type, featureLoaded.name ) ) {
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
      const bboxFeature = datasetUsed.features.find( feature => feature.type === bbox_type );

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
      } else {
        setLabelToSamples([])
      }

      if ( bboxFeature ) {
    
        const bboxesPerArea = datasetUsed.bboxes_areas;
        const bboxesPerSample = datasetUsed.bboxes_per_sample;

        if (Array.isArray(bboxesPerSample)) {
          const histogram = buildHistogram(bboxesPerSample);
          setBboxesHistogramData(histogram);
        }

        if (Array.isArray(bboxesPerArea)) {   
          const histogram = buildHistogram(bboxesPerArea);
          setBboxesAreaHistogramData(histogram);
        }
          
      }
      else {
        setBboxesHistogramData([]);
        setBboxesAreaHistogramData([])
        }
  }
  }, [ datasetUsed ] );

  useEffect( () =>
  {
    if ( datasetUsed ) {
      const embs = IsFeaturePresent( datasetUsed, embedding_type )
      setAreEmbeddings( embs )
    }
  }, [ datasetUsed ] )


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
        className={classes.title}
        style={{ display: "flex", flexDirection: "column", gap: "0px" }}
      >
        <h1 style={{ marginTop: "0", marginBottom: "30px" }}>
          {datasetUsed?.name} dataset
        </h1>
      </Box>

      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Flex direction='column' align='center'>
            <motion.div
              animate={{
                transform: featureToDisplay && feature
                  ? 'translate(-100px, 150px)'
                  : 'translate(0, 0)'
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              style={{
                width: '100%',
                willChange: 'transform'
              }}
            >
              <div ref={containerRef} className="h-[600px] overflow-auto">
                <SchemaShower
                  features={features}
                  connections={connections}
                  labelColorMap={labelColorMap}
                  clickable={true}
                />
              </div>
            </motion.div>
            {!featureToDisplay && (
              <p>Click on the schema to explore the features!</p>
            )}
          </Flex>
        </div>

        {featureToDisplay && feature && (
          <div style={{
            width: '50%',
            position: 'relative',
            overflow: 'auto',
            visibility: featureToDisplay && feature ? 'visible' : 'hidden',
            pointerEvents: featureToDisplay && feature ? 'auto' : 'none'
          }}>
            <motion.div
              initial={{ opacity: 0, transform: 'translateX(100px)' }}
              animate={{
                opacity: featureToDisplay && feature ? 1 : 0,
                transform: featureToDisplay && feature ? 'translateX(0)' : 'translateX(100px)'
              }}
              transition={{ type: "tween", duration: 0.5, ease: "easeInOut" }}
              style={{ willChange: 'transform, opacity' }}
            >
              <Flex direction='row' align='center' gap='md'>
                <h3>Explore the {feature.name} feature</h3>
                <CloseButton onClick={handleonClose} />
              </Flex>
              <div className="h-96 overflow-auto">
                {labelFeature ? (
                  <FeatureDisplayer
                    indexes={indexes}
                    featureData={feature.datas}
                    featureType={featureType}
                    labelData={labelFeature.datas}
                    label_dict={labelDict as { [key: number]: string }}
                    columns={2}
                  />
                ) : (
                  <FeatureDisplayer
                    indexes={indexes}
                    featureData={feature.datas}
                    featureType={featureType}
                    columns={2}
                  />
                )}
              </div>
            </motion.div>
          </div>
        )}
      </div>

      <h2>Description</h2>

      <Box style={{ marginBottom: '70px' }}>
        <Text fw={600} component="span">
          {datasetUsed?.name || ""}
        </Text>{" "}
        is a dataset for {datasetUsed?.task || ""}.
        {datasetUsed?.n_classes ? (
          <> {" "} It has {datasetUsed?.n_classes || ""} classes and {datasetUsed?.n_samples} samples.{" "}</>
        ) : (
          <>It has {datasetUsed?.n_samples}{" "}</>
        )}
        {descriptions?.map((description, index) => (
          <span key={index}>{description} </span>
        ))}
      </Box>
    </div>

    {datasetUsed?.samples_per_class ? (
      <>
        <h2>Numerosity per class</h2>
        <div style={{ width: '1000px', margin: '20px auto' }}>
          <Flex
            justify="center"
            align="center"
            direction="column"
            wrap="wrap"
          >
            <Box
              style={{
                marginLeft: "30px",
                marginRight: "30px",
                overflowX: 'auto',
                overflowY: 'hidden',
                maxWidth: '100%',
              }}
            >
              <BarChart
                h={400}
                w={chartWidth}
                data={labelToSamples}
                dataKey="label"
                series={[{ name: 'samples', color: '#a9adb9' }]}
                barProps={{
                  barSize: barSize,
                  onClick: (bar) => {
                    console.log('Clicked bar data:', bar.label);
                  }
                }}
                style={{ paddingRight: barSpacing / 2, paddingBottom: "20px" }}
              />
            </Box>
          </Flex>
        </div>
      </>
    ) : null}
    
        <div style={{ 
      display: 'flex', 
      gap: '20px', 
      margin: '20px auto', 
      maxWidth: '2040px', 
      overflowX: 'auto',
      // Aggiungi padding per evitare che il contenuto venga tagliato
      paddingBottom: '10px'
    }}>
      {datasetUsed?.bboxes_per_sample && bboxesHistogramData.length > 0 ? (
        <div style={{ 
          flex: '1', 
          minWidth: '500px',
          // Assicurati che il container non ecceda la larghezza disponibile
          maxWidth: 'calc(50% - 10px)'
        }}>
          <h2 style={{ textAlign: 'center' }}>
            Number of Bounding Boxes per Image
          </h2>
          <div style={{ width: '100%' }}>
            <Flex
              justify="center"
              align="center"
              direction="column"
              wrap="wrap"
            >
              <Box
                style={{
                  marginLeft: "30px",
                  marginRight: "30px",
                  overflowX: 'auto',
                  overflowY: 'hidden',
                  width: '100%', // Usa tutta la larghezza disponibile
                  maxWidth: '100%',
                }}
              >
               <Flex direction="column" align="center">
              <BarChart
                h={400}
                w={Math.min(dynamicChartWidth, 500)}
                data={bboxesHistogramData}
                dataKey="label"
                series={[{ name: 'samples', color: '#a9adb9' }]}
                barProps={{
                  barSize: barSize,
                  onClick: (bar) => {
                    console.log('Clicked bin:', bar.label);
                  }
                }}
                withTooltip
                tooltipProps={{
                  content: ({ label, payload }) => {
                    if (payload && payload.length > 0) {
                      return (
                        <div style={{
                          backgroundColor: 'white',
                          padding: '8px 12px',
                          border: '1px solid #ccc',
                          borderRadius: '4px',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}>
                          <p style={{ margin: 0, fontWeight: 'bold' }}>
                            {label} bounding boxes
                          </p>
                          <p style={{ margin: 0, color: '#666' }}>
                            Samples: {payload[0].value}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }
                }}
                style={{ paddingRight: barSpacing / 2, paddingBottom: "20px" }}
              />
              <Text size="sm" mt="xs" color="dimmed">
                Bounding Boxes per Image
              </Text>
            </Flex>
              </Box>
            </Flex>
          </div>
        </div>
      ) : null}
      
      {datasetUsed?.bboxes_areas && bboxesAreaHistogramData.length > 0 ? (
        <div style={{ 
          flex: '1', 
          minWidth: '500px',
          // Assicurati che il container non ecceda la larghezza disponibile
          maxWidth: 'calc(50% - 10px)'
        }}>
           <h2 style={{ textAlign: 'center' }}>
            Number of Bounding Boxes per Area
          </h2>
          <div style={{ width: '100%' }}>
            <Flex
              justify="center"
              align="center"
              direction="column"
              wrap="wrap"
            >
              <Box
                style={{
                  marginLeft: "30px",
                  marginRight: "30px",
                  overflowX: 'auto',
                  overflowY: 'hidden',
                  width: '100%', // Usa tutta la larghezza disponibile
                  maxWidth: '100%',
                }}
              >
               <Flex direction="column" align="center">
              <BarChart
                h={400}
                w={Math.min(dynamicChartWidth, 500)}
                data={bboxesAreaHistogramData}
                dataKey="label"
                series={[{ name: 'samples', color: '#a9adb9' }]}
                xAxisProps={{
                  ticks: ticks,
                  tickFormatter: (label: string) => {
                    if (label.includes('-')) {
                      const [min, max] = label.split('-').map(Number);
                      const midpoint = Math.round((min + max) / 2);
                      // Trova il multiplo di 200 più vicino
                      const nearestMultiple = Math.round(midpoint / 200) * 200;
                      return nearestMultiple.toString();
                    }
                    return label;
                  }
                }}
                barProps={{
                  barSize: barSize,
                  onClick: (bar) => {
                    console.log('Clicked bin:', bar.label);
                  }
                }}
                withTooltip
                tooltipProps={{
                  content: ({ label, payload }) => {
                    if (payload && payload.length > 0) {
                      return (
                        <div style={{
                          backgroundColor: 'white',
                          padding: '8px 12px',
                          border: '1px solid #ccc',
                          borderRadius: '4px',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}>
                          <p style={{ margin: 0, fontWeight: 'bold' }}>
                            {label} px²
                          </p>
                          <p style={{ margin: 0, color: '#666' }}>
                            Samples: {payload[0].value}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }
                }}
                style={{ paddingRight: barSpacing / 2, paddingBottom: "20px" }}
              />
              <Text size="sm" mt="xs" color="dimmed">
                Bounding Box Area (px²)
              </Text>
            </Flex>
              </Box>
            </Flex>
          </div>
        </div>
      ) : null}
    </div>
        
      </div>
);
}
