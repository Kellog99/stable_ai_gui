
import FileDropZone2 from '@/components/client/FileDropZone2';
import { Database, File } from 'lucide-react';
import React from 'react';
import ZipUploader from "../../components/client/Uploader";
import ModelUploader from '@/components/client/ModelUploader';
import { DatasetRepository } from '@/components/client/DatasetsRepoLoad';
import FileUploadComponent from '@/components/client/UploaderUnified';
import { upload_post } from '@/properties/urls';
import { IconFileText, IconUpload } from '@tabler/icons-react';
import { model_upload } from '@/properties/urlsNNTrust';
import { getModels } from '@/functionalities/NNTrustBackendUtils';
import useStore from '@/store/nnTrustStore';
import useStoreDQ from '@/store/dsStore';
import DatasetsLoader from '@/functionalities/DatasetsLoader';
import { DragDrop } from '@/components/client/UploaderUnifiedDragDrop';



const HomePageDrop: React.FC = ({
}) => {
    const setModels = useStore((state) => state.setModels)
    const setDatasets = useStoreDQ((state) => state.setDatasets)
    
    
    const ZipUploadComponent = () => {
        const zipConfig = {
            fileType: 'zip' as const,
            accept: '.zip',
            title: 'Upload Dataset',
            description: 'Select a .zip file from your computer to upload',
            uploadEndpoint: upload_post,
            formFieldName: 'folder_zip',
            icon: <IconUpload size={30} />,
            showArrowSwitch: true,
            showModeSelect: true,
            showTypeSelect: true,
            showJsonConfig: true,
            refreshFunction: DatasetsLoader,
            setRefreshData: setDatasets
        };

        return <FileUploadComponent config={zipConfig} />;
    };

    const PthUploadComponent = () => {
        const pthConfig = {
            fileType: 'pth' as const,
            accept: '.pth',
            title: 'Upload Model',
            description: 'Select a .pth model file from your computer to upload',
            uploadEndpoint: model_upload,
            formFieldName: 'model_file',
            icon: <IconFileText size={30} />,
            showArrowSwitch: false,
            showModeSelect: false,
            showTypeSelect: false,
            showJsonConfig: false,
            refreshFunction: getModels,
            setRefreshData: setModels
        };

        const handleModelUploadComplete = (success: boolean, data?: any) => {
            if (success) {
                console.log('Model uploaded successfully:', data);
                
            } else {
                console.log('Model upload failed');
                
            }
        };

        return (
            <FileUploadComponent
                config={pthConfig}
                onUploadComplete={handleModelUploadComplete}
            />
        );
    };


    const datasetSections = [
        {
            id: "selection",
            title: "Select Dataset",
            Icon: File,
            child: ZipUploadComponent
        },
        {
            id: "repository",
            title: "Dataset Repository",
            Icon: Database,
            child: DatasetRepository
        }
    ];

    const modelSections = [
        {
            id: "model",
            title: "Upload Model",
            Icon: File,
            child: PthUploadComponent
        }
    ];

    const listOfSections = [datasetSections, modelSections];

    return (

        <div className="file-grid">
            <DragDrop config={ {
                fileType: '.zip',
                accept: ['.zip'],
                description: 'Upload a .zip file'
            } } />
            {listOfSections.map((dropElement, index) => (
                <FileDropZone2
                    key={index}
                    sections={dropElement}
                    defaultActiveSection={dropElement[0].id}
                />
            ))}

        </div>
    )
}

export default HomePageDrop