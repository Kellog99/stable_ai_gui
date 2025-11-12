"use client"

import FileDropZone from '@/components/client/FileDropZone';
import { ModelRepository } from '@/components/client/ModelDisplayer';
import { ModalUploadDataset } from '@/components/client/upload/ModalUploadDataset';
import { ModalUploadModel } from '@/components/client/upload/ModalUploadModel';
import { DragDrop } from '@/components/client/upload/UploaderUnifiedDragDrop';
import DatasetsLoader from '@/functionalities/DatasetsLoader';
import { DatasetRepository } from '@/components/client/DatasetsRepoLoad';
import { getModels } from '@/functionalities/NNTrustBackendUtils';
import styles from '@/styles/HomePage.module.css';
import { Database, Upload } from 'lucide-react';
import { uploadDataset_check, uploaderDataset, uploadModel, uploadModel_check } from "@/properties/urls";
import useStoreDQ from '@/store/dsStore';
import useStore from '@/store/nnTrustStore';


export default function HomePage() {
    const setModels = useStore((state) => state.setModels)
    const setDatasets = useStoreDQ((state) => state.setDatasets)



    const ZipDragDrop = () => {
        return (
            <DragDrop
                config={{
                    name: "dataset",
                    fileType: 'zip',
                    accept: 'application/zip',
                    formFieldName: "folder_zip",
                    description: 'Make sure your zip contains raw data and a json config file.',
                    uploadUrlCheck: uploadDataset_check,
                    uploadUrl: uploaderDataset,
                    refreshFunction: DatasetsLoader,
                    setRefreshData: setDatasets
                }}
                infoModal={<ModalUploadDataset />} />)
    }

    const ZipModelDragDrop = () => {
        return (
            <DragDrop
                config={{
                    name: "model",
                    fileType: 'zip',
                    accept: 'application/zip',
                    formFieldName: "file",
                    description: 'Make sure your zip contains raw data and a json config file.',
                    uploadUrlCheck: uploadModel_check,
                    uploadUrl: uploadModel,
                    refreshFunction: getModels,
                    setRefreshData: setModels

                }}
                infoModal={<ModalUploadModel />} />)
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
            child: ModelRepository
        }
    ];
    const listOfSections = [datasetSections, modelSections];

    return (
        <div className={styles.home_page}>
            <div className={styles.home_container}>
                <div className={styles.home_header}>
                    <h1 className={styles.home_title}>
                        Welcome to Stable-AI
                    </h1>
                    <p className={styles.home_subtitle}>
                        Upload the <b>Dataset</b> and the <b>Model</b> in the space below or upload them from the <b>repository</b> to conduct a quality and vulnerability analysis.
                    </p>
                </div>

                <div className={styles.upload_grid}>
                    {listOfSections.map((dropElement, index) => (
                        <FileDropZone
                            key={index}
                            sections={dropElement}
                            defaultActiveSection={dropElement[0].id}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
