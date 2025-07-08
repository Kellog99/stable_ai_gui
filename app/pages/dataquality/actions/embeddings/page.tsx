"use client";

import { getModelInfo } from '@/functionalities/BackendUtils';
import { ModelInfo } from '@/interfaces/genericInterface';
import { image_type, text_type } from '@/properties/types';
import { embedder_get } from '@/properties/urls';
import
{
  faCheck, faCircleExclamation
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Alert, Box, Button, Center, Flex, Loader, Progress, Select, Table, Text } from '@mantine/core';
import Link from "next/link";
import { useEffect, useRef, useState } from 'react';
import useStore from '../../../../store/dsStore';
import {Vision} from '@vectopus/atlas-icons-react';

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
  const [ projecting, setProjecting ] = useState<boolean>( false );
  const [ error, setError ] = useState<string | null>( null );
  const [ computing, setComputing ] = useState<boolean>( false );
  const [ loadingInfo, setLoadingInfo ] = useState<boolean>( false );
  const [ modelInfo, setModelInfo ] = useState<ModelInfo | null>( null );
  const [ showModelInfo, setShowModelInfo ] = useState<boolean>( false );

  const datasetUsed = useStore( ( state ) => state.datasetUsed )
  const setData = useStore( ( state ) => ( state.setData ) );


  async function computeEmbeddings ( model: string )
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
                } else if ( jsonData.status == "projecting" ) {
                  setProjecting( true );
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

      setFeatures( extractedFeatures );
    }
  }, [ datasetUsed ] )

  function checkModelFeatureCompatibility ( modelInfo: ModelInfo, featureName: string )
  {
    if ( Array.isArray( datasetUsed?.features ) && modelInfo) {
      const feature = datasetUsed.features.find( f => f.name === featureName );
      const type = feature?.type;

      if ( type === image_type && modelInfo.supports_images == true ) {
        return true;
      } else if ( type === text_type && modelInfo.supports_text == true ) {
        return true;
      } else {
        return false;
      }
    }
  }

  const connectAndAssingModel = async ( model: string ) =>
  {

    setModelName( model )
    if ( model ) {
      setLoadingInfo( true );
      const modelInfoReceived = await getModelInfo( model );
      setModelInfo( modelInfoReceived );
      setShowModelInfo( true );
      setLoadingInfo( false );
      console.log("comp:", checkModelFeatureCompatibility( modelInfoReceived, featureName ))

    }
  }

  const handleCompute = () =>
  {
    setComputing( true )
    if ( modelName ) {
      computeEmbeddings( modelName )
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

          <Flex direction="column" justify="space-between" align="flex-start">
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
                data={ [
                      "sentence-transformers/all-MiniLM-L6-v2", 
                      "openai/clip-vit-base-patch32",             
                      "google/vit-base-patch16-224",              
                      "bert-base-uncased", 
                      "apple/DFN5B-CLIP-ViT-H-14-378"                      
                  ]}
                value={ modelName }
                onChange={ ( value ) => connectAndAssingModel( value as string ) }
                allowDeselect={ false }
                clearable={ !isConnected }
                required={ true }
                onClear={ () =>
                {
                  setShowModelInfo( false );
                  setModelInfo( null );
                  setComputing( false );
                } }
              />

            </Flex>

            { showModelInfo && modelInfo ? (
              <>
              <Flex direction="row" gap="md" align="center" wrap="nowrap">
                <Table variant="vertical" layout="fixed" withTableBorder
                  style={ {
                    marginTop: "20px",

                    width: "30%",

                  } }>

                  <Table.Tbody>
                    <Table.Tr>
                      <Table.Td colSpan={ 2 } style={ { textAlign: "center", fontWeight: "bold", fontSize: "14px", paddingBottom: "10px" } }>
                        Model Info
                      </Table.Td>
                    </Table.Tr>

                    <Table.Tr>
                      <Table.Th w={ 160 }>Name</Table.Th>
                      <Table.Td>{ modelInfo.name }</Table.Td>
                    </Table.Tr>

                    <Table.Tr>
                      <Table.Th>Model Type</Table.Th>
                      <Table.Td>{ modelInfo.model_type }</Table.Td>
                    </Table.Tr>

                    <Table.Tr>
                      <Table.Th>Architecture</Table.Th>
                      <Table.Td>{ modelInfo.architecture }</Table.Td>
                    </Table.Tr>

                    <Table.Tr>
                      <Table.Th>Support Text</Table.Th>
                      <Table.Td>{ modelInfo.supports_text.toString() }</Table.Td>
                    </Table.Tr>

                    <Table.Tr>
                      <Table.Th>Support Images</Table.Th>
                      <Table.Td>{ modelInfo.supports_images.toString() }</Table.Td>
                    </Table.Tr>

                    <Table.Tr>
                      <Table.Th>Support Audio</Table.Th>
                      <Table.Td>{ modelInfo.supports_audio.toString() }</Table.Td>
                    </Table.Tr>

                    <Table.Tr>
                      <Table.Th>Embedding Dimension</Table.Th>
                      <Table.Td>{ modelInfo.embedding_dim }</Table.Td>
                    </Table.Tr>

                    <Table.Tr>
                      <Table.Th>Max Length</Table.Th>
                      <Table.Td>{ modelInfo.max_length }</Table.Td>
                    </Table.Tr>

                  </Table.Tbody>
                </Table>

                { !checkModelFeatureCompatibility( modelInfo, featureName ) && (
                  <Alert
                    variant="light"
                    color="orange"
                    radius="md"
                    title="Warning"
                    icon={ <FontAwesomeIcon icon={ faCircleExclamation } /> }
                    style={ { display: 'inline-block', maxWidth: '100%', marginTop: "30px" } }
                  >
                    Check the compatibility between the selected model and the feature type.
                  </Alert>
                ) }
                </Flex>
              </> ) : loadingInfo ? (
                <>
                  <Flex
                    mih={ 150 }
                    justify="center"
                    align="center"
                    direction="column"
                    wrap="wrap"
                  >
                    <Loader size={ 30 } />
                  </Flex>
                </>
              ) : null }

            <Button style={ { marginTop: "20px" } }
              onClick={ handleCompute }
              disabled={ !featureName || !modelName || !checkModelFeatureCompatibility( modelInfo as ModelInfo, featureName ) || computing }>
              Compute Embeddings
            </Button>

          </Flex>


        </div>


        { !computing ? ( <>
          <Text size="sm" style={ { marginTop: "20px" } }>Select a feature and the model to compute embeddings </Text>
        </>
        ) : featureName !== "" && result === null && modelName !== "" ? (

          <div className="my-animation-container w-full md:w-3/4 lg:w-1/2 mx-auto p-4 bg-gray-200 rounded-lg">
            <Center>
              { projecting ?
                <Text size="sm" style={ { marginTop: "60px" } }>Projecting embeddings...</Text>
                : <Text size="sm" style={ { marginTop: "60px" } }>Computing embeddings...</Text> }

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
        ) :
          result == "Complete!" ? (

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
