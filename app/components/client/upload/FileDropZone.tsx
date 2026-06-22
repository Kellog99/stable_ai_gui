"use client"
import React, { useState } from 'react';
import './FileDropZone.css';
import { DatasetInfo, InfoUploader, ModelInfo } from '@/interfaces/homePageInterface';
import { InfoLoader } from './InfoLoader';
import { Database, LucideIcon } from 'lucide-react';
import { DragDrop } from './DragDrop';
import FileRepository from '../repository/FileRepository';
import useBackendVariablesStore from '@/store/globalStore';

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

type ActiveView = 'load' | 'repo' | null;

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
    const [activeView, setActiveView] = useState<ActiveView>('repo');

    const renderActiveChild = () => {
        if (activeView === 'load') {
            return (
                <DragDrop
                    name={"Load your Dataset"}
                    Icon={Database}
                    acceptedType={"zip"}
                    description={'Make sure your zip contains raw data and a json config file.'}
                    handleFileUpload={handleFileUpload}
                />
            );
        }
        if (activeView === 'repo') {
            return (
                <FileRepository
                    elements={elements}
                    activeId={id ?? ""}
                    handleSelection={handleSelection}
                    handleDelete={handleDeletion}
                />
            );
        }
        return null;
    };

    return (
        <div className="containerDropzone">
            <h1 className="container_header">
                <Icon size={"var(--icon-size)"} /> {title} Selection <InfoLoader config={fileDropInformation} />
            </h1>
            <p className="container_description">
                {description}
            </p>

            <div className="selection_buttons">
                <button
                    onClick={() => setActiveView('load')}
                    // Active class now correctly reflects which button is selected
                    className={`selection-button ${activeView === 'load' ? "active" : ""}`}>
                    <Icon size={"var(--icon-size)"} />
                    <span>{"Load"}</span>
                </button>

                <button
                    onClick={() => setActiveView('repo')}
                    className={`selection-button ${activeView === 'repo' ? "active" : ""}`}>
                    <Icon size={"var(--icon-size)"} />
                    <span>{title}</span>
                </button>
            </div>
            <div className='child_container'>
                {renderActiveChild()}
            </div>
        </div>
    );
}

export default FileDropZone;