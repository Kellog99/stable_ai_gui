"use client"

import FeatureDisplayer from "@/components/client/FeatureDisplayer";
import PDFPreviewModal from "@/components/client/ReportModal";
import SchemaShower from "@/components/client/SchemaShower";
import { FeatureSchema } from "@/interfaces/genericInterface";
import useStore from "@/store/dsStore";
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Button, Flex, Group, Paper, ScrollArea, Stack, Text, Title, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { InfoCircle } from "@vectopus/atlas-icons-react";
import { CheckCircle, Download, IdCardLanyard, MoveDown, MoveUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import classes from './page.module.css';

import '@mantine/charts/styles.css';

import { AlertCust } from "@/components/client/AlertCustom";
import { BarChartCustom } from "@/components/client/BarChart";
import { MetricResume } from "@/components/client/metrics/displayer/MetricResume";
import { labelColorMapType } from "@/properties/static";
import { DQReportProps } from "@/interfaces/reportInterfaces";
import HeaderPageTask from "@/components/client/utils/HeaderPageTask";

export default function Report() {

    const report = useStore((state) => state.report) as DQReportProps
    const setReport = useStore((state) => state.setReport)

    //const report = useStore((state) => state.reportFromBE) as DQReportProps
    //const setReport = useStore((state) => state.setReportFromBE)

    console.log("REPORT IN PAGE", report)

    const [features, setFeatures] = useState<FeatureSchema[]>([])
    const [connections, setConnections] = useState<[string, string][]>([])
    //const datasetUsed = useStore((state) => state.dataset)
    const datasetUsed = report.dataset
    const [descriptions, setDescriptions] = useState<string[]>([])

    const [outIndexes, setOutIndexes] = useState<number[]>([])

    const prototypesData = useStore((state) => state.prototypesData)
    const labelProtoData = useStore((state) => state.labelProtoData)
    const protoType = datasetUsed?.prototype.type

    //const labelToSamples = useStore((state) => state.labelToSamples)
    const labelToSamples:any[] = []
    const [reportOpen, { open, close }] = useDisclosure(false);

    const labelDict = useStore((state) => state.labelDict)

    const showOverview = useStore((state) => state.showOverview)
    const setShowOverview = useStore((state) => state.setShowOverview)

    const [showAccuracyCard, setShowAccuracyCard] = useState<boolean>(true)

    useEffect(() => {
        if (report.dataset) {
            setConnections(report.dataset.edges);

            const allDescriptions: string[] = [];

            if (report.dataset.description) {
                allDescriptions.push(report.dataset.description);
            }

            if (Array.isArray(report.dataset.features)) {
                const extractedFeatures = report.dataset.features.map(({ type, name, depth }) => ({
                    type,
                    name,
                    depth,
                }));

                setFeatures(extractedFeatures);

                const featuresDescriptions = report.dataset.features.map(({ description }) => ({
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
        const accuracyItems = report.metrics.filter(item => item.results.name === "accuracy");
        originalAccuracyItems.current = accuracyItems;

        // Reorder the list
        const reordered = [
            ...accuracyItems,
            ...report.metrics.filter(item => item.results.name !== "accuracy"),
        ];

        const updatedReport = {
            ...report,
            metrics: reordered
        };
        setReport(updatedReport);
    }, []);

    useEffect(() => {
        const currentIndexes = report.metrics.map((item, index) => {
            return originalAccuracyItems.current.includes(item) ? index : -1;
        }).filter(index => index !== -1);

        setOutIndexes(currentIndexes);
    }, [report]);

    useEffect(() => {

    }, [])


    const handleMoveOutUp = (indexes: number[]) => {
        if (indexes.length === 0) return;
        const sortedIndexes = [...indexes].sort((a, b) => a - b);

        const insertBefore = Math.max(sortedIndexes[0] - 1, 0);

        const block = sortedIndexes.map(i => report.metrics[i]);

        const remaining = report.metrics.filter((_, idx) => !sortedIndexes.includes(idx));

        const newReport = [
            ...remaining.slice(0, insertBefore),
            ...block,
            ...remaining.slice(insertBefore),
        ];

        const updatedReport = {
            ...report,
            metrics: newReport
        };
        setReport(updatedReport);

    };

    const handleMoveOutDown = (indexes: number[]) => {
        if (indexes.length === 0) return;

        const sortedIndexes = [...indexes].sort((a, b) => a - b);

        const lastIndex = report.metrics.length - 1;
        if (sortedIndexes[sortedIndexes.length - 1] === lastIndex) return;

        const block = sortedIndexes.map(i => report.metrics[i]);

        const remaining = report.metrics.filter((_, idx) => !sortedIndexes.includes(idx));

        const insertPos = sortedIndexes[sortedIndexes.length - 1] + 1;

        const newReport = [
            ...remaining.slice(0, insertPos),
            ...block,
            ...remaining.slice(insertPos),
        ];

        const updatedReport = {
            ...report,
            metrics: newReport
        };
        setReport(updatedReport);

    };

    const handleCancelOut = (indexes: number[]) => {
        const newReport = report.metrics.filter((_, index) => !indexes.includes(index));

        const updatedReport = {
            ...report,
            metrics: newReport
        };

        setReport(updatedReport);
        setShowAccuracyCard(false)
    };

    return (
        <div style={{ marginTop: '20px' }}>
            <HeaderPageTask
                Icon={IdCardLanyard}
                title="Quality Report"
                descrition="Here you can adjust your final report: you can eventually eliminate some sections and metrics or also re-order them"
                buttonprops={{
                    description: "Show PDF Preview",
                    isDisabled: false,
                    handleClick: open,
                    Icon: Download
                }}
            />
            <PDFPreviewModal opened={reportOpen} close={close} />

            <Flex direction="column" gap="md" justify="center" align="flex-start">
                {showOverview ? (
                    <>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <span
                                style={{
                                    display: "flex",
                                    alignItems: "flex-end",
                                    gap: "8px",
                                }}
                            >

                                <h2 style={{ color: "white", marginBottom: 0 }}>Overview</h2>

                                <Tooltip
                                    multiline
                                    withArrow
                                    transitionProps={{ duration: 200 }}
                                    label="Eliminate section from report"
                                >
                                    <Button
                                        variant="transparent"
                                        radius="xl"
                                        size="xs"
                                        onMouseDown={(e) => e.stopPropagation()}
                                        onClick={() => setShowOverview(false)}
                                        style={{
                                            transition: "background-color 0.2s ease",
                                            marginTop: "2px", // pushes it down to match text baseline
                                        }}
                                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#FCA5A5")}
                                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                                    >
                                        <FontAwesomeIcon icon={faTrashCan} />
                                    </Button>
                                </Tooltip>
                            </span>
                            <div className={classes.datasetDivider}></div>
                        </div>



                        <SchemaShower
                            features={features}
                            connections={connections}
                            labelColorMap={labelColorMapType}
                            clickable={false}
                        />

                        <Box style={{ marginBottom: '70px' }}>
                            <Text>
                                <span style={{ fontWeight: 600 }}>
                                    {datasetUsed?.name || ""}
                                </span>{" "}
                                is a dataset for {datasetUsed?.task || ""}.
                                {datasetUsed?.n_classes ? (
                                    <> {" "} It has {datasetUsed?.n_classes || ""} classes and {datasetUsed?.n_samples} samples.{" "}</>
                                ) : (
                                    <>It has {datasetUsed?.n_samples}{" "}</>
                                )}
                                {descriptions?.map((description, index) => (
                                    <span key={index}>{description} </span>
                                ))}
                            </Text>
                        </Box>

                        {/*
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
                                    <AlertCust result={"warning"} textToDisplay={"In order to see the preview of the prototypes you need to first compute them on the dedicated page. Otherwise you can see them on the PDF preview."} />
                                )}
                            </ScrollArea>
                            */}

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
                                        <BarChartCustom
                                            data={labelToSamples}
                                            keyL="labels" />
                                    </Box>
                                </div>
                            </>) : null}

                    </>) : (
                    <>
                        <Button
                            variant="light"
                            onClick={() => setShowOverview(true)}>
                            Restore Overview
                        </Button>
                    </>
                )}

                <span style={{ display: 'flex', flexDirection:"column", alignItems: 'left',justifyContent:"left", marginBottom: "8px" }} >
                    <h2 style={{ color: "white", marginBottom: 0 }}>Metrics</h2>
                    <div className={classes.datasetDivider}></div>
                </span>
                <>
                    {report.metrics.map((metric, index) => {
                        if (metric.results.name === "accuracy") {

                            const firstAccuracyIndex = report.metrics.findIndex(m => m.results.name === "accuracy");
                            if (index !== firstAccuracyIndex) {
                                return null;
                            }

                            if (!showAccuracyCard) return null;

                            const accuracyMetrics = report.metrics.filter(m => m.results.name === "accuracy");
                            const accuracyIndexes = report.metrics
                                .map((m, i) => ({ metric: m, index: i }))
                                .filter(({ metric }) => metric.results.name === "accuracy")
                                .map(({ index }) => index);
                            return (
                                <Flex key={`accuracy-block-${index}`} direction="row" align="center" justify="flex-start">
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

                                        {/* Render all accuracy metrics */}
                                        {accuracyMetrics.map((accuracyMetric, accuracyIndex) => (
                                            <MetricResume
                                                key={`accuracy-metric-${accuracyIndex}`}
                                                metric={accuracyMetric as any}
                                                index={report.metrics.findIndex(m => m === accuracyMetric)}
                                                outIndexes={outIndexes}
                                            />
                                        ))}
                                    </Paper>

                                    {firstAccuracyIndex > 0 && (
                                        <Tooltip
                                            multiline
                                            withArrow
                                            transitionProps={{ duration: 200 }}
                                            label="Move the metric up">
                                            <Button
                                                variant="transparent"
                                                radius="xl"
                                                size="xs"
                                                onClick={() => handleMoveOutUp(accuracyIndexes)}
                                                style={{
                                                    transition: "background-color 0.2s ease",
                                                }}
                                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#a5d8ff")}
                                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                                            >
                                                <MoveUp size={14} />
                                            </Button>
                                        </Tooltip>
                                    )}

                                    {accuracyIndexes[accuracyIndexes.length - 1] < report.metrics.length - 1 && (
                                        <Tooltip
                                            multiline
                                            withArrow
                                            transitionProps={{ duration: 200 }}
                                            label="Move the metric down">
                                            <Button
                                                variant="transparent"
                                                radius="xl"
                                                size="xs"
                                                onClick={() => handleMoveOutDown(accuracyIndexes)}
                                                style={{
                                                    transition: "background-color 0.2s ease",
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#a5d8ff"}
                                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                                            >
                                                <MoveDown size={14} />
                                            </Button>
                                        </Tooltip>
                                    )}

                                    <Tooltip
                                        multiline
                                        withArrow
                                        transitionProps={{ duration: 200 }}
                                        label="Eliminate metric from report">
                                        <Button
                                            variant="transparent"
                                            radius="xl"
                                            size="xs"
                                            onClick={() => handleCancelOut(accuracyIndexes)}
                                            style={{
                                                transition: "background-color 0.2s ease",
                                            }}
                                            disabled={report.metrics.length === accuracyIndexes.length}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                                        >
                                            <FontAwesomeIcon icon={faTrashCan} />
                                        </Button>
                                    </Tooltip>
                                </Flex>
                            );
                        } else {
                            return (
                                <MetricResume
                                    key={`other-${index}`}
                                    metric={metric as any}
                                    index={index}
                                    outIndexes={outIndexes} />
                            );
                        }
                    })}
                </>

            </Flex>
        </div>
    )
}