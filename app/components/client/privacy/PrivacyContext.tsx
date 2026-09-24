'use client';

import { Badge, Paper, Select, Slider, Stack, Text } from '@mantine/core';
import { Database, BrainCircuit, Eye } from 'lucide-react';
import { PrivacyDatasetInfo, PrivacyModelInfo } from '@/interfaces/privacyInterfaces';
import { RegisterObjectProps } from '@/interfaces/NNInterfaces';

interface PrivacyContextProps {
    attack?: RegisterObjectProps;
    datasets: PrivacyDatasetInfo[];
    models: PrivacyModelInfo[];
    selectedDatasetId?: string;
    selectedModelId?: string;
    onDatasetChange: (datasetId: string | null) => void;
    onModelChange: (modelId: string | null) => void;
    taskAttrOverride?: string;
    showSurrogateChip?: boolean;
    propertyTargetRatio?: number;
    onPropertyTargetRatioChange?: (value: number) => void;
    propertyName?: string;
    propertyNameOptions?: string[];
    onPropertyNameChange?: (value: string | null) => void;
}

const knowledgeLabel = (attack?: RegisterObjectProps) => {
    if (attack?.privacy_type === 'model_inversion') return 'Black-box';
    const knowledge = attack?.knowledge?.toLowerCase();
    return knowledge?.includes('black') ? 'Black-box' : 'White-box';
};

const PrivacyContext: React.FC<PrivacyContextProps> = ({
    attack,
    datasets,
    models,
    selectedDatasetId,
    selectedModelId,
    onDatasetChange,
    onModelChange,
    taskAttrOverride,
    showSurrogateChip,
    propertyTargetRatio,
    onPropertyTargetRatioChange,
    propertyName,
    propertyNameOptions,
    onPropertyNameChange
}) => {
    const dataset = datasets.find((item) => item.id === selectedDatasetId);
    const model = models.find((item) => item.id === selectedModelId);

    return (
        <Paper className="privacy-context-card" withBorder radius="md" p="md">
            <Stack gap="sm">
                <Text size="xs" fw={700} c="dimmed">ATTACK CONTEXT</Text>

                <div className="privacy-context-row">
                    <Text className="privacy-context-label"><Database size={14} /> Dataset</Text>
                    <Select
                        size="xs"
                        variant="filled"
                        data={datasets.map((item) => ({ value: item.id, label: item.id }))}
                        value={selectedDatasetId ?? null}
                        onChange={onDatasetChange}
                    />
                    <Text size="xs" c="dimmed">{taskAttrOverride ?? dataset?.task_attr ?? 'classification'}</Text>
                </div>

                <div className="privacy-context-row">
                    <Text className="privacy-context-label"><BrainCircuit size={14} /> Model</Text>
                    <Select
                        size="xs"
                        variant="filled"
                        data={models.map((item) => ({ value: item.id, label: item.id }))}
                        value={selectedModelId ?? null}
                        onChange={onModelChange}
                    />
                    {model?.description && <Text size="xs" c="dimmed">{model.description}</Text>}
                    {showSurrogateChip && (
                        <Badge size="xs" color="grape" variant="light">
                            Surrogate: query-trained
                        </Badge>
                    )}
                </div>

                <div className="privacy-context-row">
                    <Text className="privacy-context-label"><Eye size={14} /> Knowledge</Text>
                    <Badge size="sm" color={knowledgeLabel(attack) === 'Black-box' ? 'orange' : 'teal'} variant="light">
                        {knowledgeLabel(attack)}
                    </Badge>
                </div>

                {attack?.privacy_type === 'property_inference' && typeof propertyTargetRatio === 'number' && onPropertyTargetRatioChange && (
                    <>
                        <div className="privacy-context-row">
                            <Text className="privacy-context-label">property_name</Text>
                            <Select
                                size="xs"
                                variant="filled"
                                data={(propertyNameOptions ?? []).map((option) => ({ value: option, label: option }))}
                                value={propertyName ?? null}
                                onChange={onPropertyNameChange}
                            />
                        </div>
                        <div className="privacy-context-row">
                            <Text className="privacy-context-label">property_target_ratio</Text>
                            <Slider
                                min={0}
                                max={1}
                                step={0.05}
                                value={propertyTargetRatio}
                                onChange={onPropertyTargetRatioChange}
                            />
                        </div>
                    </>
                )}
            </Stack>
        </Paper>
    );
};

export default PrivacyContext;
