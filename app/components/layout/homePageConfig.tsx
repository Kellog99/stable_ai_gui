import { Brain, DatabaseIcon } from 'lucide-react';
import { uploadDataset_check, uploaderDataset, uploadModel, uploadModel_check } from "@/properties/urls";
import { FileDropZoneProps } from '@/interfaces/NNInterfaces';
import { infoDataset, infoModel } from '../client/upload/config';

// This contains the information 
export const listOfSections: FileDropZoneProps[] = [
    {
        id: "model_loader",
        title: "Model",
        description: "Drag and drop the your model or choose an existing model.",
        Icon: Brain,
        config: infoModel,
        fileType: "zip",
        accept: 'application/zip',
        formFieldName: "file",
        drop_description: 'Make sure your zip contains raw data and a json config file.',
        uploadUrlCheck: uploadModel_check,
        uploadUrl: uploadModel,
    },
    {
        id: "dataset_loader",
        title: "Dataset",
        description: "Load your dataset or choose an existing dataset.",
        Icon: DatabaseIcon,
        config: infoDataset,
        fileType: 'zip',
        accept: 'application/zip',
        formFieldName: "folder_zip",
        drop_description: 'Make sure your zip contains raw data and a json config file.',
        uploadUrlCheck: uploadDataset_check,
        uploadUrl: uploaderDataset,
    }

];