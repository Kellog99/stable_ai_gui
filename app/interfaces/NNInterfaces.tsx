import {LucideIcon} from "lucide-react";
import {ReactEventHandler} from "react";

export interface LoadedFile {
    name: string;
    file: File;
    type: 'dataset' | 'model' | 'json';
}

export interface AppState {
    currentPage: 'home' | 'report';
    dataset: LoadedFile | null;
    model: LoadedFile | null;
    reportFiles: LoadedFile[];
}

export type TaskType = 'benchmark' | 'one-image-attack' | 'analysis';

export interface ButtonProps {
    id: string,
    name: string
    Icon: LucideIcon;
    currentPage: string;
    onClickHandle: ReactEventHandler
}

export interface ParametersProps {
    id: string
    name: string
    min?: number
    max?: number
    step?: number
    default: number | string | boolean
    description: string
    kind?: 'number' | 'enum' | 'boolean'
    options?: string[]
}

export interface RegisterObjectProps {
    id: string,
    name: string,
    description: string
    task?: string
    objective?: string
    type?: string
    nature?: string
    category?: string
    attack_type?: string
    privacy_type?: string
    knowledge?: string
    parameters?: ParametersProps[]
}

// Settings Modal Component
export interface ParametersWindowProps {
    isOpen: boolean,
    onClose: () => void,
    parameters: ParametersProps[],
    handleParametersSaving: (id: string, parameters: ParametersProps[]) => void;
}

export const ATTACK_STATUSES = ['pending', 'in progress', 'finished', 'error'] as const;

export type AttackStatus = typeof ATTACK_STATUSES[number];

export interface ParameterLogProps {
    id: string;
    name?: string | null;
    value: unknown;
    description?: string | null;
}

export interface JobResult {
    id: string;
    parameters?: ParameterLogProps[] | null;
    result?: Record<string, unknown> | null;
    total?: number | null;
    progress?: number | null;
    status: AttackStatus;
    error?: string | null;
}

export interface ModelSpecs {
    name: string;
    task?: string;
    num_classes?: number;
    pretrained?: boolean;
    type?: string;
}
