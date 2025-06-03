"use server";
import fs from 'fs';
import path from 'path';
import { datasets_get } from '../properties/urls';
import { revalidatePath } from "next/cache";
import fsPromises from "node:fs/promises";


async function getDatasetFolders (): Promise<string[]>
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

export async function uploadFile ( formData: FormData )
{
    const file = formData.get( "file" ) as File;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array( arrayBuffer );

    try {
        await fsPromises.writeFile( `./public/${file.name}`, buffer );
        console.log( `File ${file.name} was saved successfully.` );
    } catch ( error ) {
        console.error( 'Error writing file:', error );
    }
    revalidatePath( "/" );
}
