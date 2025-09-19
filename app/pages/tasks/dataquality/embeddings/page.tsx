"use client";

import FeatureDisplayer from '@/components/client/FeatureDisplayer';
import MovableWindow from '@/components/client/MovableWindow';
import { IsFeatureBond, IsFeatureSameLength } from '@/functionalities/Utils';
import Dataset, { FeatureDTO } from '@/interfaces/genericInterface';
import { embedding_type, image_type, numberic_type, text_type } from '@/properties/types';
import { Alert, Box, Center, Checkbox, Flex, Group, MultiSelect, MultiSelectProps, Paper, RingProgress, Select, Space, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import ScatterPlotVisualization from '../../../components/client/ScatterPlotVisualization';
import featureLoader from '../../FeatureLoader';
import useStore from '../../../store/dsStore';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

interface Feature
{

  type: string;
  name: string;
  datas: any[];
  is_logic: boolean

}

function Home ()
{

  const searchParams = useSearchParams();
  const [ opened, { open, close } ] = useDisclosure( false );
  const [ feature, setFeature ] = useState<Feature | null>( null )
  const [ featureData, setFeatureData ] = useState<string[]>( [] )
  const [ labelFeature, setLabelFeature ] = useState<Feature | null>( null )
  const [ labelDict, setLabelDict ] = useState<{ [ key: number ]: string } | null>( null )
  const [ labelData, setLabelData ] = useState<number[]>( [] )
  const [ featureType, setFeatureType ] = useState<any>( "" )
  const [ labelFeatureType, setLabelFeatureType ] = useState<any>( "" )
  const [ featureName, setFeatureName ] = useState<any>( "" )
  const [ labelFeatureName, setLabelFeatureName ] = useState<string>( "" )
  const [ embFeatures, setEmbFeatures ] = useState<string[] | null>( null )
  const [ modelUsed, setModelUsed ] = useState<string | "">( "" )
  const [ numericFeature, setNumericFeature ] = useState<FeatureDTO | null>( null )
  const [ queryRetrieve, setQueryRetrieve ] = useState<string>( "" )
  const colorMap = useStore( ( state ) => state.colorMap )

  const filteredLabels = useStore( ( state ) => state.filteredLabels )
  const setFilteredLabels = useStore( ( state ) => state.setFilteredLabels )

  const [ features, setFeatures ] = useState<string[]>( [] )
  const [ labelFeatures, setLabelFeatures ] = useState<string[]>( [] )
  const [ datasetName, setDatasetName ] = useState<string | null>( "" )

  const containerRef = useRef<HTMLDivElement>( null );

  const indexes = useStore( ( state ) => state.selectedIndexes );

  const datasetUsed = useStore( ( state ) => state.datasetUsed )

  const isLoadingEmbs = useStore( ( state ) => state.isLoadingEmbs )
  const dimensions = useStore( ( state ) => state.size )

  const [ showUncertanties, setShowUncertanties ] = useState<boolean>( false )
  const [ areUncertanties, setAreUncertanties ] = useState<boolean>( false )
  const [ uqScores, setUqScores ] = useState<number[]>( [] )
  const [ disableLabelFeature, setDisableLabelFeature ] = useState<boolean>( false )


  useEffect( () =>
  {
    if ( Array.isArray( datasetUsed?.features ) ) {
      const extractedFeatures = datasetUsed.features
        .filter( ( { type } ) => type === image_type || type === text_type )
        .map( ( { name } ) => name );

      //const extractedlabelFeatures = datasetUsed.features
      //  .filter( ( { type } ) => type === label_type )
      //  .map( ( { name } ) => name );

      if ( featureName !== "" && feature ) {
        //const labelFeatures = IsFeatureBond( datasetUsed as Dataset, featureName, label_type )
        const load_labels = async () =>
          {
            const lb_feature = await IsFeatureSameLength( datasetUsed as Dataset, feature.datas.length);
            console.log("LX",feature.datas.length)
            setLabelFeatures( lb_feature as string[] )
          };
        load_labels()
      }

      setFeatures( extractedFeatures );
      //setLabelFeatures( extractedlabelFeatures )
      //console.log( labelFeatures )
    }
  }, [ datasetUsed, featureName, feature ] )

  console.log( "PAGE", datasetUsed )
  console.log( "PAGE", features )
  console.log( "PAGE", labelFeatures )

  useEffect( () =>
  {
    if ( searchParams.get( "datasetName" ) ) {
      setDatasetName( searchParams.get( "datasetName" ) )
    }
  }, [ searchParams ] )


  useEffect( () => 
  {
    if ( showUncertanties == true ) {
      const loadFeature = async () =>
      {
        try {
          if ( datasetName ) {
            const feature = await featureLoader( datasetName, "image_uq" );
            console.log( "LOADING", feature );
            setNumericFeature( feature );
            const scores: number[] = feature.datas;
            setUqScores( scores )
          }
        } catch ( error ) {
          console.error( 'Error loading feature:', error );
        }
      };
      loadFeature();
    }
  }, [ showUncertanties ] )

  useEffect( () =>
  {

    if ( datasetUsed ) {
      const embsNames = IsFeatureBond( datasetUsed as Dataset, featureName, embedding_type )

      if ( Array.isArray( datasetUsed?.features ) && Array.isArray( embsNames ) ) {
        const extractedModels = datasetUsed.features
          .filter( ( { name } ) => embsNames.includes( name ) )
          .map( ( { model_name } ) => model_name );

        setEmbFeatures( extractedModels as string[] )
      } else {
        setEmbFeatures([])
      }

    }
  }, [ datasetUsed, featureName ] )



  useEffect( () =>
  {
    // Only proceed if featureName is not an empty string
    if ( featureName != "" ) {
      const loadFeature = async () =>
      {
        try {
          if ( datasetName && featureName ) {
            const feature = await featureLoader( datasetName, featureName );
            console.log( feature );
            setFeature( feature );
            setFeatureType( feature.type )


          }
        } catch ( error ) {
          console.error( 'Error loading feature:', error );
        }
      };
      loadFeature();

    }
  }, [ featureName ] );

  useEffect( () =>
  {
    // Only proceed if labelFeatureName is not an empty string
    if ( labelFeatureName != "" ) {
      const loadFeature = async () =>
      {
        try {
          if ( datasetName && labelFeatureName ) {
            const labelFeature = await featureLoader( datasetName, labelFeatureName );
            console.log( "FETCHING", labelFeature );
            setLabelFeature( labelFeature );
            setLabelFeatureType( labelFeature.type )
            if ( labelFeature.label_dict ) {
              setLabelDict( labelFeature.label_dict )
            }
          }
        } catch ( error ) {
          console.error( 'Error loading feature:', error );
        }
      };
      loadFeature();

    }
  }, [ labelFeatureName ] );


  console.log("LABEL DICT page:", labelDict)
  useEffect( () =>
  {
    // Only proceed if indexes is not null
    if ( indexes != null && feature != null ) {
      const filterFeature = async () =>
      {
        try {
          let filteredArr: any[] = [];
          let filteredLabel: any[] = [];

          indexes.forEach( index =>
          {
            filteredArr.push( feature.datas[ index ] );
            if ( labelFeature != null && labelFeatureName !== "" ) {
              filteredLabel.push( labelFeature.datas[ index ] )
            }
          } );
          console.log( "DATA", feature.datas )
          setFeatureData( filteredArr )
          if ( labelFeature != null && labelFeatureName !== "" ) {
            setLabelData( filteredLabel )
          }

        } catch ( error ) {
          console.error( 'Error loading feature:', error );
        }
      };

      filterFeature();
    }
  }, [ indexes, labelFeatureName ] ); // Still keep indexes and featureName in the dependency array

  const handleTextareaKeyDown = useCallback( ( event: any ) =>
  {
    // Prevent the keydown event from bubbling up to DeckGL listeners
    event.stopPropagation();
    setQueryRetrieve( event.target.value )
    // You can add other logic here if needed
    // console.log('Textarea KeyDown:', event.key);
  }, [] );


  console.log( "LABEL DATA:", labelData )
  console.log( "FEATURE DATA", feature )
  console.log( "FILTERED", featureData )

  console.log( "indexes:", indexes )


  useEffect( () =>
  {

    if ( datasetUsed ) {
      const uncertanties = IsFeatureBond( datasetUsed as Dataset, featureName, numberic_type, "image_uq" )
      setAreUncertanties( uncertanties as boolean )
    }
  }, [ featureName ] )


  const legendData = labelDict && colorMap
    ? Object.keys( colorMap ).map( ( key ) =>
    {
      const numKey = Number( key );
      return {
        value: labelDict[ numKey ],
        label: labelDict[ numKey ],
        color: `rgb(${colorMap[ key ].join( ',' )})`,
      };
    } )
    : [];

  const renderMultiSelectOption: MultiSelectProps[ 'renderOption' ] = ( { option } ) =>
  {
    const item = legendData.find( ( entry ) => entry.value === option.value );

    return (
      <Group
        gap="sm"
        align="flex-start"
        wrap="nowrap"
        style={ { flexWrap: 'nowrap', alignItems: 'flex-start' } }
      >
        <Box
          style={ {
            minWidth: 12,
            height: 12,
            borderRadius: '50%',
            backgroundColor: item?.color ?? 'black',
            marginTop: 4, // optional: align with text baseline
          } }
        />
        <Text
          size="sm"
          style={ {
            whiteSpace: 'normal',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            lineHeight: 1.2,
          } }
        >
          { option.label }
        </Text>
      </Group>
    );
  };


  const handleShowUncertanties = ( event: any ) =>
  {
    setShowUncertanties( event.currentTarget.checked )
    if ( event.currentTarget.checked == true ) {
      setLabelFeatureName( "" )
      setDisableLabelFeature( true )
    } else {
      setDisableLabelFeature( false )
    }
  }

  const renderedComponent = () => (
    <>
      <Flex direction="column" align="center">
        <div style={ { position: 'relative' } }>
          <Suspense>
            <Box style={ { pointerEvents: 'none' } }>
              <div style={ { pointerEvents: 'auto' } }>
                <Flex
                  justify="left"
                  align="center"
                  direction="column"
                  wrap="wrap"
                  style={ { width: '100%' } }
                >
                  { !isLoadingEmbs ? (
                    <p>
                      { indexes.length } point{ indexes.length !== 1 ? 's' : '' } selected
                    </p>
                  ) : null }
                </Flex>

                <ScatterPlotVisualization
                  datasetName={ datasetName as string }
                  featureName={ featureName }
                  modelUsed={ modelUsed }
                  labelFeatureName={ labelFeatureName }
                  show_uq={ showUncertanties }
                />
              </div>
            </Box>
          </Suspense>
        </div>
      </Flex>

      { indexes.length > 0 ? (
        <MovableWindow>
          <Flex
            mih={ 150 }
            justify="center"
            align="center"
            direction="column"
            style={ { marginLeft: '30px', borderRadius: '12px' } }
          >
            <div ref={ containerRef } className="h-[600px] overflow-auto">
              <FeatureDisplayer
                indexes={ indexes }
                featureData={ featureData }
                featureType={ featureType }
                labelData={ labelData }
                label_dict={ labelDict as { [ key: number ]: string } }
                dimensions={ dimensions }
                { ...( showUncertanties ? { scores: uqScores } : {} ) }
                uncertainty={ showUncertanties }
              />
            </div>
          </Flex>
        </MovableWindow>
      ) : null }
    </>
  );

  return (
    <div className="w-full h-screen">

      <div style={ {
        marginTop: "30px",
        marginLeft: "100px",
      } }>

        <Space h="md" />


        <div style={ { width: '100%', position: 'relative', marginBottom: "10px" } }>
          <Flex direction="row" justify="space-between">
            <Group>
              <Flex
                direction="row"
                gap="xs"
                align="flex-end">

                <Select
                  id="feature"
                  radius="md"
                  label="Feature"
                  placeholder="Choose feature to visualize"
                  data={ features }
                  value={ featureName }
                  onChange={(value) => {
                    setFeatureName(value);
                    setModelUsed(datasetUsed.default_embedding_model);
                  }}
                  required={ true }
                />

                { embFeatures && embFeatures.length > 1 ? (
                  <Select
                    id="embFeature"
                    radius="md"
                    label="Embedding Feature"
                    placeholder="Choose embedding to visualize"
                    data={ embFeatures }
                    value={ modelUsed }
                    onChange={ ( value ) => setModelUsed( value as string ) }
                    onClear={ () => setModelUsed( "" ) }
                    clearable={ true }
                    required={ true }
                  />
                )
                  : null }


                { featureName && labelFeatures.length > 0? (
                  <Select
                    id="labelFeature"
                    radius="md"
                    label="Label Feature"
                    placeholder="Choose label"
                    data={ labelFeatures }
                    value={ labelFeatureName }
                    onChange={ ( value ) => setLabelFeatureName( value as string ) }
                    onClear={ () => setLabelFeatureName( "" ) }
                    clearable={ true }
                    disabled={ disableLabelFeature }
                  />
                ) : null }



                { labelFeatureName && labelDict ? (
                  <>
                    <MultiSelect
                      data={ legendData }
                      renderOption={ renderMultiSelectOption }
                      maxDropdownHeight={ 300 }
                      radius="md"
                      size='xs'
                      label="Labels"
                      placeholder="Choose one or more labels to visualize"
                      value={ filteredLabels as string[] }
                      onChange={ ( value ) => setFilteredLabels( value ) }
                      searchable
                      clearable
                    />
                  </> ) : null }

                { areUncertanties ? ( <Checkbox
                  radius="sm"
                  label="Show Uncertanties"
                  style={ { marginBottom: "6px" } }
                  checked={ showUncertanties }
                  onChange={ ( event ) => handleShowUncertanties( event ) }
                /> ) : null }

              </Flex>
            </Group>

            <Group>
              { feature && showUncertanties ? (
                <>
                  <Paper withBorder radius="md" p="xs">
                    <Center style={ { marginBottom: "10px" } }>
                      <Text fw={ 700 } size="sm">
                        { datasetName == "military" ? "Misclassification Task" : "Outliers Detection" }
                      </Text>
                    </Center>
                    <Flex direction="row" gap="md">
                      <Paper withBorder radius="md" p="xs">
                        <Group>
                          <RingProgress
                            size={ 80 }
                            roundCaps
                            thickness={ 5 }
                            sections={ [
                              {
                                value: 94.7,
                                color: "green",
                              },
                            ] }
                            transitionDuration={ 1000 }
                            label={
                              <Text ta="center" fw={ 700 } size="sx">
                                94.7%
                              </Text>
                            }
                          />

                          <div>
                            <Text size="xs" tt="uppercase" fw={ 700 }>
                              AUROC
                            </Text>
                          </div>
                        </Group>
                      </Paper>


                      <Paper withBorder radius="md" p="xs">
                        <Group>
                          <RingProgress
                            size={ 80 }
                            roundCaps
                            thickness={ 5 }
                            sections={ [
                              {
                                value: 96.2,
                                color: "green",
                              },
                            ] }
                            transitionDuration={ 1000 }
                            label={
                              <Text ta="center" fw={ 700 } size="sm">
                                96.2%
                              </Text>
                            }
                          />
                          <div>
                            <Text size="xs" tt="uppercase" fw={ 700 }>
                              AUPR
                            </Text>
                          </div>
                        </Group>
                      </Paper>

                      <Paper withBorder radius="md" p="xs">
                        <Group>
                          <RingProgress
                            size={ 80 }
                            roundCaps
                            thickness={ 5 }
                            sections={ [ { value: 0.9909 * 100, color: "green" } ] }
                            transitionDuration={ 1000 }
                            label={ <Text ta="center" fw={ 700 } size="sm">{ 99.1 }%</Text> }
                          />
                          <div>
                            <Text size="xs" fw={ 700 }>
                              Accuracy
                            </Text>
                          </div>
                        </Group>
                      </Paper>

                    </Flex>
                  </Paper>
                </>
              ) : null }
            </Group>

            <Group>
              { showUncertanties ? (
                <Box>
                  <Center>
                    <Text size="sm" mb={ 4 }>
                      Uncertainty
                    </Text>
                  </Center>
                  <Box>
                    <Box
                      h={ 20 }
                      mb={ 1 }
                      style={ {
                        background: 'linear-gradient(to right, blue, yellow)',
                        borderRadius: 4,
                        width: "200px"
                      } }
                    />
                    <Flex justify="space-between" style={ { width: "200px" } }>
                      <Text size="xs" style={ { color: "gray.600" } }>Low</Text>
                      <Text size="xs" style={ { color: "gray.600" } }>High</Text>
                    </Flex>
                  </Box>
                </Box> ) : null }
            </Group>

          </Flex>


        </div>
      </div>

      {
        featureName && embFeatures && embFeatures.length > 1 && modelUsed
          ? renderedComponent()
          : featureName && embFeatures && embFeatures.length == 1
            ? renderedComponent()
            : featureName && embFeatures && embFeatures.length == 0 ? (
              <Alert
              variant="light"
              color="orange"
              radius="md"
              title="Attention!"
              icon={ <FontAwesomeIcon icon={ faCircleExclamation } /> }
              style={ { display: 'inline-block', maxWidth: '100%', marginTop: "30px", marginLeft:"50px" } }
                >
                  The { featureName } feature is not embedded. You can embed it in the Action menù.
                </Alert>
            )
            : (
              <Text size="sm" style={ { marginTop: "20px", marginLeft: "100px" } }>Select Feature</Text>
            ) }

    </div>
  );
}

export default function Embeddings ()
{
  return (
    <Suspense>
      <Home />
    </Suspense>
  )
}
