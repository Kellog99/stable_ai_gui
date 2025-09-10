import { LucideIcon } from "lucide-react";
import { ReactEventHandler } from "react";

export interface Task {
  Icon: LucideIcon,
  title: string,
  description: string,
  footer: string,
  color: string
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

export interface HomePageProps {
  dataset: LoadedFile | null;
  model: LoadedFile | null;
  onFileSelect: (file: File, type: 'dataset' | 'model') => void;
  onTaskSelect: (task: TaskType) => void;
}

export interface ButtonProps {
  id: string,
  name: string
  Icon: LucideIcon;
  currentPage: string;
  onClickHandle: ReactEventHandler
}

export interface FileDropZoneProps {
  onFileSelect: (file: File) => void;
  title: string;
  Icon: LucideIcon;
  acceptedTypes: string[];
  description: string;
  isLoaded?: boolean;
  loadedFileName?: string;
}

interface ParametersProps {
  name: string
  label: string
  min: number
  max: number
  step: number
  default: number
  description: string
}

export interface AttackProps {
  id: string
  name: string
  description: string
  parameters: ParametersProps[]
}
