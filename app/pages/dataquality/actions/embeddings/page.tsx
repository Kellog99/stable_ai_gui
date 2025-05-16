"use client";

import {log} from 'console';
import {type} from 'os';
import {parse} from 'path';
import {useState,useRef,useEffect, Suspense} from 'react';
import ScatterPlotVisualization from '@/components/client/ScatterPlotVisualization';
import { Progress, Space, Flex, Select, Text } from '@mantine/core';
import {color, stagger} from 'framer-motion';
import {size} from 'lodash';
import useStore from '../../../../store/dsStore';
import { image_type, label_type, text_type } from '@/properties/types';
import style from 'styled-jsx/style';
import {send} from 'process';
import {stringify} from 'querystring';

function Home ()
{
  const socketRef = useRef<WebSocket | null>(null);
  
  const [ featureName, setFeatureName ] = useState<any>( "" )
  const [ modelName, setModelName] = useState<any>("")
  const [ features, setFeatures ] = useState<string[]>( [] )
  const [ datasetName, setDatasetName ] = useState<string | null>( "" )
  

  const [isConnected, setIsConnected] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Idle');
  const [result, setResult] = useState(null);
  const [error, setError] = useState<string | null>(null);
  
  const datasetUsed = useStore( ( state ) => state.datasetUsed )
  const setData = useStore( ( state ) => ( state.setData ) );
  

  async function prova(model) {
    const baseUrl = "http://localhost:80/actions/embedder"
    
    const url = new URL(baseUrl);
        
        // Option 1: Pass datasets as a single comma-separated list
    url.searchParams.append('featureName', featureName);
    url.searchParams.append('datasetName', datasetUsed?.name);
    url.searchParams.append('modelName',model)
    const response = await fetch(url);
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    try {
      while (true) {
        // Read a chunk from the stream
        const { done, value } = await reader.read();
        
        if (done) {
          console.log("Stream complete");
          break;
        }
        
        // Decode the bytes to string
        const text = decoder.decode(value, { stream: true });
        console.log(text)
        // Process the SSE format (data: {...})
        const lines = text.split('\n\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const jsonData = JSON.parse(line.substring(6));
              console.log('Received progress update:', jsonData);
              
              // Handle the progress update
              if (jsonData.status === "complete") {
                console.log("Process completed:", jsonData.result);
                if(jsonData.dataset!==null){
                  setData(jsonData.dataset)
                }
                setResult(jsonData.result)
              } else if (jsonData.progress !== undefined) {
                // Update progress if available
                console.log(`Progress: ${jsonData.progress}%`);
                setProgress(jsonData.progress)
              }
            } catch (e) {
              // Handle potential JSON parsing errors
              console.error('Error parsing SSE data:', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error reading stream:', error);
    } finally {
      reader.releaseLock(); // Always release the lock when done
    }
  }

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
    }
  }, [ datasetUsed ] )

  const connectAndAssingModel = (model: any) => {
    setModelName(model)
    prova(model)
  }

  return (
    <div className="w-full h-screen">

      <div className="max-w-4xl mx-auto px-4">

        <Space h="md" />


        <div style={ { width: '1030px', position: 'relative' } }>

          <Flex direction="row" justify="space-between" align="flex-start">
            <Flex
              direction="row"
              gap="xs">

              <Select
                id="feature"
                radius="md"
                label="Feature"
                placeholder="Choose feature to embed"
                data={ features }
                value={ featureName }
                onChange={ ( value ) => setFeatureName( value ) }
                allowDeselect ={false}
                clearable={!isConnected}
                required={ true }
              />

              <Select
                id="feature"
                radius="md"
                label="Model name"
                placeholder="Choose model to use"
                data={ ["nomic-ai/nomic-embed-vision-v1.5"] }
                value={ modelName }
                onChange={( value ) => connectAndAssingModel( value )}
                allowDeselect ={false}
                clearable={!isConnected}
                required={ true }
              />

            </Flex>
          </Flex>


        </div>
      </div>

      { featureName !== "" && result===null && modelName!=="" ?(
        <div className="my-animation-container w-full md:w-3/4 lg:w-1/2 mx-auto p-4 bg-gray-200 rounded-lg">
          <Text size="sm" style={{marginTop:"60px"}}>Embeddings...</Text>
          <Progress color="red" radius="xl" size="xl" value={progress} striped animated style={{ marginTop: '60px' }}/>
        </div>
      ) : result!==null ? (
        <Text size="sm" style={{marginTop:"20px"}}>{result} </Text>
      ) :
      (
        <Text size="sm" style={{marginTop:"20px"}}>Select a feature and the model to compute embeddings </Text>
      ) }
    </div>
  );
}

export default function Embedder ()
{
  return (
    
      <Home />
    
  )
}
