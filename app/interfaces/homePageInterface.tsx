import { LucideIcon } from "lucide-react";
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
    fileType: string;                         // Type of the true data, i.e. pth or zip
    buttons: ButtonProps[],
    storeSetter: (...args: any[]) => void;    //This is the store function for allocating the file into the correct space.
}