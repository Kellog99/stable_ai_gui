"use client";

import Dataset, { ReportMetric } from "@/interfaces/genericInterface";
import { CompletenessDTO, DuplicatesDTO, MetricType, OutliersDTO } from "@/interfaces/metricsInterface";
import { embedding_type, image_type, label_type, text_type } from "@/properties/types";
import { faCheck, faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Alert, Box, Button, Code, Flex, Loader, Modal, Select, Space, Text, Textarea } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconInfoCircle } from '@tabler/icons-react';
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import useStore from '../../../store/dsStore';
import metricsFetcher from "../../server/metricsFetcher";
import CompletenessConfig from "./CompletenessConfig";
import CompletenessDisplayer from "./displayer/CompletenessDisplayer";
import DuplicatesDisplayer from "./displayer/DuplicatesDisplayer";
import OutlierDisplayer from "./displayer/OutlierDisplayer";
import DuplicatesConfigs from "./DuplicatesConfig";
import OutliersConfig from "./OutliersConfig";
import { outliers_modes } from "./utils";
import { IsFeatureBond } from "@/functionalities/Utils";
import { getCompletenessOK } from "@/functionalities/BackendUtils";
import Link from "next/link";
import classes from "../../../styles/Config.module.css"
import { AlertCust } from "../AlertCustom";



interface ConfigsProps {
    metricName: string,
    labelFeatureReq?: boolean
}

export default function Config(props: ConfigsProps) {
    const searchParams = useSearchParams();
    const [datasetName, setDatasetName] = useState<string | null>("")
    const [features, setFeatures] = useState<string[]>([])
    const [labelFeatures, setLabelFeatures] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [computed, setComputed] = useState<boolean>(false)
    const [duplicates, setDuplicates] = useState<DuplicatesDTO | null>(null)
    const [outliers, setOutliers] = useState<OutliersDTO | null>(null)
    const [completeness, setCompleteness] = useState<CompletenessDTO | null>(null)


    const [featureName, setFeatureName] = useState<any>("")
    const [labelFeatureName, setLabelFeatureName] = useState<string>("")
    const [outliers_mode, setOutliersMode] = useState<string>("")


    const [opened, { open, close }] = useDisclosure(false);


    const datasetUsed = useStore((state) => state.datasetUsed)

    const configs = useStore((state) => state.metricsConfig)
    const setConfigs = useStore((state) => state.setMetricsConfigs)
    const internalConfigs = useStore.getState().internalConfigs;
    const setInternalConfigs = useStore((state) => state.setInternalConfigs)


    const [inputReq, setInputReq] = useState('');

    const handleRequirements = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const inputValue = event.target.value;
        setInputReq(inputValue);

        const lines = inputValue
            .split('\n')
            .map(line => line.trim())
            .filter(line => line !== '');

        setInternalConfigs({ requirements: lines });
        if (showRequirementsError) setShowRequirementsError(false);
    };


    console.log("INTERNAL CONFIGS:", internalConfigs)


    useEffect(() => {
        setComputeNow(false)
        setComputed(false)

    }, [inputReq])


    useEffect(() => {
        if (searchParams.get("datasetName")) {
            setDatasetName(searchParams.get("datasetName"))
        }
    }, [searchParams])


    useEffect(() => {
        if (Array.isArray(datasetUsed?.features)) {
            const extractedFeatures = datasetUsed.features
                .filter(({ type }) => type === image_type || type === text_type)
                .map(({ name }) => name);

            setFeatures(extractedFeatures);

            if (props?.labelFeatureReq === true) {
                const extractedlabelFeatures = datasetUsed.features
                    .filter(({ type }) => type === label_type)
                    .map(({ name }) => name);

                setLabelFeatures(extractedlabelFeatures)
            }
        }
    }, [datasetUsed])


    const [showFeatureError, setShowFeatureError] = useState(false);
    const [showLabelError, setShowLabelError] = useState(false);
    const [showRequirementsError, setShowRequirementsError] = useState(false);
    const [showOutliersConfig, setShowOutliersConfig] = useState(false);
    const [clicked, setClicked] = useState(false);
    const [isDuplicate, setIsDuplicate] = useState(false);
    const [computeNow, setComputeNow] = useState(false);
    const [isCompletenessOK, setIsCompletenessOK] = useState<boolean>(true)

    const report = useStore((state) => state.report)
    const [reportMetric, setReportMetric] = useState<ReportMetric | null>(null)
    const setReport = useStore((state) => state.setReport)

    const setAddToReport = useStore((state) => state.setAddToReport)

    console.log("REPORT", report)

    useEffect(() => {
        setComputeNow(false)
    }, [featureName, outliers_mode, labelFeatureName, configs])



    useEffect(() => {
        if (featureName && datasetName) {
            getCompletenessOK(datasetName, featureName)
                .then((fetched) => {
                    if (fetched === true) {
                        setIsCompletenessOK(true)
                    } else if (fetched === false) {
                        setIsCompletenessOK(false)
                    }
                })
        }
    }, [featureName])



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

        if (props.metricName === "completeness" && !inputReq) {
            setShowRequirementsError(true);
            hasValidationErrors = true;
        }


        const isDuplicate = report.some((metricReport) =>
            (
                props.metricName === "duplicates"
                    ? metricReport.results.name === "uniqueness"
                    : props.metricName === "outliers"
                        ? metricReport.results.name === "accuracy"
                        : metricReport.results.name === props.metricName
            ) &&
            metricReport.results.featureName === featureName &&
            (!props?.labelFeatureReq || metricReport.results.labelFeatureName === labelFeatureName) &&
            JSON.stringify(metricReport.internalConfigs) === JSON.stringify(newReportMetric.internalConfigs) &&
            (metricReport.results.name === "accuracy" && metricReport.results.mode === outliers_mode)
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
                if (props.metricName === "completeness") setCompleteness(data);

                newReportMetric.results = data;
                newReportMetric.internalConfigs = internalConfigs;

            } catch (error) {
                // Handle error appropriately
                console.error("Error computing metrics:", error);
            } finally {
                setIsLoading(false);
                setComputed(true);
                setIsDuplicate(false)
                setReportMetric(newReportMetric)
            }
        } else if (isDuplicate) {
            setIsDuplicate(true)
            setClicked(false)
            setComputeNow(false)

        }
    };


    const handleSaveToReport = () => {
        if (reportMetric) {
            setClicked(true)
            setTimeout(() => {
                setClicked(false);
                setComputed(false)
            }, 3000);
            setIsDuplicate(false)
            setReport([...report, reportMetric]);
        }

    }

    console.log("REPORT:", report)

    const icon = <IconInfoCircle />;
    console.log("CONFIGS:", configs)

    const metricComponentMap: Record<string, React.ComponentType> = {
        "duplicates": () => <DuplicatesConfigs />,
        "outliers": () => <OutliersConfig mode={outliers_mode} />,
        "completeness": () => <CompletenessConfig />
    };

    const MetricConfigComponent = metricComponentMap[props.metricName];


    const metricDisplayerMap: Record<string, React.ComponentType> = {
        "duplicates": () => <DuplicatesDisplayer duplicates={duplicates as DuplicatesDTO} />,
        "outliers": () => <OutlierDisplayer outliers={outliers as OutliersDTO} />,
        "completeness": () => <CompletenessDisplayer completeness={completeness as CompletenessDTO} requirements={internalConfigs.requirements} />
    };

    const MetricDisplayerComponent = metricDisplayerMap[props.metricName];

    return (
        <div>
            <div className={classes.featureBox}>
                {props.metricName === "completeness" && (
                    <>
                        <div style={{ marginBottom: "15px" }}>
                            <AlertCust result={"warning"}
                                textToDisplay={
                                    <>
                                        This metric can only be computed if the available embeddings were generated using the following model: <Code>apple/DFN5B-CLIP-ViT-H-14-378</Code>.
                                        Please ensure that embeddings from this model are available for the selected feature.
                                    </>} />
                        </div>


                        {!isCompletenessOK && (
                            <>
                                <div style={{ marginBottom: "15px" }}>
                                    <AlertCust
                                        result={"error"}
                                        textToDisplay={<>
                                            The selected feature has not embeddings computed with this model <Code>apple/DFN5B-CLIP-ViT-H-14-378</Code>! You can compute them on
                                            the dedicated page <Link href="/pages/dataquality/actions/embeddings?autoSelectModel=true">here</Link>
                                        </>} />
                                </div>
                                {/*
                            <Alert
                                variant="light"
                                color="red"
                                radius="md"
                                title="Ops!"
                                icon={<FontAwesomeIcon icon={faCircleExclamation} />}
                                style={{ display: 'inline-block', width: '800px', marginBottom: "30px" }}
                            >
                                The selected feature has not embeddings computed with this model <Code>apple/DFN5B-CLIP-ViT-H-14-378</Code>! You can compute them on
                                the dedicated page <Link href="/pages/dataquality/actions/embeddings?autoSelectModel=true">here</Link>

                            </Alert>
                            */}
                            </>
                        )}
                    </>
                )}
                <Flex
                    direction="row"
                    align="flex-end"
                    gap="md"
                >

                    <Box style={{ position: "relative" }}>
                        <Select
                            id="feature"
                            radius="md"
                            label="Feature"

                            placeholder="Choose feature"
                            data={features}
                            value={featureName}
                            onChange={(value) => {
                                setFeatureName(value);
                                if (showFeatureError) setShowFeatureError(false);
                            }}
                            required
                            styles={(theme) => ({
                                input: {
                                    borderColor: showFeatureError ? theme.colors.red[6] : undefined,
                                    borderWidth: showFeatureError ? 2.5 : 1,   // ✅ thicker border on error
                                    '&:hover': {
                                        borderColor: showFeatureError ? theme.colors.red[6] : undefined,
                                    },
                                },
                            })}
                        />

                        {showFeatureError && (
                            <Text
                                size="xs"
                                c="red"
                                style={{ position: "absolute", top: "100%", marginTop: 4 }}
                            >
                                Choose a feature to continue
                            </Text>
                        )}
                    </Box>

                    <Box style={{ position: "relative" }}>
                        {props?.labelFeatureReq ? (
                            <Select
                                id="labelFeature"
                                radius="md"
                                label="Label Feature"
                                placeholder="Choose label"
                                data={labelFeatures}
                                value={labelFeatureName}
                                onChange={(value) => {
                                    setLabelFeatureName(value as string);
                                    if (showLabelError) setShowLabelError(false);
                                }}
                                required={true}
                                styles={(theme) => ({
                                    input: {
                                        borderColor: showLabelError ? theme.colors.red[6] : undefined,
                                        borderWidth: showLabelError ? 2.5 : 1,
                                        '&:hover': {
                                            borderColor: showLabelError ? theme.colors.red[6] : undefined,
                                        },
                                    },
                                })}
                            />) : null}

                        {showLabelError && (
                            <Text
                                size="xs"
                                c="red"
                                style={{ position: "absolute", top: "100%", marginTop: 4 }}
                            >
                                Choose a label to continue
                            </Text>
                        )}

                    </Box>

                    <Box style={{ position: "relative" }}>
                        {props?.metricName == "outliers" ? (<Select
                            id="outliers-mode"
                            radius="md"
                            label="Mode"
                            placeholder="Choose a mode to compute outliers"
                            data={outliers_modes}
                            value={outliers_mode}
                            onChange={(value) => {
                                setOutliersMode(value as string);

                                if (value) {
                                    if (!showOutliersConfig) {
                                        setShowOutliersConfig(true);
                                    }
                                } else {
                                    setShowOutliersConfig(false);
                                }
                            }}
                            required={true}
                            styles={(theme) => ({
                                input: {
                                    borderColor: showLabelError ? theme.colors.red[6] : undefined,
                                    borderWidth: showLabelError ? 2.5 : 1,
                                    '&:hover': {
                                        borderColor: showLabelError ? theme.colors.red[6] : undefined,
                                    },
                                },
                            })}
                        />) : null}

                    </Box>
                    {props.metricName == "completeness" ? (
                        <Box style={{ position: "relative" }}>
                            <Textarea
                                label="Requirements"
                                radius="md"
                                size="xs"
                                placeholder="Write each requirement in a different line."
                                autosize
                                required={true}
                                value={inputReq}
                                disabled={!isCompletenessOK}
                                onChange={handleRequirements}
                                styles={(theme) => ({
                                    input: {
                                        width: "400px",
                                        borderColor: showRequirementsError ? theme.colors.red[6] : undefined,
                                        borderWidth: showRequirementsError ? 2.5 : 1,
                                        '&:hover': {
                                            borderColor: showRequirementsError ? theme.colors.red[6] : undefined,
                                        },
                                    },
                                    label: {
                                        color: "white"
                                    }
                                })} />
                            {showRequirementsError && (
                                <Text
                                    size="xs"
                                    c="red"
                                    style={{ position: "absolute", top: "100%", marginTop: 4 }}
                                >
                                    Write at least one requirement to continue
                                </Text>
                            )}
                        </Box>
                    ) :
                        (<>

                            <Modal.Root
                                opened={opened}
                                onClose={close}
                                centered
                            >
                                <Modal.Overlay
                                    backgroundOpacity={0.55}
                                    blur={3} />
                                <Modal.Content
                                    style={{
                                        borderRadius: "12px",
                                        overflow: "hidden",
                                    }}
                                >
                                    <Modal.Header
                                        style={{
                                            backgroundColor: "#334155",
                                            justifyContent: "center", // centers title
                                            borderBottom: "1px solid white", // white divider line
                                            padding: "16px",
                                        }}
                                    >
                                        <Modal.Title style={{ fontWeight: 700, fontSize: "1.25rem", color:"white" }}>
                                            Configurations
                                        </Modal.Title>
                                        <Modal.CloseButton
                                            style={{ position: "absolute", right: "16px", top: "16px", color: "white" }}
                                        />
                                    </Modal.Header>

                                    <Modal.Body style={{ padding: "20px", backgroundColor: "#334155", }}>
                                        {MetricConfigComponent ? (
                                            <MetricConfigComponent />
                                        ) : (
                                            <div>Unsupported metric</div>
                                        )}
                                    </Modal.Body>
                                </Modal.Content>
                            </Modal.Root>


                            {/*
                            <Modal
                                opened={opened}
                                onClose={close}
                                title="Configurations"
                                centered
                                overlayProps={{
                                    backgroundOpacity: 0.55,
                                    blur: 3,
                                }}>




                                {MetricConfigComponent ? <MetricConfigComponent /> : <div>Unsupported metric</div>}
                            </Modal>
                            */}

                            <Button variant="default" onClick={open} size="xs" radius="md" disabled={props.metricName == "outliers" && showOutliersConfig == false}>
                                Configs
                            </Button>
                        </>)
                    }
                </Flex>
                <Space h="xl" />
                <Flex
                    direction="row"
                    justify="end"
                    gap="md">
                    <Button
                        onClick={handleSaveToReport}
                        disabled={!computed}
                    >
                        {clicked && !isDuplicate ? (<>
                            <FontAwesomeIcon icon={faCheck} style={{ marginRight: 8 }} />
                            <span>Saved</span></>)
                            : "Save to report"}
                    </Button>

                    <Button
                        onClick={handleClickCompute}
                        disabled={props.metricName == "completeness" && !isCompletenessOK}>
                        Compute now
                    </Button>
                </Flex>

                {isDuplicate ? (
                    <>
                        <Space h="md" />
                        <AlertCust
                            result={"error"}
                            textToDisplay={"A metric with this same configuration has been already computed. Please change something or choose another metric."} />
                        {/*
                        <Alert variant="light" color="red" withCloseButton onClose={() => { setIsDuplicate(false); setClicked(false) }} title="Attention" icon={icon}>
                            A metric with this same configuration has been already computed. Please change something or choose another metric.
                        </Alert>
                        */}
                    </>) : null}

            </div>


            {computeNow ? (
                isLoading ? (
                    <Flex
                        mih={150}
                        justify="center"
                        align="center"
                        direction="column"
                        wrap="wrap"
                        style={{ width: '100%' }}
                    >
                        <Text>Loading...</Text>
                        <Loader />
                    </Flex>
                ) : (

                    MetricDisplayerComponent ?

                        <MetricDisplayerComponent />
                        : <div>Unsupported metric</div>

                )
            ) : null}
        </div >
    )
}