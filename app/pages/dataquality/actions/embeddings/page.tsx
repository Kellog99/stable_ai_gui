"use client";

import { useState, useRef, useEffect } from 'react';
import { Progress, Flex, Select, Text, Box, Center, Alert } from '@mantine/core';
import useStore from '../../../../store/dsStore';
import { image_type, label_type, text_type } from '@/properties/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import
{
  faCheck, faCircleExclamation
} from '@fortawesome/free-solid-svg-icons';
import { embedder_get } from '@/properties/urls';
import Link from "next/link";

function Home ()
{
  const socketRef = useRef<WebSocket | null>( null );

  const [ featureName, setFeatureName ] = useState<any>( "" )
  const [ modelName, setModelName ] = useState<string | null>( "" )
  const [ features, setFeatures ] = useState<string[]>( [] )
  const [ datasetName, setDatasetName ] = useState<string | null>( "" )


  const [ isConnected, setIsConnected ] = useState( false );
  const [ progress, setProgress ] = useState( 0 );
  const [ status, setStatus ] = useState( 'Idle' );
  const [ result, setResult ] = useState<string | null>( null );
  const [ error, setError ] = useState<string | null>( null );

  const datasetUsed = useStore( ( state ) => state.datasetUsed )
  const setData = useStore( ( state ) => ( state.setData ) );


  async function prova ( model: string )
  {
    const baseUrl = embedder_get

    const url = new URL( baseUrl );

    // Option 1: Pass datasets as a single comma-separated list
    url.searchParams.append( 'featureName', featureName );
    url.searchParams.append( 'datasetName', datasetUsed?.name as string );
    url.searchParams.append( 'modelUsed', model )
    const response = await fetch( url );
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if ( reader ) {
      try {
        while ( true ) {
          // Read a chunk from the stream

          const { done, value } = await reader.read();

          if ( done ) {
            console.log( "Stream complete" );
            break;
          }

          // Decode the bytes to string
          const text = decoder.decode( value, { stream: true } );
          console.log( text )
          // Process the SSE format (data: {...})
          const lines = text.split( '\n\n' );
          for ( const line of lines ) {
            if ( line.startsWith( 'data: ' ) ) {
              try {
                const jsonData = JSON.parse( line.substring( 6 ) );
                console.log( 'Received progress update:', jsonData );

                // Handle the progress update
                if ( jsonData.status === "complete" ) {
                  console.log( "Process completed:", jsonData.result );
                  if ( jsonData.dataset ) {
                    setData( jsonData.dataset )
                  }
                  setResult( jsonData.result )
                } else if ( jsonData.progress !== undefined ) {
                  // Update progress if available
                  console.log( `Progress: ${jsonData.progress}%` );
                  setProgress( jsonData.progress )
                }
              } catch ( e ) {
                // Handle potential JSON parsing errors
                console.error( 'Error parsing SSE data:', e );
              }
            }
          }
        }
      } catch ( error ) {
        console.error( 'Error reading stream:', error );
      } finally {
        reader.releaseLock(); // Always release the lock when done
      }
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

  const connectAndAssingModel = ( model: string ) =>
  {
    setModelName( model )
    if ( model ) {
      prova( model )
    }
  }


  return (
    <div className="w-full h-screen">

      <div style={ {
        marginTop: "50px",
        marginLeft: "100px",
        marginRight: "100px"
      } }>


        <div style={ { width: '100%', position: 'relative' } }>

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
                allowDeselect={ false }
                clearable={ !isConnected }
                required={ true }
              />

              <Select
                id="feature"
                radius="md"
                label="Model name"
                placeholder="Choose model to use"
                data={ [ "hf-hub:apple/DFN5B-CLIP-ViT-H-14" ] }
                value={ modelName }
                onChange={ ( value ) => connectAndAssingModel( value as string ) }
                allowDeselect={ false }
                clearable={ !isConnected }
                required={ true }
              />

            </Flex>
          </Flex>


        </div>


        { !featureName || !modelName ? (
          <Text size="sm" style={ { marginTop: "20px" } }>Select a feature and the model to compute embeddings </Text>
        ) : featureName !== "" && result === null && modelName !== "" ? (

          <div className="my-animation-container w-full md:w-3/4 lg:w-1/2 mx-auto p-4 bg-gray-200 rounded-lg">
            <Center>
              <Text size="sm" style={ { marginTop: "60px" } }>Computing embeddings...</Text>
            </Center>



            <Box style={ { position: 'relative', marginTop: 60 } }>
              <Progress
                value={ progress }
                size="xl"
                radius="xl"
                color="red"
                striped
                animated
                style={ {
                  height: "30px"
                } }
              />
              <Text
                size="sm"
                fw={ 700 }
                c="black"
                style={ {
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  pointerEvents: 'none',
                } }
              >
                { progress }%
              </Text>
            </Box>
          </div>
        ) : result == "Complete!" ? (

          <Alert
            variant="light"
            color="green"
            radius="md"
            title={ result }
            icon={ <FontAwesomeIcon icon={ faCheck } /> }
            style={ { display: 'inline-block', maxWidth: '100%', marginTop: "30px" } }>

            The { featureName } feature has been correctly embedded and added to schema.
          </Alert>


        ) : result == "Feature image is already embedded!" ? (
          <Alert
            variant="light"
            color="orange"
            radius="md"
            title="Attention!"
            icon={ <FontAwesomeIcon icon={ faCircleExclamation } /> }
            style={ { display: 'inline-block', maxWidth: '100%', marginTop: "30px" } }
          >
            The { featureName } feature is already embedded. Check the dataset schema{ " " }
            <Link
              href={ {
                pathname: "/pages/dataquality/datasets",
                query: { datasetName: datasetName }
              } }
              style={ { color: 'blue' } }
            >
              here
            </Link>.
          </Alert>


        ) : null }
      </div>
    </div>
  );
}

export default function Embedder ()
{
  return (

    <Home />

  )
}
