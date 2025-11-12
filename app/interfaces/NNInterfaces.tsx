import { LucideIcon } from "lucide-react";
import { ReactEventHandler } from "react";
export interface ModelSpecs {
  name: string;
  task: string;
  numClasses: number;
  pretrained: boolean;
  mode: string;
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
  title: string,
  description: string,
  Icon: LucideIcon,
  fileType: string;
  accept: string; // for a zip file in Linux the MIME type is "application/zip" while for Windows it's "application/x-zip-compressed"
  drop_description?: string;
  uploadUrlCheck: string;
  uploadUrl: string;
  formFieldName: string;
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

export interface AttackManagementProps {
  id: number;
  name: string;
  status: string;
  progress: number
}