import { InfoUploader } from "@/components/client/upload/config";
import { LucideIcon } from "lucide-react";
import { ReactEventHandler } from "react";

export interface ModelSpecs {
  name: string;
  task: string;
  file: File;
  numClasses: number;
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
  config: InfoUploader,                     // This is the configuration file for the info
  fileType: string;                         // Type of the true data, i.e. pth or zip
  drop_description?: string;
  formFieldName: string;
  storeSetter: (...args: any[]) => void;    //This is the store function for allocating the file into the correct space.
  Repository: React.FC
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
  status: 'Pending' | 'In Progress' | 'Completed' | 'Closed';
  progress: number
}