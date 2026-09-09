"use client"
import React from 'react';
import './FileSelectionPanel.css';
import {DatasetInfo, InfoUploader, ModelInfo} from '@/interfaces/homePageInterface';
import {InfoLoader} from './InfoLoader';
import {LucideIcon} from 'lucide-react';
import FileRepository from "@/components/client/repository/FileRepository";

export interface FileDropZoneProps<T extends ModelInfo | DatasetInfo = ModelInfo | DatasetInfo> {
    title: string,
    description: string,
    elements: T[];
    Icon: LucideIcon,
    fileDropInformation: InfoUploader,
    handleSelection: (element: T | null) => void,
    handleRefresh?: () => void;
    repositoryType: "model" | "dataset";
}


const FileSelectionPanel = <T extends ModelInfo | DatasetInfo>(
    {
        title,
        description,
        elements,
        Icon,
        fileDropInformation,
        handleSelection,
        handleRefresh,
        repositoryType,
    }: FileDropZoneProps<T>
) => {
    return (
        <div className="containerDropzone">
            <div>
                <h1 className="container_header">
                    <Icon size={30}/> {title} Selection <InfoLoader config={fileDropInformation}/>
                </h1>
                <p className="container_description">
                    {description}
                </p>
            </div>
            <div className="child_container">
                {repositoryType === "model" ? (
                    <FileRepository
                        elements={elements as ModelInfo[]}
                        handleSelection={handleSelection as (element: ModelInfo | null) => void}
                        handleRefresh={handleRefresh}
                        repositoryType="model"
                    />
                ) : (
                    <FileRepository
                        elements={elements as DatasetInfo[]}
                        handleSelection={handleSelection as (element: DatasetInfo | null) => void}
                        handleRefresh={handleRefresh}
                        repositoryType="dataset"

                    />
                )}
            </div>
        </div>
    );
};

export default FileSelectionPanel;
