import { LucideIcon } from "lucide-react";
import { ReactEventHandler } from "react";

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
  default: number | string
  description: string
  kind?: 'number' | 'enum'
  options?: string[]
}

export interface RegisterObjectProps {
  id: string,
  name: string,
  description: string
  task?: string
  objective?: string
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

export interface AttackManagementProps {
  id: number;
  name: string;
  status: 'pending' | 'in_progress' | 'completed' | 'closed';
  progress: number
}

export interface ModelSpecs {
  name: string;
  task?: string;
  num_classes?: number;
  pretrained?: boolean;
  type?: string;
}