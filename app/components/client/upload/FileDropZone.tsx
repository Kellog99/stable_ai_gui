"use client"
import React, { useState } from 'react';
import './FileDropZone.css';
import { FileDropZoneProps } from '@/interfaces/NNInterfaces';
import { uploadModel, uploadModel_check } from "@/properties/urls";
import { getModels } from '@/functionalities/NNTrustBackendUtils';
import { DragDrop, DragDropProps } from './DragDrop';
import useStore from '@/store/nnTrustStore';
import { HardDrive, Upload } from 'lucide-react';
import ZipUploadComponent from './Uploader';
import { InfoLoader } from './InfoLoader';

const FileDropZone: React.FC<FileDropZoneProps> = ({
    id,
    title,
    description,
    Icon,
    config
}) => {
    const setModels = useStore((state) => state.setModels)
    const [upload, setUpload] = useState<boolean>(true);

    // const [activeSection, setActiveSection] = useState<string>(
    //     defaultActiveSection || sections[0]?.id || "selection"
    // );

    // const sectionsWithHandlers = sections.map(section => ({
    //     ...section,
    //     currentPage: activeSection,
    //     onClickHandle: () => setActiveSection(section.id)
    // }));

    // const currentSection = sectionsWithHandlers.find(s => s.id === activeSection);
    const dragdropinput: DragDropProps = {
        name: title,
        Icon: Icon,
        fileType: 'zip',
        accept: 'application/zip',
        formFieldName: "file",
        description: 'Make sure your zip contains raw data and a json config file.',
        uploadUrlCheck: uploadModel_check,
        uploadUrl: uploadModel,
        refreshFunction: getModels,
        setRefreshData: setModels,
    }
    return (
        <div
            key={id}
            className="containerDropzone">
            <p className="dropTitle">
                <Icon size={35} /> {title} Selection <InfoLoader config={config} />
            </p>
            <p className="dropDescription">
                {description}
            </p>


            <div className="selection-buttons">
                <button
                    onClick={() => setUpload(true)}
                    className={`selection-button ${upload ? "active" : ""}`}>

                    <Upload size={"var(--icon-size)"} />
                    <span>Upload</span>
                </button>

                <button
                    onClick={() => setUpload(false)}
                    className={`selection-button ${!upload ? "active" : ""}`}>

                    <HardDrive size={"var(--icon-size)"} />
                    <span>Repository</span>
                </button>
            </div>


            {
                upload ?
                    <div className='container-upload'>
                        {/* Load Zone*/}
                        <DragDrop {...dragdropinput} />
                        {/* Load button */}
                        <button
                            onClick={() => { }}
                            className='load-button'
                        >
                            <Upload /> Upload into the Repository.
                        </button>
                    </div>
                    : <ZipUploadComponent />
            }
        </div >
    );
}

export default FileDropZone;