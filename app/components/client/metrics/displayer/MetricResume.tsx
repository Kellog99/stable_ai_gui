import useStore from "@/store/dsStore";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, Flex, Tooltip, Text, List, Paper, Stack, Group, Badge, Divider } from "@mantine/core";
import { CheckCircle, Hash, MoveDown, MoveUp, Settings } from "lucide-react";

interface Metric {
    internalConfigs: any;  // Use lowercase `object`, or better: define the actual structure
    results: any;
}

// Component should accept props like this
interface MetricProps {
    metric: Metric;
    index: number;
    outIndexes: number[];
}

export function MetricResume({ metric, index, outIndexes }: MetricProps) {

    const report = useStore((state) => state.report)
    const setReport = useStore((state) => state.setReport)

    const results = metric.results
    const configs = metric.internalConfigs

    const getScoreColor = (score: number) => {
        if (score >= 0.8) return 'green';
        if (score >= 0.6) return 'yellow';
        if (score >= 0.4) return 'orange';
        return 'red';
    };

    const formatScore = (score: number) => {
        return (score * 100).toFixed(1) + '%';
    };

    const handleCancel = (indexC: number) => {
        const newReport = report.filter((_, index) => index !== indexC);
        setReport(newReport)
    }

    const handleMoveUp = (indexC: number) => {
        if (!outIndexes.includes(indexC) && (outIndexes.includes(indexC - 1))) {
            const element = report.splice(indexC, 1)[0]; // Remove element
            report.splice(indexC - outIndexes.length, 0, element); // Insert element (don't capture return)
            setReport([...report]);
        } else {
            const element = report.splice(indexC, 1)[0]; // Remove element
            report.splice(indexC - 1, 0, element); // Insert element (don't capture return)
            setReport([...report]);
        }
    }

    const handleMoveDown = (indexC: number) => {
        if (!outIndexes.includes(indexC) && (outIndexes.includes(indexC +1))) {
            const element = report.splice(indexC, 1)[0]; // Remove element
            report.splice(indexC + outIndexes.length, 0, element); // Insert element (don't capture return)
            setReport([...report]);
        } else {
            const element = report.splice(indexC, 1)[0]; // Remove element
            report.splice(indexC + 1, 0, element); // Insert element (don't capture return)
            setReport([...report]);
        }
    }

    return (
        <>
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
                            <Group gap="sm" align="center">
                                <CheckCircle size={20} style={{ color: '#228be6' }} />

                                {results.name == "accuracy" ?
                                    (<Text fw={700} size="lg" c="dark.7">{results.mode}</Text>) : (
                                        <Text fw={700} size="lg" c="dark.7">{results.name}</Text>
                                    )}

                            </Group>
                            <Badge
                                color={getScoreColor(results.score)}
                                variant="light"
                                size="lg"
                                radius="md"
                            >
                                {formatScore(results.score)}
                            </Badge>
                        </Group>

                        <Divider color="gray.2" />

                        {/* Feature Information */}
                        <Group gap="xs" align="center">
                            <Hash size={16} style={{ color: '#868e96' }} />
                            <Text size="sm" c="gray.7" fw={500}>
                                Computed on: {results.featureName}
                            </Text>
                            {/*
                            <Badge variant="outline" color="blue" size="sm">
                                {results.featureName}
                            </Badge>
                            */}
                        </Group>

                        {/* Configurations Section */}
                        {Object.keys(configs).length > 0 ? (
                            <>
                                <Group gap="xs" align="center" mt="xs">
                                    <Settings size={16} style={{ color: '#868e96' }} />
                                    <Text size="sm" c="gray.7" fw={500}>
                                        Configuration:
                                    </Text>
                                </Group>

                                <Box
                                    p="sm"
                                    style={{
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: '8px',
                                        border: '1px solid #e9ecef',
                                    }}
                                >
                                    <List size="sm" spacing="xs">
                                        {Object.entries(configs).map(([key, value], index2) => (
                                            <List.Item
                                                key={`config-${key}-${index}-${index2}`}
                                                style={{
                                                    padding: '4px 0',
                                                }}
                                            >
                                                <Group gap="xs" wrap="nowrap">
                                                    <Text fw={600} size="xs" c="blue.7" style={{ minWidth: 'fit-content' }}>
                                                        {key}:
                                                    </Text>
                                                    <Badge
                                                        variant="light"
                                                        color="gray"
                                                        size="xs"
                                                        style={{
                                                            fontFamily: 'monospace',
                                                            textTransform: 'none',
                                                        }}
                                                    >
                                                        {typeof value === 'string' ? value : JSON.stringify(value)}
                                                    </Badge>
                                                </Group>
                                            </List.Item>
                                        ))}
                                    </List>
                                </Box>
                            </>
                        ) : (<Group gap="xs" align="center" mt="xs">
                            <Settings size={16} style={{ color: '#868e96' }} />
                            <Text size="sm" c="gray.7" fw={500}>
                                Configuration: default
                            </Text>
                        </Group>)}
                    </Stack>
                </Paper>
            
                {index > 0 && report.length > 1 && index !== outIndexes[0] &&
                    (<Tooltip
                        multiline
                        withArrow
                        transitionProps={{ duration: 200 }}
                        label="Move the metric up">
                        <Button
                            variant="transparent"
                            radius="xl"
                            size="xs"
                            onClick={() => handleMoveUp(index as number)}
                            style={{
                                transition: "background-color 0.2s ease",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#a5d8ff")} // lighter blue
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                        >
                            <MoveUp size={14} />
                        </Button>
                    </Tooltip>)}

                {index + 1 < report.length && report.length > 1 && index !== outIndexes[outIndexes.length - 1] && (<Tooltip
                    multiline
                    withArrow
                    transitionProps={{ duration: 200 }}
                    label="Move the metric down">
                    <Button
                        variant="transparent"
                        radius="xl"
                        size="xs"
                        onClick={() => handleMoveDown(index as number)}
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
                        onClick={() => handleCancel(index as number)}
                        style={{
                            transition: "background-color 0.2s ease",
                        }}
                        disabled={report.length==1}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#FCA5A5"} // Lighter red
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                    >
                        <FontAwesomeIcon icon={faTrashCan} />
                    </Button>
                </Tooltip>
            </Flex>
        </>
    )
}