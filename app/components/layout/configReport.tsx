import { File, HardDrive, Upload } from 'lucide-react';
import { FileDropZoneProps } from '@/interfaces/homePageInterface';
import { infoModel } from '../client/upload/config';

// Repository
import { DatasetRepository } from '@/components/client/DatasetsRepoLoad';
import { DragDrop } from '@/components/client/upload/DragDrop';
import { JsonRepository } from '@/components/client/repository/jsonRepository';


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