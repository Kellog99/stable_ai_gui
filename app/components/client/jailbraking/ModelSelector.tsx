"use client";

import React, { useEffect, useState } from 'react';
import { Settings, ChevronDown, ChevronRight, Bot, Scale, ExternalLink } from 'lucide-react';
import { ModelInfo } from '@/interfaces/homePageInterface';
import { getCoreElements } from '@/functionalities/TITANNServices/get_info';
import useBackendVariablesStore from '@/store/globalStore';
import './ModelSelector.css';

interface ModelSelectorProps {
    attackerModel: ModelInfo | null;
    judgeModel: ModelInfo | null;
    onAttackerChange: (model: ModelInfo | null) => void;
    onJudgeChange: (model: ModelInfo | null) => void;
}

/** Construct a pseudo-ModelInfo for an Ollama model entered by the user. */
function makeOllamaModelInfo(modelName: string, baseUrl: string): ModelInfo {
    return {
        id: modelName,
        name: `Ollama: ${modelName}`,
        task: 'language',
        domain: 'text',
        input_dimensionality: [],
        api: baseUrl,
        model_type: 'Ollama',
    } as unknown as ModelInfo;
}

/** Check whether a ModelInfo represents a user-entered Ollama model. */
function isOllamaModel(model: ModelInfo | null): boolean {
    return model !== null && !model.id.includes('/') && !model.id.startsWith('__');
}

interface OllamaInputProps {
    value: ModelInfo | null;
    onChange: (model: ModelInfo | null) => void;
    label: string;
    icon: React.ReactNode;
}

const OllamaInput: React.FC<OllamaInputProps> = ({ value, onChange, label, icon }) => {
    const [modelName, setModelName] = useState(
        isOllamaModel(value) ? value!.id : ''
    );
    const [baseUrl, setBaseUrl] = useState(
        isOllamaModel(value) ? (value as any).api || 'http://localhost:11434' : 'http://localhost:11434'
    );

    const handleApply = () => {
        const trimmed = modelName.trim();
        if (!trimmed) {
            onChange(null);
            return;
        }
        onChange(makeOllamaModelInfo(trimmed, baseUrl.trim() || 'http://localhost:11434'));
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <input
                    type="text"
                    className="model-selector-dropdown"
                    placeholder="e.g. llama3:8b-instruct"
                    value={modelName}
                    onChange={(e) => setModelName(e.target.value)}
                    style={{ flex: 1 }}
                />
                <button
                    onClick={handleApply}
                    style={{
                        background: 'rgb(187, 58, 58)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '6px 12px',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                    }}
                >
                    Apply
                </button>
            </div>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: '#888', minWidth: '60px' }}>Base URL:</span>
                <input
                    type="text"
                    className="model-selector-dropdown"
                    placeholder="http://localhost:11434"
                    value={baseUrl}
                    onChange={(e) => setBaseUrl(e.target.value)}
                    style={{ flex: 1 }}
                />
            </div>
            {isOllamaModel(value) && (
                <span className="model-selector-info" style={{ color: 'rgb(187, 58, 58)' }}>
                    <ExternalLink size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                    Using Ollama: {value.id}
                </span>
            )}
        </div>
    );
};

const ModelSelector: React.FC<ModelSelectorProps> = ({
    attackerModel,
    judgeModel,
    onAttackerChange,
    onJudgeChange,
}) => {
    const { hostname, port } = useBackendVariablesStore();
    const [listModels, setListModels] = useState<ModelInfo[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        getCoreElements(hostname, port, "path_model_repo", "model")
            .then((list) => setListModels(list as ModelInfo[]))
            .catch(err => console.error("Failed to load models:", err));
    }, [hostname, port]);

    const [attackerMode, setAttackerMode] = useState<'repo' | 'ollama'>(
        isOllamaModel(attackerModel) ? 'ollama' : 'repo'
    );
    const [judgeMode, setJudgeMode] = useState<'repo' | 'ollama'>(
        isOllamaModel(judgeModel) ? 'ollama' : 'repo'
    );

    const handleAttackerSelect = (val: string) => {
        if (val === '__target__') {
            onAttackerChange(null);
        } else if (val === '__ollama__') {
            setAttackerMode('ollama');
        } else {
            setAttackerMode('repo');
            const found = listModels.find(m => m.id === val);
            onAttackerChange(found ?? null);
        }
    };
    const handleJudgeSelect = (val: string) => {
        if (val === '__target__') {
            onJudgeChange(null);
        } else if (val === '__ollama__') {
            setJudgeMode('ollama');
        } else {
            setJudgeMode('repo');
            const found = listModels.find(m => m.id === val);
            onJudgeChange(found ?? null);
        }
    };

    return (
        <div>
            <button
                className={`advanced-toggle ${isOpen ? 'active' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <Settings size={16} />
                <span>Advanced Configuration</span>
                {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>

            {isOpen && (
                <div className="advanced-panel" style={{ marginTop: '10px' }}>
                    <p className="advanced-panel-title">
                        Attacker &amp; Judge Models
                    </p>
                    <p className="model-selector-info">
                        Select separate models for the attacker LLM (generates adversarial prompts) 
                        and judge LLM (scores responses). Leave as &quot;Use target model&quot; to reuse the target.
                        For local Ollama models, pick &quot;Custom Ollama model…&quot; and enter the model name.
                    </p>

                    <div className="model-selector-row">
                        {/* ── Attacker ── */}
                        <div className="model-selector-group">
                            <label className="model-selector-label">
                                <Bot size={16} color="rgb(187, 58, 58)" />
                                Attacker Model
                            </label>
                            <select
                                className="model-selector-dropdown"
                                value={attackerMode === 'ollama' ? '__ollama__' : (attackerModel?.id ?? '__target__')}
                                onChange={(e) => handleAttackerSelect(e.target.value)}
                            >
                                <option value="__target__">Use target model</option>
                                <option value="__ollama__">—— Custom Ollama model ——</option>
                                {listModels.length > 0 && <option disabled>── Repository models ──</option>}
                                {listModels.map((m) => (
                                    <option key={m.id} value={m.id}>
                                        {m.name} ({m.task ?? 'N/A'})
                                    </option>
                                ))}
                            </select>
                            {attackerMode === 'ollama' && (
                                <OllamaInput
                                    value={attackerModel}
                                    onChange={onAttackerChange}
                                    label="Attacker"
                                    icon={<Bot size={14} />}
                                />
                            )}
                            {attackerMode === 'repo' && attackerModel && !isOllamaModel(attackerModel) && (
                                <span className="model-selector-info">
                                    {attackerModel.name} &middot; {attackerModel.task}
                                </span>
                            )}
                        </div>

                        {/* ── Judge ── */}
                        <div className="model-selector-group">
                            <label className="model-selector-label">
                                <Scale size={16} color="rgb(187, 58, 58)" />
                                Judge Model
                            </label>
                            <select
                                className="model-selector-dropdown"
                                value={judgeMode === 'ollama' ? '__ollama__' : (judgeModel?.id ?? '__target__')}
                                onChange={(e) => handleJudgeSelect(e.target.value)}
                            >
                                <option value="__target__">Use target model</option>
                                <option value="__ollama__">—— Custom Ollama model ——</option>
                                {listModels.length > 0 && <option disabled>── Repository models ──</option>}
                                {listModels.map((m) => (
                                    <option key={m.id} value={m.id}>
                                        {m.name} ({m.task ?? 'N/A'})
                                    </option>
                                ))}
                            </select>
                            {judgeMode === 'ollama' && (
                                <OllamaInput
                                    value={judgeModel}
                                    onChange={onJudgeChange}
                                    label="Judge"
                                    icon={<Scale size={14} />}
                                />
                            )}
                            {judgeMode === 'repo' && judgeModel && !isOllamaModel(judgeModel) && (
                                <span className="model-selector-info">
                                    {judgeModel.name} &middot; {judgeModel.task}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ModelSelector;
