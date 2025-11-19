import { Brain, Database, DatabaseIcon, File, HardDrive, Upload } from 'lucide-react';
import { FileDropZoneProps } from '@/interfaces/homePageInterface';
import { infoDataset, infoModel } from '../client/upload/config';
import useNNTrustStore from '@/store/nnTrustStore';

// Repository
import { DatasetRepository } from '@/components/client/DatasetsRepoLoad';
import { ModelRepository } from '@/components/client/ModelDisplayer';
import { DragDrop } from '../client/upload/DragDrop';
import { JsonRepository } from '../client/repository/jsonRepository';


// Helper to safely access Zustand without subscribing at module scope
const getStore = () => useNNTrustStore.getState();
// This contains the information 
export const listOfSections: FileDropZoneProps[] = [
    {
        id: "model_loader",
        title: "Model",
        description: "Drag and drop your model or choose an existing model.",
        Icon: Brain,
        fileDropInformation: infoModel,
        fileType: "pth",
        buttons: [
            {
                id: "model",
                name: "Upload model",
                Icon: Upload,
                child: <DragDrop
                    name={"title"}
                    Icon={Brain}
                    acceptedType={"zip"}
                    description={'Make sure your zip contains raw data and a json config file.'}
                    onFileSelect={() => { }}
                />,
            },
            {
                id: "repository",
                name: "Model Repository",
                Icon: HardDrive,
                child: <ModelRepository />,
            }
        ],
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
        },
        Repository: DatasetRepository
    },

    {
        id: "dataset_loader",
        title: "Dataset",
        description: "Load your dataset or choose an existing dataset.",
        Icon: DatabaseIcon,
        fileDropInformation: infoDataset,
        fileType: 'zip',
        buttons: [
            {
                id: "dataset",
                name: "Upload dataset",
                Icon: Upload,
                child: <DragDrop
                    name={"title"}
                    Icon={Database}
                    acceptedType={"zip"}
                    description={'Make sure your zip contains raw data and a json config file.'}
                    onFileSelect={() => { }}
                />,
            },
            {
                id: "repository",
                Icon: HardDrive,
                name: "Model Repository",
                child: <DatasetRepository />,
            }
        ],
        storeSetter: (file: File) => {
            // To implement:
            // const { setDataset } = getStore();
            // setDataset(file);
        },
        Repository: ModelRepository
    }
];



// Configuration file of the Report's drag and drop component
export const reportSection: FileDropZoneProps =
{
    id: "report_loader",
    title: "Report",
    description: "Drag and drop the JSON of the report.",
    Icon: File,
    fileDropInformation: infoModel,
    fileType: ".json",
    buttons: [
        {
            id: "report",
            name: "Upload report",
            Icon: Upload,
            child: <DragDrop
                name={"File"}
                Icon={File}
                acceptedType={"json"}
                description={'Upload the JSON file related to the report.'}
                onFileSelect={() => { }}
            />,
        },
        {
            id: "repo-model-report",
            name: "Repository Model",
            Icon: HardDrive,
            child: <JsonRepository tool='nntrust' />,
        },
        {
            id: "repo-dataset-report",
            name: "Repository Dataset",
            Icon: HardDrive,
            child: <JsonRepository tool='dq' />,
        }
    ],
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
    },
    Repository: DatasetRepository
}