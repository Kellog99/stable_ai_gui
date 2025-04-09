// Wrap the function with cache so that repeated calls return the cached result
"use server";
import { data_get } from '../properties/urls';


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
async function getData ( datasetName: string, featureName: string, labelFeatureName?: string )
{
  if ( labelFeatureName ) {
    const response = await fetch(
      `${data_get}?datasetName=${encodeURIComponent(datasetName)}&featureName=${encodeURIComponent(featureName)}&labelFeatureName=${encodeURIComponent(labelFeatureName)}`
    );
    
    if ( !response.ok ) throw new Error( 'Failed to send files to backend' );

    const points = await response.json();
    return points
    
  } else {
    const response = await fetch( 
      `${data_get}?datasetName=${encodeURIComponent( datasetName )}&featureName=${encodeURIComponent( featureName )}` );
    
      if ( !response.ok ) throw new Error( 'Failed to send files to backend' );

    const points = await response.json();
    return points

  }
};


export default getData;