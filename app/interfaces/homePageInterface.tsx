import { LucideIcon } from "lucide-react";

export interface Info {
    id: string                        // id for the file identification.
    name: string,                     // File's name, ex. "Resnet50" or "Imagenette".
    image?: string | null,            // an image that represents the file.
    task: string,                     // task associated with, i.e. classification, detection, etc.
    domain: string,                   // Domain of the file, i.e. RGB, ultraviolet, etc.
    classes?: number,                 // number of classes in the output.
    weights?: number,                 // Size of the file.
    description?: string,             // description of the file.
    input_dimensionality: number[]    // dimensionality of each input or domain's dimensionality.
}

interface field {
    field: string,
    type: string,
    description: string,
    properties?: field[]
}


export interface InfoUploader {
    description: string,
    scaffholding: { [key: string]: string[] },
    fields: field[],
    example: { [key: string]: any }
}

export interface ButtonProps {
    id: string,
    name: string,
    child: React.ReactNode,
    Icon: LucideIcon
}

export interface FileDropZoneProps {
    id: string,
    title: string,
    description: string,
    Icon: LucideIcon,
    fileDropInformation: InfoUploader,        // This is the configuration file for the info
    buttons: ButtonProps[],
}