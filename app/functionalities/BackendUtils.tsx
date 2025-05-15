// Wrap the function with cache so that repeated calls return the cached result
"use server";
import { data_get, duplicates_post, outliers_post, prototypes_get, retrieve_get } from '../properties/urls';


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
async function getData ( datasetName: string, featureName: string, labelFeatureName?: string, label?:string[] )
{
  if ( labelFeatureName ) {

    
    const url = new URL (`${data_get}?datasetName=${encodeURIComponent(datasetName)}&featureName=${encodeURIComponent(featureName)}&labelFeatureName=${encodeURIComponent(labelFeatureName)}`)
    
    if (label) {
      label.forEach( lb =>
        {
            url.searchParams.append( 'label', lb );
        } );
    }
    
    const response = await fetch(url);
    
    if ( !response.ok ) throw new Error( 'Failed to send files to backend' );

    const points = await response.json();
    
    return points
    
  } else {
    const response = await fetch( 
      `${data_get}?datasetName=${encodeURIComponent( datasetName )}&featureName=${encodeURIComponent( featureName )}` );
    
      if ( !response.ok ) throw new Error( 'Failed to send files to backend' );

    const results = await response.json();
    return results

  }
};

export default getData;


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


export async function RetrieveSamples(datasetName: string, featureName: string, query: string, queryTop_K: number){
  const response = await fetch(
    `${retrieve_get}?datasetName=${encodeURIComponent(datasetName)}&featureName=${encodeURIComponent(featureName)}&query=${encodeURIComponent(query)}&top_k=${encodeURIComponent(queryTop_K)}`
  );

  if ( !response.ok ) throw new Error( 'Failed to retrieve samples from the backend' );
  
  const samples = await response.json();
    return samples
}

