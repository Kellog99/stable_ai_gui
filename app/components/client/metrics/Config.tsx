"use client";

import { Alert, Box, Button, Flex, Loader, Modal, Select, Space, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import useStore from '../../../store/dsStore';
import { image_type, label_type, text_type } from "@/properties/types";
import { useDisclosure } from "@mantine/hooks";
import DuplicatesConfigs from "./DuplicatesConfigs";
import OutliersConfig from "./OutliersConfig";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import
{
    faCheck
} from '@fortawesome/free-solid-svg-icons';
import { Configs } from "@/interfaces/DatasetInterface";
import { IconInfoCircle } from '@tabler/icons-react';
import DuplicatesDisplayer from "./displayer/DuplicatesDisplayer";
import { getDuplicates, getOutliers } from "@/functionalities/Utils";
import { useSearchParams } from "next/navigation";
import internal from "stream";
import { outliers_modes } from "./utils";
import metricsFetcher from "../../server/metricsFetcher";



interface ConfigsProps
{
    metricName: string,
    labelFeatureReq?: boolean
}

interface DuplicatesDTO
{
    name: string,
    featureName: string,
    score: number,
    indexes: [ number, number ][]
}

interface OutliersDTO{
    name: string,
    featureName: string,
    score: number,
    indexes: number[], 
    score_per_sample: number[]
}

type MetricType = "duplicates" | "outliers";

export default function Config ( props: ConfigsProps )
{   
    const searchParams = useSearchParams();
    const [ datasetName, setDatasetName ] = useState<string | null>( "" )
    const [ features, setFeatures ] = useState<string[]>( [] )
    const [ labelFeatures, setLabelFeatures ] = useState<string[]>( [] )
    const [ isLoading, setIsLoading ] = useState<boolean>( false )
    const [ duplicates, setDuplicates ] = useState<DuplicatesDTO | null>( null )
    const [ outliers, setOutliers] = useState<OutliersDTO | null>( null )


    const [ featureName, setFeatureName ] = useState<any>( "" )
    const [ labelFeatureName, setLabelFeatureName ] = useState<string>( "" )
    const [ outliers_mode, setOutliersMode ] = useState<string>( "" )


    const [ opened, { open, close } ] = useDisclosure( false );


    const datasetUsed = useStore( ( state ) => state.datasetUsed )

    const configs = useStore( ( state ) => state.metricsConfig )
    const setConfigs = useStore( ( state ) => state.setMetricsConfigs )
    const internalConfigs = useStore.getState().internalConfigs;


    useEffect( () =>
        {
            if ( searchParams.get( "datasetName" ) ) {
                setDatasetName( searchParams.get( "datasetName" ) )
            }
        }, [ searchParams ] )
    

    useEffect( () =>
    {
        if ( Array.isArray( datasetUsed?.features ) ) {
            const extractedFeatures = datasetUsed.features
                .filter( ( { type } ) => type === image_type || type === text_type )
                .map( ( { name } ) => name );

            setFeatures( extractedFeatures );

            if ( props?.labelFeatureReq === true ) {
                const extractedlabelFeatures = datasetUsed.features
                    .filter( ( { type } ) => type === label_type )
                    .map( ( { name } ) => name );

                setLabelFeatures( extractedlabelFeatures )
            }
        }
    }, [ datasetUsed ] )


    const [ showFeatureError, setShowFeatureError ] = useState( false );
    const [ showLabelError, setShowLabelError ] = useState( false );
    const [ showOutliersConfig, setShowOutliersConfig ] = useState( false );
    const [ clicked, setClicked ] = useState( false );
    const [ isDuplicate, setIsDuplicate ] = useState( false );
    const [ computeNow, setComputeNow ] = useState( false );
    const setAddToReport = useStore( ( state ) => state.setAddToReport )


    const handleClickToReport = ( metricName: string ) =>
    {
        setAddToReport( true )
        const newConfig: Configs = {
            metricName: metricName,
            featureName: "",
            internalConfigs: internalConfigs,
        };

        if ( !featureName ) {
            setShowFeatureError( true );

        } else {
            newConfig.featureName = featureName;

            if ( props?.labelFeatureReq ) {
                if ( !labelFeatureName ) {
                    setShowLabelError( true );
                } else {
                    newConfig.labelFeatureName = labelFeatureName;
                    setClicked( true );

                    setTimeout(() => {
                        setClicked(false);
                      }, 3000);
                }
            } else {
                setClicked( true )

                setTimeout(() => {
                    setClicked(false);
                  }, 3000);
            }

            if (props.metricName == "outliers") {
                newConfig.outliersMode = outliers_mode;
            }
        }

        const isDuplicate = configs.some( ( config ) =>

            config.metricName === newConfig.metricName &&
            config.featureName === newConfig.featureName &&
            ( !props?.labelFeatureReq || config.labelFeatureName === newConfig.labelFeatureName ) &&
            JSON.stringify( config.internalConfigs ) === JSON.stringify( newConfig.internalConfigs )
        );

        if ( !isDuplicate && featureName ) {
            setConfigs( [ ...configs, newConfig ] );
            setClicked( true );
            setTimeout(() => {
                setClicked(false);
              }, 3000);
            setIsDuplicate( false )
        } else if ( isDuplicate ) {
            setIsDuplicate( true )
        }
    };

    const handleClickCompute = async () =>
    {
        setIsLoading(true);
        setComputeNow(true);
        try {
          const data = await metricsFetcher(
            props.metricName as MetricType, 
            datasetName as string,
            featureName,
            internalConfigs,
            labelFeatureName,
            outliers_mode
          );

          console.log("DATA FETCHED:", data)
      
          if (props.metricName === "duplicates") setDuplicates(data);
          if (props.metricName === "outliers") setOutliers(data);
        } finally {
          setIsLoading(false);
      }};

      console.log("OUTLIERS:", outliers)
      console.log("DUPLICATES:", duplicates)

    const icon = <IconInfoCircle />;
    console.log( "CONFIGS:", configs )

    const metricComponentMap: Record<string, React.ComponentType> = {
        "duplicates": () => <DuplicatesConfigs />,
        "outliers": () => <OutliersConfig mode={ outliers_mode } />,
    };

    const MetricConfigComponent = metricComponentMap[ props.metricName ];

    return (
        <div>
            <Flex
                direction="row"
                align="end"
                gap="md"
            >

                <Box style={ { position: "relative" } }>
                    <Select
                        id="feature"
                        radius="md"
                        label="Feature"
                        placeholder="Choose feature"
                        data={ features }
                        value={ featureName }
                        onChange={ ( value ) =>
                        {
                            setFeatureName( value );
                            if ( showFeatureError ) setShowFeatureError( false );
                        } }
                        required
                        styles={ ( theme ) => ( {
                            input: {
                                borderColor: showFeatureError ? theme.colors.red[ 6 ] : undefined,
                                '&:hover': {
                                    borderColor: showFeatureError ? theme.colors.red[ 6 ] : undefined,
                                },
                            },
                        } ) }
                    />

                    { showFeatureError && (
                        <Text
                            size="xs"
                            style={ { position: "absolute", top: "100%", marginTop: 4, color: "red" } }
                        >
                            Choose a feature to continue
                        </Text>
                    ) }
                </Box>

                <Box style={ { position: "relative" } }>
                    { props?.labelFeatureReq ? ( <Select
                        id="labelFeature"
                        radius="md"
                        label="Label Feature"
                        placeholder="Choose label"
                        data={ labelFeatures }
                        value={ labelFeatureName }
                        onChange={ ( value ) =>
                        {
                            setLabelFeatureName( value as string );
                            if ( showLabelError ) setShowLabelError( false );
                        } }
                        required={ true }
                        styles={ ( theme ) => ( {
                            input: {
                                borderColor: showLabelError ? theme.colors.red[ 6 ] : undefined,
                                '&:hover': {
                                    borderColor: showLabelError ? theme.colors.red[ 6 ] : undefined,
                                },
                            },
                        } ) }
                    /> ) : null }

                    { showLabelError && (
                        <Text
                            size="xs"
                            style={ { position: "absolute", top: "100%", marginTop: 4, color: "red" } }
                        >
                            Choose a label to continue
                        </Text>
                    ) }
                </Box>

                <Box style={ { position: "relative" } }>
                    { props?.metricName == "outliers" ? ( <Select
                        id="outliers-mode"
                        radius="md"
                        label="Mode"
                        placeholder="Choose a mode to compute outliers"
                        data={ outliers_modes }
                        value={ outliers_mode }
                        onChange={ ( value ) =>
                        {
                            setOutliersMode( value as string );

                            if ( value ) {
                                if ( !showOutliersConfig ) {
                                    setShowOutliersConfig( true );
                                }
                            } else {
                                setShowOutliersConfig( false );
                            }
                        } }
                        required={ true }
                        styles={ ( theme ) => ( {
                            input: {
                                borderColor: showLabelError ? theme.colors.red[ 6 ] : undefined,
                                '&:hover': {
                                    borderColor: showLabelError ? theme.colors.red[ 6 ] : undefined,
                                },
                            },
                        } ) }
                    /> ) : null }

                </Box>

                <Modal opened={ opened } onClose={ close } title="Configurations">
                    { MetricConfigComponent ? <MetricConfigComponent /> : <div>Unsupported metric</div> }
                </Modal>
                <Button variant="default" onClick={ open } radius="md" disabled={ props.metricName == "outliers" && showOutliersConfig == false }>
                    Configs
                </Button>
            </Flex>

            <Flex
                direction="row"
                justify="end"
                gap="md">

                <Button
                    onClick={ () => handleClickToReport( props.metricName ) }
                >
                    { clicked && !isDuplicate ? ( <>
                        <FontAwesomeIcon icon={ faCheck } style={ { marginRight: 8 } } />
                        <span>Added</span></> )
                        : "Add to report" }
                </Button>

                <Button onClick={ handleClickCompute }>
                    Compute now
                </Button>
            </Flex>

            { isDuplicate ? (
                <>
                    <Space h="md" />
                    <Alert variant="light" color="red" withCloseButton onClose={ () => { setIsDuplicate( false ); setClicked( false ) } } title="Attention" icon={ icon }>
                        A metric with this same configuration has been already added. Please change something or choose another metric.
                    </Alert>
                </> ) : null }

                {computeNow ? (
                    isLoading ? (
                        <Flex
                            mih={ 150 }
                            justify="center"
                            align="center"
                            direction="column"
                            wrap="wrap"
                            style={ { width: '100%' } }
                            >
                            <p>Loading...</p>
                            <Loader />
                        </Flex>
                    ) : (
                        <DuplicatesDisplayer duplicates={duplicates as DuplicatesDTO}/>
                    )
                    ) : null}
        </div >
    )
}