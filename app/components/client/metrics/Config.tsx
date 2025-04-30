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
import { Configs, ReportMetric } from "@/interfaces/DatasetInterface";
import { IconInfoCircle } from '@tabler/icons-react';
import DuplicatesDisplayer from "./displayer/DuplicatesDisplayer";
import { useSearchParams } from "next/navigation";
import internal from "stream";
import { outliers_modes } from "./utils";
import metricsFetcher from "../../server/metricsFetcher";
import OutlierDisplayer from "./displayer/OutlierDisplayer";
import { DuplicatesDTO, OutliersDTO } from "@/interfaces/metricsInterface";
import { config } from "process";
import { truncate } from "lodash";



interface ConfigsProps
{
    metricName: string,
    labelFeatureReq?: boolean
}

type MetricType = "duplicates" | "outliers";

export default function Config ( props: ConfigsProps )
{   
    const searchParams = useSearchParams();
    const [ datasetName, setDatasetName ] = useState<string | null>( "" )
    const [ features, setFeatures ] = useState<string[]>( [] )
    const [ labelFeatures, setLabelFeatures ] = useState<string[]>( [] )
    const [ isLoading, setIsLoading ] = useState<boolean>( false )
    const [computed, setComputed] = useState<boolean>(false)
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

    const report = useStore((state) => state.report)
    const [reportMetric, setReportMetric] = useState<ReportMetric | null>(null)
    const setReport = useStore((state) => state.setReport)

    const setAddToReport = useStore( ( state ) => state.setAddToReport )


    useEffect(() => {
        setComputeNow(false)
    }, [featureName, outliers_mode, labelFeatureName, configs ])

    {/*
    const handleClickToReport = ( metricName: string ) =>
    {
        setAddToReport( true )
        const newConfig: Configs = {
            metricName: metricName,
            featureName: "",
            internalConfigs: internalConfigs,
            results: {}
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
    */}

    const handleClickCompute = async () => {
        const newReportMetric: ReportMetric = {
          internalConfigs: internalConfigs,
          results: {}
        };
        
        let hasValidationErrors = false;
        
        if (!featureName) {
          setShowFeatureError(true);
          hasValidationErrors = true;
        }
        
        if (props?.labelFeatureReq && !labelFeatureName) {
          setShowLabelError(true);
          hasValidationErrors = true;
        }

        
        const isDuplicate = report.some( ( metricReport ) =>
            (props.metricName === "duplicates"
                ? metricReport.results.name === "uniqueness"
                : metricReport.results.name === props.metricName) &&
            metricReport.results.featureName === featureName &&
            ( !props?.labelFeatureReq || metricReport.results.labelFeatureName === labelFeatureName ) &&
            JSON.stringify( metricReport.internalConfigs ) === JSON.stringify( newReportMetric.internalConfigs )
        );

        
        if (!hasValidationErrors && !isDuplicate) {
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
            
            if (props.metricName === "duplicates") setDuplicates(data);
            if (props.metricName === "outliers") setOutliers(data);
            newReportMetric.results = data;
            newReportMetric.internalConfigs = internalConfigs;

          } catch (error) {
            // Handle error appropriately
            console.error("Error computing metrics:", error);
          } finally {
            setIsLoading(false);
            setComputed(true);
            setReportMetric(newReportMetric)
          }
        } else if (isDuplicate) {
            console.log("DUPLICATO BECCATO")
        }
      };


      const handleSaveToReport = () => {
        if (reportMetric) {
            setReport( [ ...report, reportMetric ] );
          }
        
      }

      console.log("REPORT:", report)

      console.log("OUTLIERS:", outliers)
      console.log("DUPLICATES:", duplicates)

    const icon = <IconInfoCircle />;
    console.log( "CONFIGS:", configs )

    const metricComponentMap: Record<string, React.ComponentType> = {
        "duplicates": () => <DuplicatesConfigs />,
        "outliers": () => <OutliersConfig mode={ outliers_mode } />,
    };

    const MetricConfigComponent = metricComponentMap[ props.metricName ];

    
    const metricDisplayerMap: Record<string, React.ComponentType> = {
        "duplicates": () => <DuplicatesDisplayer duplicates={duplicates as DuplicatesDTO} />,
        "outliers": () => <OutlierDisplayer outliers={outliers as OutliersDTO} />,
    };

    const MetricDisplayerComponent = metricDisplayerMap[ props.metricName ];

    return (
        <div style={{
            marginLeft:"100px",
            marginRight: "100px"
        }}>
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
            <Space h="xl"/>
            <Flex
                direction="row"
                justify="start"
                gap="md">

                <Button
                    onClick={handleSaveToReport}
                    disabled={!computed}
                >
                    { clicked && !isDuplicate ? ( <>
                        <FontAwesomeIcon icon={ faCheck } style={ { marginRight: 8 } } />
                        <span>Added</span></> )
                        : "Save to report" }
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
                         MetricDisplayerComponent ? <MetricDisplayerComponent /> : <div>Unsupported metric</div> 
                    )
                    ) : null}
        </div >
    )
}