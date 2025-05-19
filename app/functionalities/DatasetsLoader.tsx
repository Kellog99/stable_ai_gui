"use server";
import fs from 'fs';
import path, { join } from 'path';
import { datasets_get } from '../properties/urls';


export async function getDatasetFolders (): Promise<string[]>
{
    const datasetsPath = path.join( process.cwd(), 'public', 'datasets' );

    try {
        const items = fs.readdirSync( datasetsPath, { withFileTypes: true } );

        const folders = items
            .filter( item => item.isDirectory() )
            .map( dir => dir.name );

        return folders;
    } catch ( error ) {
        console.error( 'Error reading datasets directory:', error );
        return [];
    }
}


export default async function DatasetsLoader ()
{

    const datasetNames = await getDatasetFolders();

    console.log( "FOLDER NAMES", datasetNames );

    const url = new URL( datasets_get );

    
    datasetNames.forEach( datasetName =>
    {
        url.searchParams.append( 'dataset', datasetName );
    } );


    const response = await fetch( url );

    if ( !response.ok ) throw new Error( 'Failed to send files to backend' );

    const datasets = await response.json();

    console.log( 'Server response:', datasets ); // Handle the JSON response

    return datasets;

}
