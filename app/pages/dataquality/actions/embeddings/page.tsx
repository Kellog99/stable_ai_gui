"use client";

import {log} from 'console';
import {type} from 'os';
import {parse} from 'path';
import {useState,useRef,useEffect, Suspense} from 'react';
import ScatterPlotVisualization from '../../../components/client/ScatterPlotVisualization';
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
  const socketRef = useRef(null);
  
  const [ featureName, setFeatureName ] = useState<any>( "" )
  const [ modelName, setModelName] = useState<any>("")
  const [ features, setFeatures ] = useState<string[]>( [] )
  const [ datasetName, setDatasetName ] = useState<string | null>( "" )
  

  const [isConnected, setIsConnected] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Idle');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  
  const datasetUsed = useStore( ( state ) => state.datasetUsed )
  

  const connectWebSocket = () => {
    // Reset states
    setProgress(0);
    setResult(null);
    setError(null);
    setStatus('Connecting...');

    // Create WebSocket connection
    const socket = new WebSocket('ws://localhost:5003/actions/embed');
    socketRef.current = socket;

    // Connection opened
    socket.addEventListener('open', (event) => {
      setIsConnected(true);
      setStatus('Connected, processing starting...');
    });

    //if (isConnected===true) {
    //  socket.current.send(JSON.stringify({ 
    //    datasetName: datasetName, 
    //    featureName: featureName,
    //    modelName : modelName
    //  }))
    //}

    // Listen for messages
    socket.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      
      switch(data.type) {
        case 'progress':
          setProgress(data.progress);
          setStatus(data.message);
          break;
        case 'complete':
          setProgress(100);
          setStatus('Task completed!');
          setResult(data.result);
          // Note: We don't need to manually close here as the server will close the connection
          break;
        case 'error':
          setError(data.message);
          setStatus('Error occurred');
          break;
        default:
          console.log('Unknown message type:', data);
      }
    });

    // Connection closed
    socket.addEventListener('close', (event) => {
      setIsConnected(false);
      if (event.code === 1000) {
        setStatus('Connection closed: Task completed');
      } else if (event.code === 1011) {
        setStatus(`Connection closed: ${event.reason}`);
      } else {
        setStatus(`Connection closed (code: ${event.code})`);
      }
    });

    // Connection error
    socket.addEventListener('error', (event) => {
      setIsConnected(false);
      setError('WebSocket connection error');
      setStatus('Connection error');
    });
  };

  const disconnectWebSocket = () => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
      setStatus('Disconnected');
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

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

  const connectAndAssingModel = (model) => {
    connectWebSocket()
    setModelName(model)
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
                data={ ["hf-hub:apple/DFN5B-CLIP-ViT-H-14"] }
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
        <Text size="sm" style={{marginTop:"20px"}}>Embeddings done! </Text>
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
