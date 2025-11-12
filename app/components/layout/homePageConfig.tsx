import { Brain, DatabaseIcon } from 'lucide-react';
import { uploadDataset_check, uploaderDataset, uploadModel, uploadModel_check } from "@/properties/urls";
import { FileDropZoneProps } from '@/interfaces/NNInterfaces';

// This contains the information 
export const listOfSections: FileDropZoneProps[] = [
    {
        id: "model_loader",
        title: "Model Selection",
        description: "Drag and drop the your model or choose an existing model.",
        Icon: Brain,
        fileType: "zip",
        accept: 'application/zip',
        formFieldName: "file",
        drop_description: 'Make sure your zip contains raw data and a json config file.',
        uploadUrlCheck: uploadModel_check,
        uploadUrl: uploadModel,
    },
    {
        id: "dataset_loader",
        title: "Dataset Selection",
        description: "Load your dataset or choose an existing dataset.",
        Icon: DatabaseIcon,
        fileType: 'zip',
        accept: 'application/zip',
        formFieldName: "folder_zip",
        drop_description: 'Make sure your zip contains raw data and a json config file.',
        uploadUrlCheck: uploadDataset_check,
        uploadUrl: uploaderDataset,
    }

];