// Wrap the function with cache so that repeated calls return the cached result
"use server";
import { completeness_post, data_get, duplicates_post, outliers_post, prototypes_get, retrieve_get, root_folder, upload_post } from '../properties/urls';
import fs from 'node:fs/promises';
import path from 'node:path';

export async function postIndexes ( url: string, indexes: number[] )
{

  const response = await fetch( url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }, // binary content type
    body: JSON.stringify( indexes ),
  } );

}

export async function getIndexes ( url: string, indexes: number[] )
{

  const response = await fetch( url );

}

//async function getData(datasetName: string, featureName: string, labelFeatureName: string) {
export default async function getData ( datasetName: string, featureName: string, show_uq:boolean, labelFeatureName?: string, label?:string[], modelUsed?: string, queries?: string[] )
{

  const url = new URL (`${data_get}?datasetName=${encodeURIComponent(datasetName)}&featureName=${encodeURIComponent(featureName)}`)

  if (modelUsed) {
      
      url.searchParams.append( 'modelUsed', modelUsed );
    }

  if ( labelFeatureName  ) {
    
    url.searchParams.append( 'labelFeatureName', labelFeatureName )
    
    if (label) {
      label.forEach( lb =>
        {
            url.searchParams.append( 'label', lb );
        } );
    }

    if (queries) {
      queries.forEach( qr =>
        {
            url.searchParams.append( 'queries', qr );
        } );
    }
    
    const response = await fetch(url);
    
    if ( !response.ok ) throw new Error( 'Failed to send files to backend' );

    const points = await response.json();
    
    return points
    
  } else {
    url.searchParams.append( 'show_uq', `${show_uq}` )
    
    if (queries) {
      queries.forEach( qr =>
        {
            url.searchParams.append( 'queries', qr );
        } );
    }
    
    console.log("url finale:", url)
    const response = await fetch( url );
    
      if ( !response.ok ) throw new Error( 'Failed to send files to backend' );

    const results = await response.json();
    return results

  }
};


export async function getPrototypes (datasetName: string, featureName: string, labelFeatureName: string ){
  const response = await fetch(
    `${prototypes_get}?datasetName=${encodeURIComponent(datasetName)}&featureName=${encodeURIComponent(featureName)}&labelFeatureName=${encodeURIComponent(labelFeatureName)}`
  );

  if ( !response.ok ) throw new Error( 'Failed to get prototypes from the backend' );
  
  const prototypes = await response.json();
    return prototypes

}


export async function getDuplicates(datasetName: string, featureName: string, internalConfig: Object){
  const response = await fetch(`${duplicates_post}?datasetName=${encodeURIComponent(datasetName)}&featureName=${encodeURIComponent(featureName)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }, // binary content type
    body: JSON.stringify( internalConfig ),
  } );

  if ( !response.ok ) throw new Error( 'Failed to get duplicates from the backend' );
  
  const duplicates = await response.json();
    return duplicates
}


export async function getOutliers(datasetName: string, featureName: string, internalConfig: Object, outliers_mode: string){
  
  const response = await fetch(`${outliers_post}?datasetName=${encodeURIComponent(datasetName)}&featureName=${encodeURIComponent(featureName)}&outliersMode=${encodeURIComponent(outliers_mode)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }, // binary content type
    body: JSON.stringify( internalConfig ),
  } );

  if ( !response.ok ) throw new Error( 'Failed to get outliers from the backend' );
  
  const outliers = await response.json();
    return outliers
}

export async function getCompleteness(datasetName: string, featureName: string, internalConfig: Object){
  
  const response = await fetch(`${completeness_post}?datasetName=${encodeURIComponent(datasetName)}&featureName=${encodeURIComponent(featureName)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }, // binary content type
    body: JSON.stringify( internalConfig ),
  } );

  if ( !response.ok ) throw new Error( 'Failed to get completeness from the backend' );
  
  const completeness = await response.json();
    return completeness
}


export async function RetrieveSamples(datasetName: string, featureName: string, query: string, queryTop_K: number){
  const response = await fetch(
    `${retrieve_get}?datasetName=${encodeURIComponent(datasetName)}&featureName=${encodeURIComponent(featureName)}&query=${encodeURIComponent(query)}&top_k=${encodeURIComponent(queryTop_K)}`
  );

  if ( !response.ok ) throw new Error( 'Failed to retrieve samples from the backend' );
  
  const samples = await response.json();
    return samples
}


const BASE_DIRECTORY = ""; // Adjust as needed

export async function copyFiles(sourceFolder: string, newFolderName?: string) {
  const absoluteSourcePath = path.resolve(BASE_DIRECTORY, sourceFolder);
  const absoluteDestinationPath = root_folder;
  console.log("absolute path", absoluteSourcePath);

  // Security check: ensure within base directory
  if (!absoluteSourcePath.startsWith(BASE_DIRECTORY)) {
    throw new Error('Invalid folder path provided. Operations are restricted to a defined base directory.');
  }

  if (sourceFolder.includes('..')) {
    throw new Error('Folder path cannot contain ".." for security reasons.');
  }

  try {
    // Use the new folder name if provided, otherwise use the original folder name
    const folderName = newFolderName ?? path.basename(absoluteSourcePath);
    const destinationPathWithFolder = path.join(absoluteDestinationPath, folderName);

    // Ensure destination folder exists
    await fs.mkdir(destinationPathWithFolder, { recursive: true });

    // Copy folder and contents recursively
    await fs.cp(absoluteSourcePath, destinationPathWithFolder, { recursive: true });

    console.log(`Successfully copied ${folderName} to ${destinationPathWithFolder}`);
    return { success: true, message: `Successfully copied folder to ${destinationPathWithFolder}` };
  } catch (error) {
    console.error('Error copying folder:', error);
    return {
      success: false,
      message: `Failed to copy folder: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}


export async function upload(configs: Object){
  
  const response = await fetch(`${upload_post}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }, // binary content type
    body: JSON.stringify( configs ),
  } );

  if ( !response.ok ) throw new Error( 'Failed to upload dataset' );
  
}



