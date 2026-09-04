"use client"
import React, {useState} from 'react';
import './FileDropZone.css';
import {DatasetInfo, InfoUploader, ModelInfo} from '@/interfaces/homePageInterface';
import {InfoLoader} from './InfoLoader';
import {LucideIcon} from 'lucide-react';
import FileRepository from '../repository/FileRepository';

export interface FileDropZoneProps<T extends ModelInfo | DatasetInfo = ModelInfo | DatasetInfo> {
    title: string,
    description: string,
    elements: T[];
    Icon: LucideIcon,
    fileDropInformation: InfoUploader,
    handleSelection: (element: T | null) => void,
    handleDeletion: (element: T) => void;
    handleRefresh?: () => void;
}


const FileDropZone = <T extends ModelInfo | DatasetInfo>(
    {
        title,
        description,
        elements,
        Icon,
        fileDropInformation,
        handleSelection,
        handleDeletion,
        handleRefresh,
    }: FileDropZoneProps<T>
) => {
    // Track which button/view is active by name, not a stale node
    const [isRepo, setIsRepo] = useState<boolean>(true);

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
                <FileRepository<T>
                    elements={elements}
                    handleSelection={handleSelection}
                    handleDelete={handleDeletion}
                    handleRefresh={handleRefresh}
                />
            </div>
        </div>
    );
};

export default FileDropZone;
