"use client"

import { Button, Divider, LoadingOverlay, Modal, Text, Tooltip, Alert, Box, ScrollArea, Title, Flex } from "@mantine/core";
import { useEffect, useState } from "react";
import useStore from "@/store/dsStore";
import { report_post } from "@/properties/urls";
import PDFPreviewModal from "@/components/client/ReportModal";
import { InfoCircle, LinesGraphClipboard } from "@vectopus/atlas-icons-react";
import { useDisclosure } from "@mantine/hooks";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX, faCircleExclamation, faTrashCan  } from '@fortawesome/free-solid-svg-icons';
import SchemaShower from "@/components/client/SchemaShower";
import { labelColorMap } from "@/properties/static";
import { FeatureSchema } from "@/interfaces/genericInterface";
import FeatureDisplayer from "@/components/client/FeatureDisplayer";
import { getPrototypes } from "@/functionalities/BackendUtils";
import { BarChart } from "@mantine/charts";
import '@mantine/charts/styles.css';
import MetricsAddedDisplayer from "@/components/client/metrics/displayer/MetricsAddedDisplayer";



export default function Report() {

    const report = useStore((state) => state.report)
    const [features, setFeatures] = useState<FeatureSchema[]>([])
    const [connections, setConnections] = useState<[string, string][]>([])
    const datasetUsed = useStore((state) => state.datasetUsed)
    const [descriptions, setDescriptions] = useState<string[]>([])

    const prototypesData = useStore((state) => state.prototypesData)
    const labelProtoData = useStore((state) => state.labelProtoData)
    const protoType = datasetUsed?.prototype.type

    const labelToSamples = useStore((state) => state.labelToSamples)

    const [reportOpen, { open, close }] = useDisclosure(false);

    const [showOverview, setShowOverview] = useState<boolean>(true)
    const [showMetrics, setShowMetrics] = useState<boolean>(true)

    const barSize = 60;
    const barSpacing = 30;
    const numberOfBars = labelToSamples.length;
    const chartWidth = numberOfBars * (barSize + barSpacing);

    useEffect(() => {
        if (datasetUsed) {
            setConnections(datasetUsed.edges);

            const allDescriptions: string[] = [];

            if (datasetUsed.description) {
                allDescriptions.push(datasetUsed.description);
            }


            if (Array.isArray(datasetUsed?.features)) {
                const extractedFeatures = datasetUsed.features.map(({ type, name, depth }) => ({
                    type,
                    name,
                    depth,
                }));

                setFeatures(extractedFeatures);

                const featuresDescriptions = datasetUsed.features.map(({ description }) => ({
                    description
                }));

                const filtered: string[] = featuresDescriptions
                    .map(({ description }) => description)
                    .filter((desc): desc is string => typeof desc === 'string');

                allDescriptions.push(...filtered);
                setDescriptions(allDescriptions);
            }
        }
    }, [datasetUsed]);

    console.log("report", report)
    return (
        <>
            <Flex direction="row" justify="space-between" pb="md">
                <span style={{ display: 'flex', alignItems: 'center', gap: "8px" }}>
                    <Title order={2}>Report Brief</Title>
                    <Tooltip
                        multiline
                        w={220}
                        withArrow
                        transitionProps={{ duration: 200 }}
                        label="Here you can adjust your final report: you can eventually eliminate some sections and metrics or also re-order them">
                        <InfoCircle size={17} />
                    </Tooltip>
                </span>
                <Flex direction="row" gap="sm">
                    <Button
                        radius="lg"
                        onClick={open}
                        disabled={report.length === 0}
                    >
                        Show PDF Preview
                    </Button>

                    <PDFPreviewModal opened={reportOpen} close={close} />
                    <Button
                        radius="lg">
                        Download PDF
                    </Button>
                </Flex>
            </Flex>
            <Flex direction="column" gap="md" justify="center" align="flex-start">
                {showOverview ? (
                    <>
                        <Box style={{ border: '1px solid #e0e0e0', borderRadius: 4, padding: "15px" }} mb="md">
                            <span style={{ display: 'flex', alignItems: 'center', gap: "8px" }}>
                                <Title order={3}>Overview Dataset</Title>
                                <Tooltip
                                    multiline
                                    w={220}
                                    withArrow
                                    transitionProps={{ duration: 200 }}
                                    label="Eliminate section from report">
                                    <Button
                                        variant="transparent"
                                        radius="xl"
                                        size="xs"
                                        onMouseDown={(e) => e.stopPropagation()}
                                        onClick={() => { setShowOverview(false) }}
                                        style={{
                                            transition: "background-color 0.2s ease",
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#FCA5A5"} // Lighter red
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                                    >
                                        <FontAwesomeIcon icon={faTrashCan} />
                                    </Button>
                                </Tooltip>
                            </span>
                            <SchemaShower
                                features={features}
                                connections={connections}
                                labelColorMap={labelColorMap}
                                clickable={false}
                            />

                            <Box style={{ marginBottom: '70px' }}>
                                <Text fw={600} component="span">
                                    {datasetUsed?.name || ""}
                                </Text>{" "}
                                is a dataset for {datasetUsed?.task || ""}.
                                {datasetUsed?.n_classes ? <> {" "} It has {datasetUsed?.n_classes || ""} classes and {datasetUsed?.n_samples} samples.{" "}</> : <>It has {datasetUsed?.n_samples}{" "}</>}{descriptions?.map((description, index) => (
                                    <span key={index}>{description} </span>
                                ))}
                            </Box>
                            <Title order={4} mb="sm">Prototypes Preview</Title>
                            <ScrollArea >
                                {prototypesData ? (<Flex
                                    mih={150}
                                    justify="center"
                                    align="center"
                                    direction="column"
                                    wrap="wrap"
                                    style={{ width: '100%' }}
                                >
                                    <div className="overflow-auto">
                                        <FeatureDisplayer featureData={prototypesData as string[]} featureType={protoType as string} labelData={labelProtoData as number[]} columns={4} />
                                    </div>
                                </Flex>) : (
                                    <Alert
                                        variant="light"
                                        color="orange"
                                        radius="md"
                                        title="Warning"
                                        icon={<FontAwesomeIcon icon={faCircleExclamation} />}
                                        style={{ display: 'inline-block', maxWidth: '100%', marginTop: "30px" }}
                                    >
                                        In order to see the preview of the prototypes you need to first compute them on the dedicated page. Otherwise you can see them on the PDF preview.
                                    </Alert>
                                )}
                            </ScrollArea>

                            {labelToSamples.length > 0 ? (
                                <>
                                    <Title order={4} mt="md" mb="md">Graph Section</Title>
                                    <Box
                                        style={{
                                            marginLeft: "30px",
                                            marginRight: "30px",
                                            overflowX: 'auto',
                                            overflowY: 'hidden',
                                            maxWidth: '100%',
                                        }}
                                    >
                                        <BarChart
                                            h={400}
                                            w={chartWidth}
                                            data={labelToSamples}
                                            dataKey="label"
                                            series={[{ name: 'samples', color: '#a9adb9' }]}
                                            barProps={{
                                                barSize: barSize
                                            }}
                                            style={{ paddingRight: barSpacing / 2, paddingBottom: "20px" }}
                                        />
                                    </Box></>) : null}
                        </Box>
                    </>) : (
                    <>
                        <Button
                            variant="light"
                            onClick={() => setShowOverview(true)}>
                            Restore Overview
                        </Button>
                    </>
                )}
                {showMetrics ? (
                    <Box style={{ border: '1px solid #e0e0e0', borderRadius: 4, padding: "15px" }} mt="md">
                        <span style={{ display: 'flex', alignItems: 'center', gap: "8px" }}>
                            <Title order={3}>Metrics</Title>
                            <Tooltip
                                multiline
                                w={220}
                                withArrow
                                transitionProps={{ duration: 200 }}
                                label="Eliminate section from report">
                                <Button
                                    variant="transparent"
                                    radius="xl"
                                    size="xs"
                                    onMouseDown={(e) => e.stopPropagation()}
                                    onClick={() => { setShowMetrics(false) }}
                                    style={{
                                        transition: "background-color 0.2s ease",
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#FCA5A5"} // Lighter red
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                                >
                                    <FontAwesomeIcon icon={faTrashCan} />
                                </Button>
                            </Tooltip>
                        </span>
                        
                    </Box>
                ) : (
                    <Button
                        variant="light"
                        onClick={() => setShowMetrics(true)}>
                        Restore Metrics Sections
                    </Button>)}
            </Flex>

        </>
    )
}