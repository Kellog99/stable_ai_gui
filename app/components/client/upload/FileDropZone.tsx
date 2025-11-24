"use client"
import React, { useEffect, useState } from 'react';
import './FileDropZone.css';
import { FileDropZoneProps } from '@/interfaces/homePageInterface';
import { InfoLoader } from './InfoLoader';

interface ParsedZipContent {
    dataFile: File | null;
    jsonFile: File | null;
    jsonContent: any;
}

const FileDropZone: React.FC<FileDropZoneProps> = ({
    id,
    title,
    description,
    Icon,
    fileDropInformation,
    buttons
}) => {

    const [buttonId, setButtonId] = useState<string>("")
    const [activeChild, setActiveChild] = useState<React.ReactNode | null>(null)
    useEffect(() => {
        if (buttons.length > 0) {
            setButtonId(buttons[1].id)
            setActiveChild(buttons[1].child)
        }
    }, [buttons])



    return (
        <div
            key={id}
            className="containerDropzone">
            <p className="dropTitle">
                <Icon size={"var(--icon-size)"} /> {title} Selection <InfoLoader config={fileDropInformation} />
            </p>
            <p className="dropDescription">
                {description}
            </p>


            <div className="selection-buttons">
                {buttons.map((infoButton, index) => {
                    return (
                        <button
                            key={infoButton.id || index}
                            onClick={() => {
                                setButtonId(infoButton.id);
                                setActiveChild(infoButton.child);
                            }}
                            className={`selection-button ${infoButton.id === buttonId ? "active" : ""}`}>
                            <infoButton.Icon size={"var(--icon-size)"} />
                            <span>{infoButton.name}</span>
                        </button>)
                })}
            </div>

            {activeChild}
        </div >
    );
}

export default FileDropZone;