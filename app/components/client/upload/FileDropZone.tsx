"use client"
import React, { useState } from 'react';
import './FileDropZone.css';
import { DatasetInfo, InfoUploader, ModelInfo } from '@/interfaces/homePageInterface';
import { InfoLoader } from './InfoLoader';
import { Database, LucideIcon, Upload } from 'lucide-react';
import { DragDrop } from './DragDrop';
import FileRepository from '../repository/FileRepository';

export interface FileDropZoneProps {
    id: string,
    title: string,
    description: string,
    elements: ModelInfo[] | DatasetInfo[];
    Icon: LucideIcon,
    fileDropInformation: InfoUploader,
    handleSelection: (element: ModelInfo | DatasetInfo) => void,
    handleDeletion: (element: ModelInfo | DatasetInfo) => void;
    handleFileUpload: (file: File | null) => void;
}


const FileDropZone: React.FC<FileDropZoneProps> = ({
    id,
    title,
    description,
    elements,
    Icon,
    fileDropInformation,
    handleSelection,
    handleDeletion,
    handleFileUpload
}) => {
    // Track which button/view is active by name, not a stale node
    const [isRepo, setIsRepo] = useState<boolean>(true);

    const renderActiveChild = () => {
        if (isRepo) {
            return (
                <FileRepository
                    elements={elements}
                    handleSelection={handleSelection}
                    handleDelete={handleDeletion}
                />
            );
        }
        return (
            <DragDrop
                name={"Load your Dataset"}
                Icon={Database}
                acceptedType={"zip"}
                description={'Make sure your zip contains raw data and a json config file.'}
                handleFileUpload={handleFileUpload}
            />
        );

    };

    return (
        <div className="containerDropzone">
            <div>
                <h1 className="container_header">
                    <Icon size={30} /> {title} Selection <InfoLoader config={fileDropInformation} />
                </h1>
                <p className="container_description">
                    {description}
                </p>
            </div>

            <div className="selection_buttons">
                <button
                    onClick={() => setIsRepo(false)}
                    className={`selection-button ${!isRepo ? "active" : ""}`}>
                    <Upload size={18} />
                    Upload
                </button>

                <button
                    onClick={() => setIsRepo(true)}
                    className={`selection-button ${isRepo ? "active" : ""}`}>
                    <Icon size={18} />
                    <span>Repository</span>
                </button>
            </div>
            <div className="child_container">
                {renderActiveChild()}
            </div>
        </div>
    );
}

export default FileDropZone;