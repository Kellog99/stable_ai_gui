import { LucideIcon } from "lucide-react";
import { ReactEventHandler } from "react";
export interface ModelSpecs {
  name: string;
  task: string;
  numClasses: number;
  pretrained: boolean;
  mode: string;
}

export interface Task {
  Icon: LucideIcon,
  title: string,
  description: string,
  footer: string,
  color: string,
  href: string          // reprenset the page to navigate to
}

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

export interface FileDropZoneProps {
  id: string,
  title: string;
  Icon: LucideIcon;
  acceptedTypes: string[];
  description: string;
  isLoaded?: boolean;
  loadedFileName?: string;
}

export interface ParametersProps {
  name: string
  label: string
  min: number
  max: number
  step: number
  default: number
  description: string
}

export interface RegisterObjectProps {
  id: string,
  name: string,
  description: string
  task?: string
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

