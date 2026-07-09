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
            await handleFileUpload(selectedFile);
        } catch (error) {
            console.error('Error handling file:', error);
        } finally {
            setLoading(false);
        }
    };

    const iconSize = 30;
    if (file) {
        if (loading) return <Loader />
        return (
            <div className="dropzone loaded">
                <CheckCircleIcon
                    size={"calc(var(--icon-size) * 2)"}
                    color="var(--affermative)" />
                <span>{file?.name}</span>
            </div>
        );
    }
    return (
        <Dropzone
            className="dropzone"
            onDrop={(files) => onUpload(files[0] || null)}
            onReject={() => { console.error('Invalid file type or size') }}
            maxSize={1000 * 1024 ** 2}
            accept={[acceptedType]}
            multiple={false}
            disabled={disabled || loading}
        >
            <Dropzone.Accept>
                <div className='container-idle'>
                    <Upload
                        size={iconSize}
                        color='green'
                    />
                    Release to load
                </div>
            </Dropzone.Accept>

            <Dropzone.Reject>
                <div className='container-idle'>
                    <IconX
                        size={iconSize}
                        color="#FF6961"
                    />
                    You are trying to upload a file that is not a .{acceptedType} file!
                </div>

            </Dropzone.Reject>

            <Dropzone.Idle>
                <div className='container-idle'>
                    <div className='idle-title'>
                        <Upload size={iconSize} />  {name}
                    </div>
                    Drag a .{acceptedType} file here or click to select.
                    {description}

                </div>
            </Dropzone.Idle>
        </Dropzone>

    );
}