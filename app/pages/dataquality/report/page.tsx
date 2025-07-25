"use client"

import { Button, Divider, LoadingOverlay, Modal, Text, Tooltip, Alert, Box, ScrollArea, Title, Flex, Paper, Stack, Group } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import useStore from "@/store/dsStore";
import { report_post } from "@/properties/urls";
import PDFPreviewModal from "@/components/client/ReportModal";
import { InfoCircle, LinesGraphClipboard } from "@vectopus/atlas-icons-react";
import { CheckCircle, MoveDown, MoveUp } from "lucide-react";
import { useDisclosure } from "@mantine/hooks";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX, faCircleExclamation, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import SchemaShower from "@/components/client/SchemaShower";
import { labelColorMap } from "@/properties/static";
import { FeatureSchema } from "@/interfaces/genericInterface";
import FeatureDisplayer from "@/components/client/FeatureDisplayer";
import { getPrototypes } from "@/functionalities/BackendUtils";
import { BarChart } from "@mantine/charts";
import '@mantine/charts/styles.css';
import MetricsAddedDisplayer from "@/components/client/metrics/displayer/MetricsAddedDisplayer";
import { MetricResume } from "@/components/client/metrics/displayer/MetricResume";



export default function Report() {

    const report = useStore((state) => state.report)
    const setReport = useStore((state) => state.setReport)

    const [features, setFeatures] = useState<FeatureSchema[]>([])
    const [connections, setConnections] = useState<[string, string][]>([])
    const datasetUsed = useStore((state) => state.datasetUsed)
    const [descriptions, setDescriptions] = useState<string[]>([])

    const [outIndexes, setOutIndexes] = useState<number[]>([])

    const prototypesData = useStore((state) => state.prototypesData)
    const labelProtoData = useStore((state) => state.labelProtoData)
    const protoType = datasetUsed?.prototype.type

    const labelToSamples = useStore((state) => state.labelToSamples)

    const [reportOpen, { open, close }] = useDisclosure(false);

    const labelDict = useStore((state) => state.labelDict)

    const showOverview = useStore((state) => state.showOverview)
    const setShowOverview = useStore((state) => state.setShowOverview)

    const [showAccuracyCard, setShowAccuracyCard] = useState<boolean>(true)

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


    const originalAccuracyItems = useRef<Object[]>([]);

    useEffect(() => {
        // Save items that were originally at positions where name === "accuracy"
        const accuracyItems = report.filter(item => item.results.name === "accuracy");
        originalAccuracyItems.current = accuracyItems;

        // Reorder the list
        const reordered = [
            ...accuracyItems,
            ...report.filter(item => item.results.name !== "accuracy"),
        ];
        setReport(reordered);
    }, []);

    useEffect(() => {
        const currentIndexes = report.map((item, index) => {
            return originalAccuracyItems.current.includes(item) ? index : -1;
        }).filter(index => index !== -1);

        setOutIndexes(currentIndexes);
    }, [report]);

    console.log("OUT INDEXES", outIndexes)


    useEffect(() => {

    }, [])


    console.log("report FINALE", report)

    const handleMoveOutUp = (indexes: number[]) => {
        if (indexes.length === 0) return;

        // Sort indexes to process in block order
        const sortedIndexes = [...indexes].sort((a, b) => a - b);

        // Prevent moving above index 0
        const insertBefore = Math.max(sortedIndexes[0] - 1, 0);

        // Extract the block
        const block = sortedIndexes.map(i => report[i]);

        // Remove the items from report
        const remaining = report.filter((_, idx) => !sortedIndexes.includes(idx));

        // Insert block before `insertBefore` in the remaining list
        const newReport = [
            ...remaining.slice(0, insertBefore),
            ...block,
            ...remaining.slice(insertBefore),
        ];

        setReport(newReport);
    };

    const handleMoveOutDown = (indexes: number[]) => {
        if (indexes.length === 0) return;

        // Sort indexes to preserve block order
        const sortedIndexes = [...indexes].sort((a, b) => a - b);

        // Prevent moving if block ends at the last index
        const lastIndex = report.length - 1;
        if (sortedIndexes[sortedIndexes.length - 1] === lastIndex) return;

        // Extract block
        const block = sortedIndexes.map(i => report[i]);

        // Remove block from report
        const remaining = report.filter((_, idx) => !sortedIndexes.includes(idx));

        // Insert block after the first element *after* the block
        const insertPos = sortedIndexes[sortedIndexes.length - 1] + 1;

        const newReport = [
            ...remaining.slice(0, insertPos),
            ...block,
            ...remaining.slice(insertPos),
        ];

        setReport(newReport);
    };



    const handleCancelOut = (indexes: number[]) => {
        const newReport = report.filter((_, index) => !indexes.includes(index));
        setReport(newReport);
        setShowAccuracyCard(false)
    };

    console.log("OUT INDEXES", outIndexes[outIndexes.length - 1])
    console.log("REPORT LENGTH", report.length)



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
                    {/*
                    <Button
                        radius="lg">
                        Download PDF
                    </Button>
                    */}
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
                                        <FeatureDisplayer featureData={prototypesData as string[]} featureType={protoType as string} labelData={labelProtoData as number[]} label_dict={labelDict as { [key: number]: string }} columns={4} />
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
                                    <div style={{ width: '1000px', margin: '20px auto' }}>

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
                                        </Box></div></>) : null}
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
                <Box style={{ border: '1px solid #e0e0e0', borderRadius: 4, padding: "15px" }} mt="md">
                    <span style={{ display: 'flex', alignItems: 'center', gap: "8px", marginBottom: "8px" }} >
                        <Title order={3}>Metrics</Title>
                    </span>
                    <>
                        {showAccuracyCard && (
                            <Flex direction="row" align="center" justify="flex-start" >
                                <Paper
                                    shadow="sm"
                                    p="lg"
                                    radius="md"
                                    withBorder
                                    style={{
                                        background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
                                        border: '1px solid #e9ecef',
                                        transition: 'all 0.2s ease',
                                        marginBottom: "8px"
                                    }}
                                    className="hover:shadow-lg hover:scale-[1.01] cursor-pointer"
                                >
                                    <Stack gap="md">
                                        <Group justify="space-between" align="flex-start">
                                            <Group gap="sm" align="center" mb="sm">
                                                <CheckCircle size={20} style={{ color: '#228be6' }} />
                                                <Text fw={700} size="lg" c="dark.7">Accuracy</Text>
                                            </Group>
                                        </Group>
                                    </Stack>

                                    {report
                                        .filter(metric => metric.results.name === "accuracy")
                                        .map((metric, index) => (
                                            <MetricResume key={`accuracy-${index}`} metric={metric as any} index={index} />
                                        ))
                                    }
                                </Paper>

                                {outIndexes[0] > 0 &&
                                    (<Tooltip
                                        multiline
                                        withArrow
                                        transitionProps={{ duration: 200 }}
                                        label="Move the metric up">
                                        <Button
                                            variant="transparent"
                                            radius="xl"
                                            size="xs"
                                            onClick={() => handleMoveOutUp(outIndexes as number[])}
                                            style={{
                                                transition: "background-color 0.2s ease",
                                            }}
                                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#a5d8ff")} // lighter blue
                                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                                        >
                                            <MoveUp size={14} />
                                        </Button>
                                    </Tooltip>)}

                                {outIndexes[outIndexes.length - 1] < report.length && (<Tooltip
                                    multiline
                                    withArrow
                                    transitionProps={{ duration: 200 }}
                                    label="Move the metric down">
                                    <Button
                                        variant="transparent"
                                        radius="xl"
                                        size="xs"
                                        onClick={() => handleMoveOutDown(outIndexes as number[])}
                                        style={{
                                            transition: "background-color 0.2s ease",
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#a5d8ff"} // Lighter red
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                                    >
                                        <MoveDown size={14} />
                                    </Button>
                                </Tooltip>)}


                                <Tooltip
                                    multiline
                                    withArrow
                                    transitionProps={{ duration: 200 }}
                                    label="Eliminate metric from report">
                                    <Button
                                        variant="transparent"
                                        radius="xl"
                                        size="xs"
                                        onClick={() => handleCancelOut(outIndexes as number[])}
                                        style={{
                                            transition: "background-color 0.2s ease",
                                        }}
                                        disabled={report.length == outIndexes.length}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#FCA5A5"} // Lighter red
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                                    >
                                        <FontAwesomeIcon icon={faTrashCan} />
                                    </Button>
                                </Tooltip>

                            </Flex>)}


                        {report
                            .map((metric, index) => ({ metric, index })) // attach original index
                            .filter(({ metric }) => metric.results.name !== "accuracy") // filter by condition
                            .map(({ metric, index }) => (
                                <MetricResume key={`other-${index}`} metric={metric as any} index={index} />
                            ))}
                    </>


                </Box>

            </Flex>

        </>
    )
}