"use client"
import './FileDropZone.css';
import { Group, HoverCard, Loader, Text } from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import { IconTrash, IconX } from '@tabler/icons-react';
import { CheckCircleIcon, HardDriveUpload, LucideIcon, Upload } from 'lucide-react';
import { useState } from 'react';

export interface DragDropProps {
    name: string;
    Icon: LucideIcon;
    acceptedType: string;
    description?: string;
    onFileSelect: (file: File | null) => void;
    disabled?: boolean;
}

export const DragDrop: React.FC<DragDropProps> = ({
    name,
    Icon,
    acceptedType,
    description,
    onFileSelect,
    disabled = false
}) => {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const handleFileSelection = async (selectedFile: File | null) => {
        setLoading(true);
        try {
            setFile(selectedFile);
            onFileSelect(selectedFile);
        } catch (error) {
            console.error('Error handling file:', error);
        } finally {
            setLoading(false);
        }
    };

    return (

        file ? (
            <div className="dropzone loaded">
                <div className="file-info">
                    <CheckCircleIcon
                        size={"calc(var(--icon-size) * 2)"}
                        color="var(--affermative)" />
                    <span >{file?.name}</span>
                </div>
                <div className='btns-container'>
                    {/* Delete Button */}
                    <HoverCard width={180} shadow="md" >
                        <HoverCard.Target>
                            <button
                                className="dragdrop-btn delete"
                                onClick={() => { handleFileSelection(null) }}
                            >
                                <IconTrash size={"calc(var(--icon-size))"} />
                            </button>
                        </HoverCard.Target>
                        <HoverCard.Dropdown>
                            <p style={{ fontSize: "0.7rem" }}>
                                Remove the uploaded File
                            </p>
                        </HoverCard.Dropdown>
                    </HoverCard>
                    
                    {/* Upload Button */}
                    <HoverCard width={180} shadow="md">
                        <HoverCard.Target>
                            <button
                                onClick={() => { "handleRepositoryUpload" }}
                                className='dragdrop-btn load'
                                disabled={false}
                            //zipFile ? true : false
                            >
                                <HardDriveUpload size={"calc(var(--icon-size))"} />
                            </button>
                        </HoverCard.Target>
                        <HoverCard.Dropdown>
                            <p style={{ fontSize: "0.7rem" }}>
                                Upload the File into the repository.
                            </p>
                        </HoverCard.Dropdown>
                    </HoverCard>
                </div>
            </div>

        ) : (
            <Dropzone
                onDrop={(files) => {
                    const newFile = files[0];
                    if (newFile) {
                        handleFileSelection(newFile);
                    }
                }}
                onReject={() => { console.error('Invalid file type or size') }}
                maxSize={1000 * 1024 ** 2}
                accept={[acceptedType]}
                multiple={false}
                disabled={disabled || loading}
            >
                <Group className="dropzone">
                    <Dropzone.Accept>
                        <div className='container-idle'>
                            <Upload size={"calc(2 * var(--icon-size))"} color='green' />
                            <div style={{ alignItems: "left", width: "50%", fontSize: "0.7rem" }}>
                                Release to load
                            </div>
                        </div>
                    </Dropzone.Accept>

                    <Dropzone.Reject>
                        <div className='container-idle'>
                            <IconX size={"calc(2 * var(--icon-size))"} color="#FF6961" />
                            <div style={{ alignItems: "left", width: "50%", fontSize: "0.7rem", color: "red" }}>
                                <span>You are trying to upload a file that is not a .{acceptedType} file!</span>
                            </div>
                        </div>

                    </Dropzone.Reject>

                    <Dropzone.Idle>
                        {loading ? (
                            <>
                                <Loader />
                            </>
                        ) : (
                            <div className='container-idle'>
                                <div className='idle-title'>
                                    <Icon size={"calc(2 * var(--icon-size))"} /> <h3> {name}</h3>
                                </div>
                                <div style={{ alignItems: "left", width: "50%", fontSize: "0.7rem" }}>
                                    <span>Drag a .{acceptedType} file here or click to select. </span>
                                    {description}
                                </div>
                            </div>
                        )}
                    </Dropzone.Idle>
                </Group>
            </Dropzone>
        )
    );
}