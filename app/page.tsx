// Usage in a page or layout
// Page.js (or App.js)
//import HomePage from "./pages/home/HomePage";

"use client";
import classes from './page.module.css';
import DatasetBT from '../app/components/server/DatasetBT';
import SearchBar from '../app/components/client/SearchBar';
import DatasetsLoader, {getDatasetFolders} from './functionalities/DatasetsLoader';
import { useEffect, useState } from 'react';
import useStore from './store/dsStore';
import {datasets_get, embedder_get} from './properties/urls';
import {Button, Progress, RingProgress, Text} from '@mantine/core';
import {color} from 'framer-motion';

/*
export const metadata = {
  title: "Data Quality Framework",
  description: "",
};
*/

/*
export default async function HomePage ( props: { searchParams: Promise<{ query: string }> } )
{
  const { searchParams } = props;

  const { query } = await searchParams;
  const datasets = await DatasetsLoader()

  console.log( "Server Response:", datasets )

  return (
    <>
      <SearchBar />
      <DatasetBT query={ query } datasets={ datasets } />
    </>
  );
}
*/



export default function HomePage() {

  //const [datasets, setData] = useState(undefined);
  const datasets  = useStore((state) => (state.datasets));
  const setDatasets = useStore((state) => state.setDatasets)

  const [ progress, setProgress ] = useState( 0 );
  const [ status, setStatus ] = useState( 'Idle' );
  const [ result, setResult ] = useState( null );

  async function get_datasets ()
  {
    const datasetNames = await getDatasetFolders();
    console.log( "FOLDER NAMES", datasetNames );
    const url = new URL( datasets_get );
    datasetNames.forEach( datasetName =>
    {
        url.searchParams.append( 'dataset', datasetName );
    } );

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
                  setResult( jsonData.result )
                  setDatasets(jsonData.datasets)
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

  
  //useEffect(() => {
    //DatasetsLoader().then(fetchedData => {
    //  setDatasets(fetchedData);
    //});
  //  get_datasets()
  //}, []);
  
  console.log(progress) // HERE PROGRESS IS ALWAYS ZERO
  //console.log("Server Response:",datasets)
  const query  = useStore((state) => (state.queryDataset));

  return (
    <>
      <SearchBar />
      {result === null ? (
        //<RingProgress
        //  sections={[{ progress, color: 'red' }]}
        //  transitionDuration={250}
        <>
        <Progress color="red" radius="xl" size="xl" value={ progress } striped animated style={ { marginTop: '60px' } } />
        <Button onClick={get_datasets}>
            OK
          </Button>
        </>
      ) : (
        <DatasetBT query={query} datasets={datasets} />
      )}
    </>
  )};
