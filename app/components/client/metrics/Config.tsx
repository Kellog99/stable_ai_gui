"use client";

import { getCompletenessOK, saveMetricToReport } from "@/functionalities/BackendUtils";
import { ReportMetric } from "@/interfaces/genericInterface";
import { CompletenessDTO, DuplicatesDTO, OutliersDTO } from "@/interfaces/metricsInterface";
import { image_type, label_type, text_type } from "@/properties/types";
import { completeness_start, duplicates_start, metrics_progress, outliers_start } from "@/properties/urls";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, Code, Flex, Modal, Select, Space, Text, Textarea } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Settings } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import useStore, { useActionStore } from "@/store/dsStore";
import classes from "@/styles/Config.module.css";
import { AlertCust } from "../AlertCustom";
import AsyncTaskTracker from "../AsyncTracker";
import CompletenessDisplayer from "./displayer/CompletenessDisplayer";
import DuplicatesDisplayer from "./displayer/DuplicatesDisplayer";
import OutlierDisplayer from "./displayer/OutlierDisplayer";
import DuplicatesConfigs from "./DuplicatesConfig";
import OutliersConfig from "./OutliersConfig";
import { outliers_modes } from "./utils";



interface ConfigsProps
{
    metricName: string,
    labelFeatureReq?: boolean
}

export default function Config ( props: ConfigsProps )
{

    const [ features, setFeatures ] = useState<string[]>( [] )
    const [ labelFeatures, setLabelFeatures ] = useState<string[]>( [] )
    const [ isLoading, setIsLoading ] = useState<boolean>( false )
    const [ computed, setComputed ] = useState<boolean>( false )

    const waitForActionResult = useActionStore( ( s ) => s.waitForActionResult );
    const actionResult = useActionStore( ( s ) => s.actionResult );
    const setActionResult = useActionStore( ( state ) => state.setActionResult );


    const [ duplicates, setDuplicates ] = useState<DuplicatesDTO | null>( null )
    const [ outliers, setOutliers ] = useState<OutliersDTO | null>( null )
    const [ completeness, setCompleteness ] = useState<CompletenessDTO | null>( null )


    const [ featureName, setFeatureName ] = useState<any>( "" )
    const [ labelFeatureName, setLabelFeatureName ] = useState<string>( "" )
    const [ outliers_mode, setOutliersMode ] = useState<string>( "" )


    const [ opened, { open, close } ] = useDisclosure( false );


    //const datasetUsed = useStore( ( state ) => state.datasetUsed )
    const datasetUsed = useStore((state) => state.dataset)
    const datasetName = datasetUsed?.name

    const configs = useStore( ( state ) => state.metricsConfig )
    const internalConfigs = useStore.getState().internalConfigs;
    const setInternalConfigs = useStore( ( state ) => state.setInternalConfigs )


    const [ inputReq, setInputReq ] = useState( '' );

    const handleRequirements = ( event: React.ChangeEvent<HTMLTextAreaElement> ) =>
    {
        const inputValue = event.target.value;
        setInputReq( inputValue );

        const lines = inputValue
            .split( '\n' )
            .map( line => line.trim() )
            .filter( line => line !== '' );

        setInternalConfigs( { requirements: lines } );
        if ( showRequirementsError ) setShowRequirementsError( false );
    };


    console.log( "INTERNAL CONFIGS:", internalConfigs )


    useEffect( () =>
    {
        setComputeNow( false )
        setComputed( false )

    }, [ inputReq ] )



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
    const [ showRequirementsError, setShowRequirementsError ] = useState( false );
    const [ showOutliersConfig, setShowOutliersConfig ] = useState( false );
    const [ showOutliersModeError, setShowOutliersModeError ] = useState( false )
    const [ clicked, setClicked ] = useState( false );
    const [ isDuplicate, setIsDuplicate ] = useState( false );
    const [ computeNow, setComputeNow ] = useState( false );
    const [ isCompletenessOK, setIsCompletenessOK ] = useState<boolean>( true )

    const report = useStore( ( state ) => state.report )
    const setReport = useStore( ( state ) => state.setReport )

    const [reportToSave, setReportToSave] = useState<Object[]>( [] )
    const [ reportMetric, setReportMetric ] = useState<ReportMetric | null>( null )
    

    const endoPointMap: Record<string, string> = {
        duplicates: duplicates_start,
        outliers: outliers_start,
        completeness: completeness_start
    };

    let adjustedOutliersMode = outliers_mode;

    if ( outliers_mode === "isolation forest" ) {
        adjustedOutliersMode = "iforest";
    }

    const configTracker = {
        datasetName: datasetUsed?.name,
        featureName: featureName,
        ...( props.metricName === "outliers" && { outliersMode: adjustedOutliersMode } ),
    };

    useEffect( () =>
    {
        setComputeNow( false )
    }, [ featureName, outliers_mode, labelFeatureName, configs ] )



    useEffect( () =>
    {
        if ( featureName && datasetName ) {
            getCompletenessOK( datasetName, featureName )
                .then( ( fetched ) =>
                {
                    if ( fetched === true ) {
                        setIsCompletenessOK( true )
                    } else if ( fetched === false ) {
                        setIsCompletenessOK( false )
                    }
                } )
        }
    }, [ featureName ] )

    const handleClickCompute = async () =>
    {

        const newReportMetric: ReportMetric = {
            internalConfigs: internalConfigs,
            results: {}
        };

        let hasValidationErrors = false;

        if ( !featureName ) {
            setShowFeatureError( true );
            hasValidationErrors = true;
        }

        if ( props.metricName === "outliers" && !outliers_mode ) {
            setShowOutliersModeError( true );
            hasValidationErrors = true
        }

        if ( props?.labelFeatureReq && !labelFeatureName ) {
            setShowLabelError( true );
            hasValidationErrors = true;
        }

        if ( props.metricName === "completeness" && !inputReq ) {
            setShowRequirementsError( true );
            hasValidationErrors = true;
        }


        const isDuplicate = report?.some( ( metricReport ) =>
            (
                props.metricName === "duplicates"
                    ? metricReport.results.name === "uniqueness"
                    : props.metricName === "outliers"
                        ? metricReport.results.name === "accuracy"
                        : metricReport.results.name === props.metricName
            ) &&
            metricReport.results.featureName === featureName &&
            ( !props?.labelFeatureReq || metricReport.results.labelFeatureName === labelFeatureName ) &&
            JSON.stringify( metricReport.internalConfigs ) === JSON.stringify( newReportMetric.internalConfigs ) &&
            ( metricReport.results.name === "accuracy" && metricReport.results.mode === outliers_mode )
        );


        if ( !hasValidationErrors && !isDuplicate ) {
            setIsLoading( true );
            setComputeNow( true );

            try {
                const results = await waitForActionResult();

                if ( props.metricName === "duplicates" ) setDuplicates( results.data as DuplicatesDTO );
                if ( props.metricName === "outliers" ) setOutliers( results.data as OutliersDTO );
                if ( props.metricName === "completeness" ) setCompleteness( results.data as CompletenessDTO );

                newReportMetric.results = results.data;
                newReportMetric.internalConfigs = internalConfigs;

            } catch ( error ) {
                // Handle error appropriately
                console.error( "Error computing metrics:", error );
            } finally {
                setIsLoading( false );
                setComputed( true );
                setIsDuplicate( false )
                setReportMetric( newReportMetric )
            }

        } else if ( isDuplicate ) {
            setIsDuplicate( true )
            setClicked( false )
            setComputeNow( false )

        }
    };


    const handleSaveToReport = () =>
    {
        if ( reportMetric ) {

            console.log("REPORT METRIC TO SAVE:", reportMetric)

            setClicked( true )
            setTimeout( () =>
            {
                setClicked( false );
                setComputed( false )
            }, 3000 );
            setIsDuplicate( false )

            setReport( [ ...report, reportMetric ] );  ///deve diventare una variabile di useState e non dello store!! 
            
            setReportToSave([...reportToSave, reportMetric.results]);
            saveMetricToReport( datasetName as string, [ ...report, reportMetric ] );
            setReportToSave( [] )
             
        }

    }

    console.log("Report TO SAVE", reportToSave)
    console.log( "REPORT:", report )


    console.log( "CONFIGS:", configs )

    const metricComponentMap: Record<string, React.ComponentType> = {
        "duplicates": () => <DuplicatesConfigs />,
        "outliers": () => <OutliersConfig mode={ outliers_mode } />
    };

    const MetricConfigComponent = metricComponentMap[ props.metricName ];


    const metricDisplayerMap: Record<string, React.ComponentType> = {
        "duplicates": () => <DuplicatesDisplayer duplicates={ duplicates as DuplicatesDTO } />,
        "outliers": () => <OutlierDisplayer outliers={ outliers as OutliersDTO } />,
        "completeness": () => <CompletenessDisplayer completeness={ completeness as CompletenessDTO } requirements={ internalConfigs.requirements } />
    };

    const MetricDisplayerComponent = metricDisplayerMap[ props.metricName ];

    return (
        <div>
            <div className={ classes.featureBox }>
                { props.metricName === "completeness" && (
                    <>
                        <div style={ { marginBottom: "15px" } }>
                            <AlertCust result={ "warning" }
                                textToDisplay={
                                    <>
                                        This metric can only be computed if the available embeddings were generated using the following model: <Code>apple/DFN5B-CLIP-ViT-H-14-378</Code>.
                                        Please ensure that embeddings from this model are available for the selected feature.
                                    </> } />
                        </div>


                        { !isCompletenessOK && (
                            <>
                                <div style={ { marginBottom: "15px" } }>
                                    <AlertCust
                                        result={ "error" }
                                        textToDisplay={ <>
                                            The selected feature has not embeddings computed with this model <Code>apple/DFN5B-CLIP-ViT-H-14-378</Code>! You can compute them on
                                            the dedicated page <Link href="/pages/dataquality/actions/embeddings?autoSelectModel=true">here</Link>
                                        </> } />
                                </div>
                            </>
                        ) }
                    </>
                ) }
                <Flex
                    direction="row"
                    align="flex-end"
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
                            clearable
                            onClear={ () => setActionResult( { origin: "", data: {} } ) }
                            styles={ ( theme ) => ( {
                                input: {
                                    borderColor: showFeatureError ? theme.colors.red[ 6 ] : undefined,
                                    borderWidth: showFeatureError ? 2.5 : 1,   // ✅ thicker border on error
                                    '&:hover': {
                                        borderColor: showFeatureError ? theme.colors.red[ 6 ] : undefined,
                                    },
                                },
                            } ) }
                        />

                        { showFeatureError && (
                            <Text
                                size="xs"
                                c="red"
                                style={ { position: "absolute", top: "100%", marginTop: 4 } }
                            >
                                Choose a feature to continue
                            </Text>
                        ) }
                    </Box>

                    <Box style={ { position: "relative" } }>
                        { props?.labelFeatureReq ? (
                            <Select
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
                                clearable
                                onClear={ () => setActionResult( { origin: "", data: {} } ) }
                                styles={ ( theme ) => ( {
                                    input: {
                                        borderColor: showLabelError ? theme.colors.red[ 6 ] : undefined,
                                        borderWidth: showLabelError ? 2.5 : 1,
                                        '&:hover': {
                                            borderColor: showLabelError ? theme.colors.red[ 6 ] : undefined,
                                        },
                                    },
                                } ) }
                            /> ) : null }

                        { showLabelError && (
                            <Text
                                size="xs"
                                c="red"
                                style={ { position: "absolute", top: "100%", marginTop: 4 } }
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
                                if ( showOutliersModeError ) setShowOutliersModeError( false );
                                if ( value ) {
                                    if ( !showOutliersConfig ) {
                                        setShowOutliersConfig( true );
                                    }
                                } else {
                                    setShowOutliersConfig( false );
                                }
                            } }
                            required={ true }
                            clearable
                            onClear={ () => setActionResult( { origin: "", data: {} } ) }
                            styles={ ( theme ) => ( {
                                input: {
                                    borderColor: showOutliersModeError ? theme.colors.red[ 6 ] : undefined,
                                    borderWidth: showOutliersModeError ? 2.5 : 1,
                                    '&:hover': {
                                        borderColor: showOutliersModeError ? theme.colors.red[ 6 ] : undefined,
                                    },
                                },
                            } ) }
                        /> ) : null }

                        { showOutliersModeError && (
                            <Text
                                size="xs"
                                c="red"
                                style={ { position: "absolute", top: "100%", marginTop: 4 } }
                            >
                                Choose a mode to continue
                            </Text>
                        ) }

                    </Box>
                    { props.metricName == "completeness" ? (
                        <Box style={ { position: "relative" } }>
                            <Textarea
                                label="Requirements"
                                radius="md"
                                size="xs"
                                placeholder="Write each requirement in a different line."
                                autosize
                                required={ true }
                                value={ inputReq }
                                disabled={ !isCompletenessOK }
                                onChange={ handleRequirements }
                                styles={ ( theme ) => ( {
                                    input: {
                                        width: "400px",
                                        borderColor: showRequirementsError ? theme.colors.red[ 6 ] : undefined,
                                        borderWidth: showRequirementsError ? 2.5 : 1,
                                        '&:hover': {
                                            borderColor: showRequirementsError ? theme.colors.red[ 6 ] : undefined,
                                        },
                                    },
                                    label: {
                                        color: "white"
                                    }
                                } ) } />
                            { showRequirementsError && (
                                <Text
                                    size="xs"
                                    c="red"
                                    style={ { position: "absolute", top: "100%", marginTop: 4 } }
                                >
                                    Write at least one requirement to continue
                                </Text>
                            ) }
                        </Box>
                    ) :
                        ( <>

                            <Modal.Root
                                opened={ opened }
                                onClose={ close }
                                centered
                            >
                                <Modal.Overlay
                                    backgroundOpacity={ 0.55 }
                                    blur={ 3 } />
                                <Modal.Content
                                    style={ {
                                        borderRadius: "12px",
                                        overflow: "hidden",
                                    } }
                                >
                                    <Modal.Header
                                        style={ {
                                            backgroundColor: "#334155",
                                            justifyContent: "center", // centers title
                                            borderBottom: "1px solid white", // white divider line
                                            padding: "16px",
                                        } }
                                    >
                                        <Modal.Title style={ { fontWeight: 700, fontSize: "1.25rem", color: "white" } }>
                                            Configurations
                                        </Modal.Title>
                                        <Modal.CloseButton
                                            style={ { position: "absolute", right: "16px", top: "16px" } }
                                        />
                                    </Modal.Header>

                                    <Modal.Body style={ { padding: "20px", backgroundColor: "#334155", } }>
                                        { MetricConfigComponent ? (
                                            <MetricConfigComponent />
                                        ) : (
                                            <div>Unsupported metric</div>
                                        ) }
                                    </Modal.Body>
                                </Modal.Content>
                            </Modal.Root>

                            <Button variant="default" onClick={ open } size="xs" radius="md" disabled={ props.metricName == "outliers" && showOutliersConfig == false }>
                                <Settings size={ 18 } style={ { marginRight: "8px" } } />
                                Configs
                            </Button>
                        </> )
                    }
                </Flex>
                <Space h="xl" />
                <Flex direction="row" justify="end" gap="md">

                    <Button
                        onClick={ handleSaveToReport }
                        disabled={ !computed }
                        className={ `${classes.buttonBase} ${classes.saveReport}` }
                    >
                        { clicked && !isDuplicate ? (
                            <>
                                <FontAwesomeIcon icon={ faCheck } style={ { marginRight: 8 } } />
                                <span>Saved</span>
                            </>
                        ) : (
                            "Save to report"
                        ) }
                        <div className={ classes.saveReportHighlight }></div>
                    </Button>


                    <Button
                        onClick={ handleClickCompute }
                        disabled={ props.metricName === "completeness" && !isCompletenessOK }
                        className={ `${classes.buttonBase} ${classes.computeNow}` }
                    >
                        Compute now
                        <div className={ classes.computeNowHighlight }></div>
                    </Button>
                </Flex>

                { isDuplicate ? (
                    <>
                        <Space h="md" />
                        <AlertCust
                            result={ "error" }
                            textToDisplay={ "A metric with this same configuration has been already computed. Please change something or choose another metric." } />

                    </> ) : null }

            </div>


            { computeNow ? (
                isLoading ? (
                    <>
                        <AsyncTaskTracker
                            action={ props.metricName }
                            startEndpoint={ endoPointMap[ props.metricName ] }
                            startParams={ configTracker }
                            startBody={ internalConfigs }
                            progressEndpoint={ metrics_progress }
                            pollInterval={ 0 }
                            progressDisplayMode={ false } />
                    </>

                ) : (

                    MetricDisplayerComponent ?

                        <MetricDisplayerComponent />
                        : <div>Unsupported metric</div>

                )
            ) : null }
        </div >
    )
}