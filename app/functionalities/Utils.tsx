import Dataset from "@/interfaces/genericInterface";
import { label_type } from "@/properties/types";
import featureLoader from "./FeatureLoader";

export function getScoreColor ( score: number )
{
  if ( score >= 0.8 ) {
    return 'green';
  } else if ( score >= 0.5 ) {
    return 'yellow';
  } else {
    return 'red';
  }
}

export function IsFeatureBond (
  dataset: Dataset,
  nameFeature1: string,
  typeFeature2: string,
  nameFeature2?: string
): boolean | string | string[]
{
  const getFeatureType = ( name: string ): string | undefined =>
  {
    const feature = dataset.features.find( ( f ) => f.name === name );
    return feature?.type;
  };

  const matches: string[] = [];

  for ( const [ from, to ] of dataset.edges ) {
    if ( from === nameFeature1 ) {
      const targetType = getFeatureType( to );
      if ( targetType === typeFeature2 ) {
        if ( nameFeature2 === undefined ) {
          matches.push( to );
        } else if ( to === nameFeature2 ) {
          return true;
        }
      }
    }
  }
  if ( matches && matches.length > 0 ) {
    return matches
  } else {
    return false;
  }
}

export async function IsFeatureSameLength (
  dataset: Dataset,
  featureLength: number
): Promise<string[]>
{
  console.log( "RX", dataset )
  if ( Array.isArray( dataset?.features ) ) {
    const extractedFeatures = dataset.features
      .filter( ( { type } ) => type === label_type )
      .map( ( { name } ) => name );

    // Run featureLoader for each label
    const featureResults = await Promise.all(
      extractedFeatures.map( ( label ) => featureLoader( dataset.name, label ) )
    );
    // Filter based on datas.length and return corresponding names
    const labelFeature = extractedFeatures.filter( ( _, i ) => featureResults[ i ].datas.length === featureLength );


    return labelFeature;
  }

  return [];
}
export function IsFeaturePresent (
  dataset: Dataset,
  featureType: string
): boolean
{

  if ( dataset.features.some( ( f ) => f.type === featureType ) ) {
    return true
  } else {
    return false
  };
}