"use client"
import React, { useState } from 'react';
import styles from '@/styles/FileDropZone.module.css';
import { ButtonProps, FileDropZoneProps } from '@/interfaces/NNInterfaces';
import { uploadDataset_check, uploaderDataset, uploadModel, uploadModel_check } from "@/properties/urls";
import { getModels } from '@/functionalities/NNTrustBackendUtils';
import { ModalUploadModel } from './upload/ModalUploadModel';
import { DragDrop } from './upload/UploaderUnifiedDragDrop';
import useStore from '@/store/nnTrustStore';
import { HardDrive, Upload } from 'lucide-react';

const SelectionButton: React.FC<ButtonProps> = ({
    id,
    name,
    Icon,
    currentPage,
    onClickHandle
}) => {
    // This component allows to construct all the same buttons with the same actions.
    const getStyle = () => {
        if (currentPage === id) {
            return `button active`;
        } else {
            return `button inactive`;
        }
    }
    return (
        <button
            onClick={onClickHandle}
            className={getStyle()}
        >
            <Icon />
            <p>{name.charAt(0).toUpperCase() + name.slice(1)}</p>
        </button >
    )
}

const FileDropZone: React.FC<FileDropZoneProps> = ({
    id,
    title,
    description,
    Icon
}) => {
    const setModels = useStore((state) => state.setModels)

    // const [activeSection, setActiveSection] = useState<string>(
    //     defaultActiveSection || sections[0]?.id || "selection"
    // );

    // const sectionsWithHandlers = sections.map(section => ({
    //     ...section,
    //     currentPage: activeSection,
    //     onClickHandle: () => setActiveSection(section.id)
    // }));

    // const currentSection = sectionsWithHandlers.find(s => s.id === activeSection);
    const [isDragDrop, setIsDragDrop] = useState<boolean>(true)

    return (
        <div
            key={id}
            className={styles.containerDropzone}>
            <p className={styles.dropTitle}>
               <Icon size={35}/> {title}
            </p>
             <p className={styles.dropDescription}>
                {description}
            </p>


            {/* Selection Button */}
            <div className={styles.containerButtons}>
                <button
                    className={styles.button}
                    onClick={() => setIsDragDrop(true)}
                >
                    <Upload size={25} /> Load
                </button>
                <button
                    className={styles.button}
                    onClick={() => setIsDragDrop(false)}>
                    <HardDrive size={25} /> Repository
                </button>
            </div>

            {isDragDrop ?
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
                    infoModal={<ModalUploadModel />} />
                : null}
        </div>
    );
}

export default FileDropZone;