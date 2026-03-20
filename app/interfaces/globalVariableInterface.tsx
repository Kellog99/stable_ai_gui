import { LucideIcon } from 'lucide-react'

export interface SettingsModalProps {
    isOpen: boolean,
    onClose: () => void,
}

export interface ServerConfig {
    host?: string;
    port?: number;
    seed?: number;
    workers?: number;

    path_ds_repo?: string;
    path_model_repo?: string;
    path_model_report_repo?: string;

    max_model_size_upload?: number;
    max_model_json_size_upload?: number;
    ray_address?: string;
    ray_py_modules?: string;
}


