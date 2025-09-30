
import { DatasetRepository } from '@/components/client/DatasetsRepoLoad';
import FileDropZone2 from '@/components/client/FileDropZone2';
import { ModalUploadDataset } from '@/components/client/ModalUploadDataset';
import { ModalUploadModel } from '@/components/client/ModalUploadModel';
import FileUploadComponent from '@/components/client/UploaderUnified';
import { DragDrop } from '@/components/client/UploaderUnifiedDragDrop';
import DatasetsLoader from '@/functionalities/DatasetsLoader';
import { getModels } from '@/functionalities/NNTrustBackendUtils';
import { upload_post } from '@/properties/urls';
import { model_upload } from '@/properties/urlsNNTrust';
import useStoreDQ from '@/store/dsStore';
import useStore from '@/store/nnTrustStore';
import { IconFileText, IconUpload } from '@tabler/icons-react';
import { Database, File } from 'lucide-react';
import React from 'react';



const HomePageDrop: React.FC = ( {
} ) =>
{
    const setModels = useStore( ( state ) => state.setModels )
    const setDatasets = useStoreDQ( ( state ) => state.setDatasets )


    const ZipUploadComponent = () =>
    {
        const zipConfig = {
            fileType: 'zip' as const,
            accept: '.zip',
            title: 'Upload Dataset',
            description: 'Select a .zip file from your computer to upload',
            uploadEndpoint: upload_post,
            formFieldName: 'folder_zip',
            icon: <IconUpload size={ 30 } />,
            showArrowSwitch: true,
            showModeSelect: true,
            showTypeSelect: true,
            showJsonConfig: true,
            refreshFunction: DatasetsLoader,
            setRefreshData: setDatasets
        };

        return <FileUploadComponent config={ zipConfig } />;
    };

    const PthUploadComponent = () =>
    {
        const pthConfig = {
            fileType: 'pth' as const,
            accept: '.pth',
            title: 'Upload Model',
            description: 'Select a .pth model file from your computer to upload',
            uploadEndpoint: model_upload,
            formFieldName: 'model_file',
            icon: <IconFileText size={ 30 } />,
            showArrowSwitch: false,
            showModeSelect: false,
            showTypeSelect: false,
            showJsonConfig: false,
            refreshFunction: getModels,
            setRefreshData: setModels
        };

        const handleModelUploadComplete = ( success: boolean, data?: any ) =>
        {
            if ( success ) {
                console.log( 'Model uploaded successfully:', data );

            } else {
                console.log( 'Model upload failed' );

            }
        };

        return (
            <FileUploadComponent
                config={ pthConfig }
                onUploadComplete={ handleModelUploadComplete }
            />
        );
    };

    const ZipDragDrop = () =>
    {
        return (
            <DragDrop
                config={ {
                    name: "dataset",
                    fileType: 'zip',
                    accept: 'application/zip',
                    description: 'Make sure your zip contains raw data and a json config file.',
                    uploadUrl: "...",
                    refreshFunction: DatasetsLoader,
                    setRefreshData: setDatasets
                } }
                infoModal={ <ModalUploadDataset /> } /> )
    }

    const ZipModelDragDrop = () =>
    {
        return (
            <DragDrop
                config={ {
                    name: "model",
                    fileType: 'zip',
                    accept: 'application/zip',
                    description: 'Make sure your zip contains raw data and a json config file.',
                    uploadUrl: "...",
                    refreshFunction: getModels,
                    setRefreshData: setModels

                } }
                infoModal={ <ModalUploadModel /> } /> )
    }




    const ModelRepo = () =>
    {
        return (
            <div>Model repo :))</div>
        )
    }




    const datasetSections = [
        {
            id: "selection",
            title: "Upload Dataset",
            Icon: File,
            child: ZipDragDrop
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
            child: ZipModelDragDrop
        },
        {
            id: "modrepository",
            title: "Model Repository",
            Icon: Database,
            child: ModelRepo
        }
    ];

    const listOfSections = [ datasetSections, modelSections ];

    return (

        <div className="file-grid">
            { listOfSections.map( ( dropElement, index ) => (
                <FileDropZone2
                    key={ index }
                    sections={ dropElement }
                    defaultActiveSection={ dropElement[ 0 ].id }
                />
            ) ) }

        </div>
    )
}

export default HomePageDrop