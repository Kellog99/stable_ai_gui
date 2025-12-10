"use server";

import { dataset_get, datasets_get, save_get } from "@/properties/urlsNNTrust";
import { revalidatePath } from "next/cache";
import fsPromises from "node:fs/promises";


export default async function DatasetsLoader ()
{
    const response = await fetch( datasets_get );
    if ( !response.ok ) throw new Error( 'Failed to send files to backend' );

    const datasets = await response.json();

    console.log( 'Server response:', datasets ); 

    return datasets;
}

export async function DatasetGetter (datasetName: string)
{   
    const baseUrl = dataset_get;
    const url = new URL(baseUrl);
    url.searchParams.append('dataset', datasetName);
    const response = await fetch( url);
    if ( !response.ok ) throw new Error( 'Failed to send files to backend' );

    const dataset = await response.json();

    console.log( 'Server response:', dataset ); 

    return dataset;
}

export async function AutomaticSave(datasetName: string) {
    const baseUrl = save_get;
    const url = new URL(baseUrl);
    url.searchParams.append('datasetName', datasetName);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.log("Error while saving Dataset");
      } else {
        console.log("Dataset saved");
      }
    } catch (error) {
        console.log("Error while saving Dataset");
    }
  };

export async function GetDatasetAndSave(datasetName: string) {
    const dataset = await DatasetGetter(datasetName)
    await AutomaticSave(datasetName)
    return dataset
  };



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
