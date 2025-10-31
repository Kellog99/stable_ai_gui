"use client";

import AsyncTaskTracker from '@/components/client/AsyncTracker';
import classes from "@/pages/tasks/dataquality/datasets/page.module.css";
import { image_type, text_type } from '@/properties/types';
import { cleaner_progress, cleaner_start } from '@/properties/urls';
import useStore from '@/store/dsStore';
import { Box, Center, Flex, Select, Text } from '@mantine/core';
import { MagicWandSparkles } from '@vectopus/atlas-icons-react';
import { MousePointerClick } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function CleanDuplicates ()
{
  const [ features, setFeatures ] = useState<string[]>( [] )
  const [ featureName, setFeatureName ] = useState<any>( "" )

  const datasetUsed = useStore( ( state ) => state.datasetUsed )
  const [compute, setCompute] = useState<boolean>(false);
  const activeTask = useStore( ( state ) => state.activeTask );

  const config = {
    datasetName: datasetUsed?.name,
    featureName: featureName,
  };

  useEffect( () =>
  {
    if ( Array.isArray( datasetUsed?.features ) ) {
      const extractedFeatures = datasetUsed.features
        .filter( ( { type } ) => type === image_type || type === text_type )
        .map( ( { name } ) => name );

      setFeatures( extractedFeatures );
    }
  }, [ datasetUsed ] )


  const handleCleaner = ( name: string ) =>
  {
    setFeatureName( name )
    if ( name ) {
      setCompute(true)
    }
  }

  return (
    <div>
      <Box
        className={ classes.title }
        style={ { display: "flex", flexDirection: "column", gap: "0px" } }
      >
        <div className={ classes.datasetHeader }>
          <MagicWandSparkles className={ classes.iconDatabase } />
          <h1 className={ classes.datasetTitle }>
            Duplicates Cleaning
          </h1>
        </div>
        <div className={ classes.datasetDivider }></div>

      </Box>

      <div className={ classes.featureBox }>
        <Flex direction="row" justify="space-between" align="flex-start">
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
              onChange={ ( value ) => handleCleaner( value as string ) }
              allowDeselect={ false }
              clearable={ true }
              required={ true }
            />
          </Flex>
        </Flex>

      </div>
      { !featureName ? (
        <Center>
          <span
            style={ { display: "inline-flex", alignItems: "center", gap: "6px" } }
          >
            <MousePointerClick size={ 22 } color="white" />
            <Text size="xs">
              Select a feature to clean
            </Text>
          </span>
        </Center>
      ) : featureName !== ""  && (compute || activeTask) ? (

        <AsyncTaskTracker
          action={ "clean_duplicates" }
          startEndpoint={ cleaner_start }
          startParams={ config }
          startBody={ undefined }
          progressEndpoint={ cleaner_progress }
          pollInterval={ 0 }
          progressDisplayMode={ true } />
      ) : null }

    </div>
  )
}





