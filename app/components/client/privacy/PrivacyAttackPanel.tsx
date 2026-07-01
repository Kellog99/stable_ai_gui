'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ChartCandlestick, Shield } from 'lucide-react';
import { Loader, Text } from '@mantine/core';
import { useInterval } from '@mantine/hooks';
import useNNTrustStore from '@/store/nnTrustStore';
import useBackendVariablesStore from '@/store/globalStore';
import { RegisterObjectProps } from '@/interfaces/NNInterfaces';
import { PrivacyAttackOutput, PrivacyDatasetInfo, PrivacyModelInfo } from '@/interfaces/privacyInterfaces';
import { getAttacksList, getPrivacyDatasetsList, getPrivacyModelsList, getPrivacyJobResult, getPrivacyJobStatus, startPrivacyJob } from '@/functionalities/TITANNServices/get_info';
import VulnerabilitySelection from '../utils/VulnerabilitySelection';
import ModalButton from '../test/ModalButton';
import PrivacyContext from './PrivacyContext';
import PrivacyVisualization from './PrivacyVisualization';
import './MembershipInference.css';

interface PrivacyAttackPanelProps {
    privacyType: 'membership_inference' | 'property_inference' | 'reconstruction' | 'model_inversion';
    title: string;
    description: string;
}

const CANONICAL_PAIRING: Record<string, { dataset: string; model: string }> = {
    membership_inference: { dataset: 'cifar10', model: 'resnet18' },
    property_inference: { dataset: 'celeba', model: 'property_mlp' },
    reconstruction: { dataset: 'att_faces', model: 'face_mlp' },
    model_inversion: { dataset: 'cifar10', model: 'resnet18' },
};

const COMPATIBLE_CONTEXT: Record<string, { datasets: string[]; models: string[] }> = {
    membership_inference: { datasets: ['cifar10'], models: ['resnet18'] },
    property_inference: { datasets: ['celeba'], models: ['property_mlp'] },
    reconstruction: { datasets: ['att_faces'], models: ['face_mlp'] },
    model_inversion: { datasets: ['cifar10'], models: ['resnet18'] },
};

const PrivacyAttackPanel: React.FC<PrivacyAttackPanelProps> = ({
    privacyType,
    title,
    description
}) => {
    const { hostname, port } = useBackendVariablesStore();
    const { privacyAttacks, setAttacks, setPrivacyAttacks } = useNNTrustStore();
    const [datasets, setDatasets] = useState<PrivacyDatasetInfo[]>([]);
    const [models, setModels] = useState<PrivacyModelInfo[]>([]);
    const [selectedAttack, setSelectedAttack] = useState<RegisterObjectProps | undefined>(undefined);
    const [selectedDatasetId, setSelectedDatasetId] = useState<string | undefined>(undefined);
    const [selectedModelId, setSelectedModelId] = useState<string | undefined>(undefined);
    const [jobState, setJobState] = useState<'idle' | 'running' | 'completed' | 'failed'>('idle');
    const [showResults, setShowResults] = useState(false);
    const [jobId, setJobId] = useState<string | undefined>(undefined);
    const [result, setResult] = useState<PrivacyAttackOutput | undefined>(undefined);
    const [error, setError] = useState<string | undefined>(undefined);
    const [propertyTargetRatio, setPropertyTargetRatio] = useState<number>(0.6);
    const [propertyNameOverride, setPropertyNameOverride] = useState<string | undefined>(undefined);
    const jobIdRef = useRef<string | undefined>(undefined);

    const attacks = useMemo(() => (
        Object.fromEntries(
            Object.entries(privacyAttacks).filter(([_, attack]) => attack.privacy_type === privacyType)
        )
    ), [privacyAttacks, privacyType]);
    const compatibleDatasets = useMemo(() => {
        const allowed = COMPATIBLE_CONTEXT[privacyType]?.datasets ?? [];
        const filtered = datasets.filter((dataset) => allowed.includes(dataset.id));
        return filtered.length > 0 ? filtered : datasets;
    }, [datasets, privacyType]);
    const compatibleModels = useMemo(() => {
        const allowed = COMPATIBLE_CONTEXT[privacyType]?.models ?? [];
        const filtered = models.filter((model) => allowed.includes(model.id));
        return filtered.length > 0 ? filtered : models;
    }, [models, privacyType]);

    useEffect(() => {
        getPrivacyDatasetsList(hostname, port).then(setDatasets).catch(console.error);
        getPrivacyModelsList(hostname, port).then(setModels).catch(console.error);
    }, [hostname, port]);

    useEffect(() => {
        if (Object.keys(privacyAttacks).length > 0) return;
        getAttacksList(hostname, port)
            .then((allAttacks) => {
                setAttacks(
                    Object.fromEntries(
                        Object.entries(allAttacks).filter(([_, attack]) => attack.objective !== 'privacy')
                    )
                );
                setPrivacyAttacks(
                    Object.fromEntries(
                        Object.entries(allAttacks).filter(([_, attack]) => attack.objective === 'privacy')
                    )
                );
            })
            .catch(console.error);
    }, [hostname, port, privacyAttacks, setAttacks, setPrivacyAttacks]);

    const attackListKey = useMemo(() => Object.keys(attacks).sort().join(','), [attacks]);

    useEffect(() => {
        const firstAttack = Object.values(attacks)[0];
        setResult(undefined);
        setError(undefined);
        setJobState('idle');
        setJobId(undefined);
        jobIdRef.current = undefined;
        if (privacyType === 'property_inference') {
            const defaultTargetRatio = firstAttack?.parameters?.find((parameter) => parameter.id === 'property_target_ratio')?.default;
            setPropertyTargetRatio(typeof defaultTargetRatio === 'number' ? defaultTargetRatio : 0.6);
            const defaultPropertyName = firstAttack?.parameters?.find((parameter) => parameter.id === 'property_name')?.default;
            if (typeof defaultPropertyName === 'string') {
                setPropertyNameOverride(defaultPropertyName);
                setSelectedAttack(firstAttack);
                return;
            }
            setPropertyNameOverride(undefined);
        }
        setSelectedAttack(firstAttack);
    }, [attackListKey, privacyType]);

    useEffect(() => {
        const canonical = CANONICAL_PAIRING[privacyType];
        if (compatibleDatasets.length > 0) {
            setSelectedDatasetId(compatibleDatasets.some((dataset) => dataset.id === canonical.dataset) ? canonical.dataset : compatibleDatasets[0].id);
        }
        if (compatibleModels.length > 0) {
            setSelectedModelId(compatibleModels.some((model) => model.id === canonical.model) ? canonical.model : compatibleModels[0].id);
        }
    }, [compatibleDatasets, compatibleModels, privacyType]);

    const pollInterval = useInterval(async () => {
        if (!jobIdRef.current) return;
        try {
            const status = await getPrivacyJobStatus(hostname, port, jobIdRef.current);
            if (status.status === 'completed') {
                pollInterval.stop();
                const output = await getPrivacyJobResult(hostname, port, jobIdRef.current);
                setResult(output);
                setJobState('completed');
                setError(undefined);
                return;
            }
            if (status.status === 'failed') {
                pollInterval.stop();
                setJobState('failed');
                setError('Attack execution failed. Please retry.');
            }
        } catch (err) {
            pollInterval.stop();
            setJobState('failed');
            setError(err instanceof Error ? err.message : 'Unable to read job status');
        }
    }, 2000);

    useEffect(() => () => pollInterval.stop(), [pollInterval]);

    useEffect(() => {
        if (jobState === 'completed') {
            setShowResults(true);
        }
    }, [jobState]);

    const handleChange = (values: (number | string)[]) => {
        if (!selectedAttack?.parameters) return;
        const updatedAttack = {
            ...selectedAttack,
            parameters: selectedAttack.parameters.map((parameter, index) => ({
                ...parameter,
                default: values[index]
            }))
        };
        const propertyNameValue = updatedAttack.parameters.find((parameter) => parameter.id === 'property_name')?.default;
        if (typeof propertyNameValue === 'string') setPropertyNameOverride(propertyNameValue);
        const ratioValue = updatedAttack.parameters.find((parameter) => parameter.id === 'property_target_ratio')?.default;
        if (typeof ratioValue === 'number') setPropertyTargetRatio(ratioValue);
        setSelectedAttack(updatedAttack);
        setPrivacyAttacks({ ...privacyAttacks, [selectedAttack.id]: updatedAttack });
    };

    const getParameter = (parameterId: string) => selectedAttack?.parameters?.find((parameter) => parameter.id === parameterId)?.default;
    const propertyNameFromParams = typeof getParameter('property_name') === 'string' ? getParameter('property_name') as string : undefined;
    const propertyName = propertyNameOverride ?? propertyNameFromParams;
    const taskAttrFromParams = typeof getParameter('task_attr') === 'string' ? getParameter('task_attr') as string : undefined;
    const propertyNameOptions = selectedAttack?.parameters?.find((parameter) => parameter.id === 'property_name')?.options ?? [];
    const ratioParam = getParameter('property_target_ratio');
    const propertyTargetRatioFromParams = typeof ratioParam === 'number' ? ratioParam : undefined;
    const effectivePropertyTargetRatio = propertyTargetRatioFromParams ?? propertyTargetRatio;

    const handlePostRequest = async () => {
        if (!selectedAttack || !selectedDatasetId || !selectedModelId || jobState === 'running') return;
        const dataset = compatibleDatasets.find((item) => item.id === selectedDatasetId);
        const model = compatibleModels.find((item) => item.id === selectedModelId);
        if (!dataset || !model) return;

        setJobState('running');
        setResult(undefined);
        setError(undefined);

        const body = {
            attack: selectedAttack,
            dataset: {
                id: dataset.id,
                task_attr: privacyType === 'property_inference' ? (taskAttrFromParams ?? dataset.task_attr) : dataset.task_attr,
                use_embeddings: dataset.use_embeddings,
            },
            model: {
                id: model.id,
                source_type: 'train',
                training_recipe_id: privacyType === 'property_inference' ? 'property_inference_shadow_match' : 'classification_default',
                shadow_model_id: privacyType === 'property_inference' ? 'property_mlp' : model.id,
                property_ratio: privacyType === 'property_inference' ? 'high' : undefined,
                property_name: privacyType === 'property_inference' ? propertyName : undefined,
                property_target_ratio: privacyType === 'property_inference' ? effectivePropertyTargetRatio : undefined,
            }
        };

        try {
            const { job_id } = await startPrivacyJob(hostname, port, body);
            setJobId(job_id);
            jobIdRef.current = job_id;
            pollInterval.start();
        } catch (err) {
            setJobState('failed');
            setError(err instanceof Error ? err.message : 'Unable to submit attack');
        }
    };

    return (
        <div className="membership-inference">
            <div className="info-banner">
                <div className='info-header'>
                    <Shield size={25} />
                    {title}
                </div>
                <p className="info-description">{description}</p>
            </div>

            <div className='components-container'>
                <VulnerabilitySelection
                    attacks={attacks}
                    isReady={!!selectedAttack && jobState !== 'running'}
                    selectedAttack={selectedAttack}
                    handlePostRequest={handlePostRequest}
                    handleChange={handleChange}
                    handleSelection={(attackId) => {
                        if (attackId === selectedAttack?.id) return;
                        const attack = attacks[attackId];
                        if (privacyType === 'property_inference') {
                            const propertyNameValue = attack?.parameters?.find((parameter) => parameter.id === 'property_name')?.default;
                            setPropertyNameOverride(typeof propertyNameValue === 'string' ? propertyNameValue : undefined);
                            setSelectedAttack(attack);
                        } else {
                            setSelectedAttack(attack);
                        }
                        setResult(undefined);
                        setError(undefined);
                        setJobState('idle');
                        setJobId(undefined);
                        jobIdRef.current = undefined;
                    }}
                />

                <PrivacyContext
                    attack={selectedAttack}
                    datasets={compatibleDatasets}
                    models={compatibleModels}
                    selectedDatasetId={selectedDatasetId}
                    selectedModelId={selectedModelId}
                    onDatasetChange={(datasetId) => datasetId && setSelectedDatasetId(datasetId)}
                    onModelChange={(modelId) => modelId && setSelectedModelId(modelId)}
                    taskAttrOverride={privacyType === 'property_inference' ? taskAttrFromParams : undefined}
                    showSurrogateChip={privacyType === 'model_inversion'}
                    propertyTargetRatio={privacyType === 'property_inference' ? effectivePropertyTargetRatio : undefined}
                    onPropertyTargetRatioChange={privacyType === 'property_inference' ? setPropertyTargetRatio : undefined}
                    propertyName={privacyType === 'property_inference' ? propertyName : undefined}
                    propertyNameOptions={privacyType === 'property_inference' ? propertyNameOptions : undefined}
                    onPropertyNameChange={privacyType === 'property_inference'
                        ? (value) => {
                            if (!value) return;
                            setPropertyNameOverride(value);
                            setSelectedAttack((previous) => {
                                if (!previous?.parameters) return previous;
                                return {
                                    ...previous,
                                    parameters: previous.parameters.map((parameter) => {
                                        if (parameter.id === 'property_name') {
                                            return { ...parameter, default: value };
                                        }
                                        return parameter;
                                    })
                                };
                            });
                        }
                        : undefined}
                />

                <div className="metrics-display">
                    <h3 className="component-title">Attack Results</h3>
                    <div className="variant-grid" style={{ justifyContent: 'flex-start' }}>
                        <ModalButton
                            Icon={ChartCandlestick}
                            disabled={jobState !== 'completed' || !result}
                            label={jobState === 'completed' ? 'View Results' : jobState === 'failed' ? 'Attack failed' : 'No results yet'}
                            modalTitle={`${selectedAttack?.name ?? 'Privacy Attack'} - Results`}
                            opened={showResults}
                            onModalClose={() => setShowResults(false)}
                        >
                            <PrivacyVisualization
                                metrics={result?.metrics}
                                reconstructions={result?.reconstructions}
                                artifacts={result?.artifacts}
                                jobId={jobId}
                            />
                        </ModalButton>

                        {jobState === 'running' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', alignItems: 'center' }}>
                                <Loader size="sm" color="violet" />
                                <Text size="xs" c="dimmed">Running attack...</Text>
                            </div>
                        )}

                        {error && (
                            <Text size="xs" c="red">{error}</Text>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyAttackPanel;
