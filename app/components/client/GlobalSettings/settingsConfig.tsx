import { FolderOpen, Router, Computer, LucideIcon } from "lucide-react";
export interface ServerConfigDescritpion {
    label: string,
    description: string,
    Icon: LucideIcon,
    type: string
}
export const pathConfigs: { [key: string]: ServerConfigDescritpion } = {
    "path_model_repo": {
        label: "Model Repository",
        description: "This path correspond to the folder that holds all the Model that have been tested.",
        Icon: FolderOpen,
        type: "path",
    },
    "path_ds_repo": {
        label: "Dataset Repository",
        description: "This path correspond to the folder that holds the Dataset that has been used.",
        Icon: FolderOpen,
        type: "path",
    },
    "path_model_report_repo": {
        label: "Benchmark Folder",
        description: "This path refers to the folder where the files that are produced during benchmarking are stored when it is executed.",
        Icon: FolderOpen,
        type: "path",
    },
    "host": {
        label: "Hostname",
        description: "It represent the hostname where the backend services are running. If it is modified, it is suggested to refresh the application in order to have a new fetching of the resources.",
        Icon: Router,
        type: "string",
    },
    "port": {
        label: "Backend Port",
        description: "This represent the port for the backend services. If it is modified, it is suggested to refresh the application in order to have a new fetching of the resources.",
        Icon: Computer,
        type: "number",
    },
    "seed": {
        label: "Numerical Seed",
        description: "This constant represen the seed for generating random number and, therefore, allowing a better reproducibility.",
        Icon: Computer,
        type: "number",
    }
};