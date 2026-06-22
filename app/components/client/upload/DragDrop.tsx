"use client"
import './DragDrop.css';
import { Group, Loader } from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import { IconX } from '@tabler/icons-react';
import { CheckCircleIcon, LucideIcon, Upload } from 'lucide-react';
import { useState } from 'react';

export interface DragDropProps {
    name: string;
    Icon: LucideIcon;
    acceptedType: string;
    description?: string;
    handleFileUpload: (file: File | null) => void;
    disabled?: boolean;
}

export const DragDrop: React.FC<DragDropProps> = ({
    name,
    Icon,
    acceptedType,
    description,
    handleFileUpload,
    disabled = false
}) => {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const onUpload = async (selectedFile: File | null) => {
        setLoading(true);
        try {
            setFile(selectedFile);
            handleFileUpload(selectedFile);
        } catch (error) {
            console.error('Error handling file:', error);
        }
    };

    return (
        file ? (
            loading ? (
                <Loader />
            ) : (
                <div className="dropzone loaded">
                    <CheckCircleIcon
                        size={"calc(var(--icon-size) * 2)"}
                        color="var(--affermative)" />
                    <span>{file?.name}</span>
                </div>
            )
        ) : (
            <Dropzone
                onDrop={(files) => onUpload(files[0] || null)}
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