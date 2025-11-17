import { Brain, DatabaseIcon } from 'lucide-react';
import { FileDropZoneProps } from '@/interfaces/NNInterfaces';
import { infoDataset, infoModel } from '../client/upload/config';
import useNNTrustStore from '@/store/nnTrustStore';

// Helper to safely access Zustand without subscribing at module scope
const getStore = () => useNNTrustStore.getState();


// This contains the information 
export const listOfSections: FileDropZoneProps[] = [
    {
        id: "model_loader",
        title: "Model",
        description: "Drag and drop your model or choose an existing model.",
        Icon: Brain,
        config: infoModel,
        fileType: "pth",
        formFieldName: "file",

        drop_description: 'Make sure your zip contains raw data and a json config file.',
        storeSetter: (
            file: File,             // Actual model (.pth)
            name: string,           // Extracted model name
            numClasses: number      // Extracted class count
        ) => {
            const { setModel, setModelName } = getStore();

            setModel({
                name: name,
                task: "Classification",
                file: file,
                numClasses: numClasses
            });

            setModelName(name);
        }
    },

    {
        id: "dataset_loader",
        title: "Dataset",
        description: "Load your dataset or choose an existing dataset.",
        Icon: DatabaseIcon,
        config: infoDataset,
        fileType: 'zip',
        formFieldName: "folder_zip",

        drop_description: 'Make sure your zip contains raw data and a json config file.',
        storeSetter: (file: File) => {
            // To implement:
            // const { setDataset } = getStore();
            // setDataset(file);
        }
    }
];


// FIXED: removed extra quote
export const pathToRepoistory = "/PATH/TO/THE/REPOSITORY";
