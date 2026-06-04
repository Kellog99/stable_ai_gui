'use client';

import { useEffect, useMemo, useState } from 'react';
import { Badge, Paper, ScrollArea, SimpleGrid, Stack, Text, Image, Table } from '@mantine/core';
import { PrivacyArtifactRef } from '@/interfaces/privacyInterfaces';
import useBackendVariablesStore from '@/store/globalStore';

interface PrivacyVisualizationProps {
    metrics?: { [key: string]: unknown };
    reconstructions?: string[];
    artifacts?: PrivacyArtifactRef[];
    jobId?: string;
}

interface ImageItem {
    src: string;
    label: string;
}

const toMetricValue = (value: unknown): string => {
    if (typeof value === 'number') return Number.isInteger(value) ? value.toString() : value.toFixed(3);
    if (typeof value === 'boolean') return value ? 'true' : 'false';
    if (value == null) return '-';
    if (typeof value === 'object') {
        return Object.entries(value as Record<string, unknown>)
            .map(([key, item]) => `${key}: ${toMetricValue(item)}`)
            .join(' · ');
    }
    return String(value);
};

const toMetricLabel = (name: string) => name.replaceAll('_', ' ');

const getPropertyResult = (metrics?: { [key: string]: unknown }) => {
    if (!metrics || !('property_prediction' in metrics || 'ground_truth_label' in metrics)) return null;
    return {
        prediction: metrics.property_prediction,
        confidence: metrics.property_confidence,
        groundTruth: metrics.ground_truth_label,
        correct: metrics.correct === true
    };
};

const PrivacyVisualization: React.FC<PrivacyVisualizationProps> = ({
    metrics,
    reconstructions,
    artifacts = [],
    jobId
}) => {
    const { hostname, port } = useBackendVariablesStore();
    const [artifactImages, setArtifactImages] = useState<ImageItem[]>([]);
    const propertyResult = getPropertyResult(metrics);

    const reconstructionLabels = useMemo(() => (
        artifacts
            .filter((artifact) => artifact.artifact_id.startsWith('reconstruction_image_'))
            .map((artifact) => ({
                confidence: Number((artifact.metadata?.confidence as number | undefined) ?? 0),
                label: `Class ${(artifact.metadata?.target_class as string | number | undefined) ?? '-'} · ${Number((artifact.metadata?.confidence as number | undefined) ?? 0).toFixed(3)}`
            }))
            .sort((a, b) => b.confidence - a.confidence)
    ), [artifacts]);

    useEffect(() => {
        if (reconstructions?.length) {
            setArtifactImages([]);
            return;
        }
        const imageArtifacts = artifacts.filter((artifact) => artifact.media_type?.startsWith('image/'));
        if (!jobId || imageArtifacts.length === 0) {
            setArtifactImages([]);
            return;
        }

        let active = true;
        const urls: string[] = [];

        Promise.all(imageArtifacts.map(async (artifact) => {
            const response = await fetch(`http://${hostname}:${port}/privacy/artifact/${jobId}/${artifact.artifact_id}`);
            if (!response.ok) return null;
            const imageUrl = URL.createObjectURL(await response.blob());
            urls.push(imageUrl);
            const confidence = Number((artifact.metadata?.confidence as number | undefined) ?? 0);
            const targetClass = (artifact.metadata?.target_class as string | number | undefined) ?? '-';
            return {
                src: imageUrl,
                label: `Class ${targetClass} · ${confidence.toFixed(3)}`
            };
        })).then((items) => {
            if (active) {
                setArtifactImages(items.filter((item): item is ImageItem => !!item));
            }
        });

        return () => {
            active = false;
            urls.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [artifacts, hostname, port, jobId, reconstructions]);

    if (!metrics) {
        return (
            <div className="empty-state">
                <div className="empty-state-content">
                    <p className="empty-state-text">Run an attack to see statistics and analysis</p>
                </div>
            </div>
        );
    }

    const scalarMetrics = Object.entries(metrics).filter(
        ([, value]) => typeof value !== 'object' || value === null
    );

    // Flatten tpr_at_fpr dict into individual metric cards
    const tprAtFpr = metrics.tpr_at_fpr as Record<string, number> | null | undefined;
    const tprAtFprEntries: [string, string][] = tprAtFpr && typeof tprAtFpr === 'object'
        ? Object.entries(tprAtFpr)
            .sort(([a], [b]) => parseFloat(a) - parseFloat(b))
            .map(([fpr, tpr]) => [`TPR @ FPR ${parseFloat(fpr).toFixed(4)}`, typeof tpr === 'number' ? tpr.toFixed(4) : '-'])
        : [];

    const nestedMetrics = Object.entries(metrics).filter(
        ([key, value]) => typeof value === 'object' && value !== null && key !== 'tpr_at_fpr'
    ) as [string, Record<string, unknown>][];

    return (
        <Stack className="privacy-visualization-container" gap="lg">
            {(scalarMetrics.length > 0 || tprAtFprEntries.length > 0) && (
                <div>
                    <Text className="card-title">Metrics</Text>
                    <SimpleGrid className="privacy-metrics-grid" cols={{ base: 1, sm: 2, md: 3 }} spacing="sm" mt="sm">
                        {scalarMetrics.map(([name, value]) => (
                            <Paper key={name} className="privacy-metric-card" withBorder>
                                <Text className="privacy-metric-label" title={name}>
                                    {toMetricLabel(name)}
                                </Text>
                                <Text className="privacy-metric-value" title={toMetricValue(value)}>
                                    {toMetricValue(value)}
                                </Text>
                            </Paper>
                        ))}
                        {tprAtFprEntries.map(([label, val]) => (
                            <Paper key={label} className="privacy-metric-card" withBorder>
                                <Text className="privacy-metric-label">{label}</Text>
                                <Text className="privacy-metric-value">{val}</Text>
                            </Paper>
                        ))}
                    </SimpleGrid>
                </div>
            )}

            {nestedMetrics.map(([name, value]) => (
                <div key={name}>
                    <Text className="card-title">{toMetricLabel(name)}</Text>
                    <Paper className="privacy-nested-card" withBorder mt="xs">
                        <Table className="privacy-nested-table" layout="fixed">
                            <Table.Tbody>
                                {Object.entries(value).map(([key, item]) => (
                                    <Table.Tr key={key}>
                                        <Table.Td className="privacy-nested-key">{key}</Table.Td>
                                        <Table.Td className="privacy-nested-val">{toMetricValue(item)}</Table.Td>
                                    </Table.Tr>
                                ))}
                            </Table.Tbody>
                        </Table>
                    </Paper>
                </div>
            ))}

            {propertyResult && (
                <Paper withBorder p="sm" radius="md" className="property-result-card">
                    <Text className="privacy-property-title" fw={600} mb="xs">Property Result</Text>
                    <Text className="privacy-property-text" size="sm">Inferred: {toMetricValue(propertyResult.prediction)}</Text>
                    <Text className="privacy-property-text" size="sm">Confidence: {toMetricValue(propertyResult.confidence)}</Text>
                    <Text className="privacy-property-text" size="sm">Ground truth: {toMetricValue(propertyResult.groundTruth)}</Text>
                    <Badge color={propertyResult.correct ? 'teal' : 'red'} mt="xs">
                        {propertyResult.correct ? 'CORRECT' : 'INCORRECT'}
                    </Badge>
                </Paper>
            )}

            {!!reconstructions?.length && (
                <div>
                    <Text className="card-title">Reconstructed Samples</Text>
                    <ScrollArea h={360} mt="sm">
                        <SimpleGrid cols={3} spacing="sm">
                            {reconstructions.map((item, index) => (
                                <Paper key={`recon-${index}`} withBorder p="xs">
                                    <Image src={item.startsWith('data:') ? item : `data:image/png;base64,${item}`} alt={`reconstruction-${index}`} />
                                    <Text size="xs" c="dimmed" mt="xs">
                                        {reconstructionLabels[index]?.label ?? `Sample ${index + 1}`}
                                    </Text>
                                </Paper>
                            ))}
                        </SimpleGrid>
                    </ScrollArea>
                </div>
            )}

            {!reconstructions?.length && !!artifactImages.length && (
                <div>
                    <Text className="card-title">Generated Artifacts</Text>
                    <ScrollArea h={360} mt="sm">
                        <SimpleGrid cols={3} spacing="sm">
                            {artifactImages.map((item, index) => (
                                <Paper key={`artifact-${index}`} withBorder p="xs">
                                    <Image src={item.src} alt={`artifact-${index}`} />
                                    <Text size="xs" c="dimmed" mt="xs">{item.label}</Text>
                                </Paper>
                            ))}
                        </SimpleGrid>
                    </ScrollArea>
                </div>
            )}
        </Stack>
    );
};

export default PrivacyVisualization;
