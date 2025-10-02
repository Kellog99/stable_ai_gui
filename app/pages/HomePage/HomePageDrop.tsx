
import { DatasetRepository } from '@/components/client/DatasetsRepoLoad';
import FileDropZone2 from '@/components/client/FileDropZone2';
import { ModalUploadDataset } from '@/components/client/upload/ModalUploadDataset';
import { ModalUploadModel } from '@/components/client/upload/ModalUploadModel';
import { DragDrop } from '@/components/client/upload/UploaderUnifiedDragDrop';
import DatasetsLoader from '@/functionalities/DatasetsLoader';
import { getModels } from '@/functionalities/NNTrustBackendUtils';
import useStoreDQ from '@/store/dsStore';
import useStore from '@/store/nnTrustStore';
import { Database, Upload } from 'lucide-react';
import React from 'react';
import styles from '@/styles/HomePage.module.css';
import ModelDisplayer from '@/components/client/ModelDisplayer';



const HomePageDrop: React.FC = ( {
} ) =>
{
    const setModels = useStore( ( state ) => state.setModels )
    const setDatasets = useStoreDQ( ( state ) => state.setDatasets )

    const ZipDragDrop = () =>
    {
        return (
            <DragDrop
                config={ {
                    name: "dataset",
                    fileType: 'zip',
                    accept: 'application/x-zip-compressed',
                    formFieldName: "folder_zip",
                    description: 'Make sure your zip contains raw data and a json config file.',
                    uploadUrl: "http://localhost:8000/upload_folder/check",
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
                    formFieldName: "file",
                    description: 'Make sure your zip contains raw data and a json config file.',
                    uploadUrl: "http://localhost:8082/upload/check",
                    refreshFunction: getModels,
                    setRefreshData: setModels

                } }
                infoModal={ <ModalUploadModel /> } /> )
    }

    const ModelRepo = () =>
    {
        return (
            <div><ModelDisplayer modelName="resnet50"/></div>
        )
    }




    const datasetSections = [
        {
            id: "selection",
            title: "Upload Dataset",
            Icon: Upload,
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
            Icon: Upload,
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

        <div className={ styles.filegrid }>
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