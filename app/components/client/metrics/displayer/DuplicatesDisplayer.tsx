"use client"

import FeatureDisplayer from "@/components/server/FeatureDisplayer";
import featureLoader from "@/functionalities/FeatureLoader";
import { DuplicatesDTO } from "@/interfaces/metricsInterface"
import { image_type, label_type, text_type } from "@/properties/types";
import { Flex, Paper, RingProgress, Text } from "@mantine/core"
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";



export default function DuplicatesDisplayer(props: { duplicates: DuplicatesDTO }) {
    const searchParams = useSearchParams();
    const { featureName, score, indexes } = props.duplicates;
    const scoreRound = (score*100).toFixed(1)
    const [feature, setFeature] = useState(null)
    const [type, setType] = useState("")
    const [ datasetName, setDatasetName ] = useState<string | null>( "" )

    useEffect( () =>
        {
          if ( searchParams.get( "datasetName" ) ) {
            setDatasetName( searchParams.get( "datasetName" ) );
          }
        }, [ searchParams ] );


    useEffect( () =>
      {   if (datasetName) {
          const loadFeature = async () =>
          {
            try {
                const featureLoaded = await featureLoader( datasetName, featureName );
                console.log( "FEATURE LOADED:", featureLoaded );
                if ( featureLoaded.type === image_type || featureLoaded.type === text_type ) {
                  setFeature( featureLoaded );
                  setType( featureLoaded.type )
                }
            } catch ( error ) {
              console.error( 'Error loading feature:', error );
            }
          };
          loadFeature();}
      }, [datasetName] );

      console.log("LOADED:", feature)

    return (
        <>
            <Flex
                direction="column"
                align="center"
            >
                <h3>Score on the { featureName } feature</h3>
            {feature ? (
                <>
                <RingProgress
                    size={ 180 }
                    roundCaps
                    sections={ [ { value: score*100, color: 'green' } ] }
                    transitionDuration={ 1000 }
                    label={ <Text ta="center" fw={ 700 } size="lg">{scoreRound}%</Text> }
                />

                <FeatureDisplayer indexes={indexes.flat()} featureData={feature.datas} featureType={type} columnCount={2}/>
            </>) : null
             }    
            </Flex>
        </>
    )

}