"use client"
import './FileDropZone.css';
import { ActionIcon, Box, Button, Code, Collapse, Divider, Flex, Group, List, Loader, Text, ThemeIcon } from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import { useDisclosure } from '@mantine/hooks';
import { IconChevronDown, IconDatabase, IconTrash, IconX } from '@tabler/icons-react';
import { CheckCircleIcon, CheckIcon, FolderIcon, LucideIcon, Upload } from 'lucide-react';
import { useState } from 'react';
import { AlertCust } from '../AlertCustom';

export interface DragDropProps {
    name: string;
    Icon: LucideIcon
    fileType: string;
    accept: string; // for a zip file in Linux the MIME type is "application/zip" while for Windows it's "application/x-zip-compressed"
    description?: string;
    uploadUrlCheck: string;
    uploadUrl: string;
    formFieldName: string;
    refreshFunction: () => Promise<any>; // e.g., "DatasetsLoader" reloads the data with the new upload
    setRefreshData: (data: any) => void;
};

export const DragDrop: React.FC<DragDropProps> = ({
    name,
    Icon,
    fileType,
    accept, // for a zip file in Linux the MIME type is "application/zip" while for Windows it's "application/x-zip-compressed"
    description,
    uploadUrlCheck,
    uploadUrl,
    formFieldName,
    refreshFunction, // e.g., "DatasetsLoader" reloads the data with the new upload
    setRefreshData,
}) => {

    const [file, setFile] = useState<File | null>(null);
    const [message, setMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [uploadStatus, setUploadStatus] = useState<string | null>(null);
    const [jsonUploaded, setJsonUploaded] = useState<Object>({})
    const [loadingHC, setLoadingHC] = useState<boolean>(false)

    const [openedJs, { toggle: toggleJs }] = useDisclosure(false);

    const handleFileChange = async (selectedFile: File) => {
        if (!selectedFile) {
            setMessage('No file selected.');
            setUploadStatus(null);
            return;
        }

        const formData = new FormData();
        formData.append(formFieldName, selectedFile);
        setLoadingHC(true)
        try {
            const response = await fetch(uploadUrlCheck, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                setJsonUploaded(data)
            } else {

                const data = await response.json();
                setMessage(data.detail || "An error occurred during load check");
                setUploadStatus('error');

            }

        } catch (error) {

            console.error('Error uploading:', error);
            setMessage(`An error occurred: ${error}`);
            setUploadStatus('error');

        } finally {
            if (refreshFunction && setRefreshData) {
                refreshFunction().then(fetchedData => {
                    if (fileType === 'pth') {
                        setRefreshData?.(fetchedData.names);
                    } else {
                        console.log("FETCHED DATA", fetchedData);
                        setRefreshData?.(fetchedData);
                    }
                });
            }

            setLoadingHC(false);
            setFile(selectedFile);
        }

    };

    const handleUpload = async () => {
        if (!file) {
            setMessage(`Please select a ${fileType} file first.`);
            setUploadStatus('error');
            return;
        }

        setMessage(`Uploading ${file.name}...`);
        setLoading(true);
        setUploadStatus(null);
        const fileName = file.name.split('.').slice(0, -1).join('.')

        const url = new URL(uploadUrl);
        if (name == "dataset") {
            url.searchParams.append("dataset_name", fileName);
        } else if (name == "model") {
            url.searchParams.append("model_name", fileName);
        }

        try {
            const response = await fetch(url);
            console.log("RESPONSE", response)

            if (response.ok) {
                setMessage(`Upload successful! Check the Dataset Repository.`);
                setUploadStatus('success');
            } else {
                const data = await response.json();
                setMessage(data.message || "An error occurred");
                setUploadStatus('error');
            }

        } catch (error) {
            console.error('Error uploading:', error);
            setMessage(`An error occurred: ${error}`);
            setUploadStatus('error');

        } finally {
            if (refreshFunction && setRefreshData) {
                refreshFunction().then(fetchedData => {
                    if (fileType === 'pth') {
                        setRefreshData?.(fetchedData.names);
                    } else {
                        setRefreshData?.(fetchedData);
                    }
                });
            }
            setLoading(false);
        }
    };

    return (

        file ? (
            <>
                <div className="dropzone loaded">
                    <div className="file-info">
                        <CheckCircleIcon
                            size={"calc(var(--icon-size) * 2)"}
                            color="var(--affermative)" />
                        <span >{file?.name}</span>
                    </div>

                    <button
                        className="delete-btn"
                        onClick={() => {
                            setFile(null);
                            setMessage("");
                            setUploadStatus(null);
                        }}
                    >
                        <IconTrash size={"calc(var(--icon-size))"} />
                    </button>
                </div>

            </>
        ) : (
            <Dropzone
                onDrop={(files) => {
                    const newFile = files[0];
                    if (newFile) {
                        handleFileChange(newFile);
                    }
                }}
                onReject={() => { setMessage('Invalid file type or size'); }}
                maxSize={1000 * 1024 ** 2}
                accept={Object.fromEntries(
                    (Array.isArray(accept) ? accept : [accept])
                        .map(type => [type, [fileType]])
                )}
                multiple={false}
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
                                <span>You are trying to upload a file that is not a .{fileType} file!</span>
                            </div>
                        </div>

                    </Dropzone.Reject>

                    <Dropzone.Idle>
                        {loadingHC ? (
                            <>
                                <Loader />
                            </>
                        ) : (
                            <div className='container-idle'>
                                <div className='idle-title'>
                                    <Icon size={"calc(2 * var(--icon-size))"} /> <h3> {name}</h3>
                                </div>
                                <div style={{ alignItems: "left", width: "50%", fontSize: "0.7rem" }}>
                                    <span>Drag a .{fileType} file here or click to select. </span>
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

{/* <Box style={{
                padding: '10px',
                backgroundColor: 'rgba(53, 216, 61, 0.2)',
                borderRadius: '8px',
                width: '100%',

                visibility: file && uploadStatus !== "error" ? "visible" : "hidden"
            }}


            >
                <Group justify='space-between' onClick={toggleJs} style={{ cursor: 'pointer' }}  >
                    <Group justify='flex-start'>
                        <CheckIcon size={12} />
                        <Text size="sm" c="var(--mantine-color-gray-7)">Data you loaded:</Text>
                    </Group>
                    <IconChevronDown size={16} style={{ color: "var(--mantine-color-gray-7)", marginLeft: 10, transform: openedJs ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                </Group>

                <Collapse in={openedJs}>
                    <Divider my="xs" color="rgba(30, 120, 40, 0.9)" />

                    <Box
                        p="md"
                        style={{
                            backgroundColor: 'rgba(30, 120, 40, 0.05)',
                            borderRadius: '8px',
                            border: '1px solid rgba(30, 120, 40, 0.2)'
                        }}
                    >
                        <List
                            spacing="sm"
                            size="sm"
                            icon={
                                <ThemeIcon
                                    color="rgba(30, 120, 40, 0.9)"
                                    size={8}
                                    radius="xl"
                                />
                            }
                        >
                            <List.Item>
                                <Group gap="xs">
                                    <FolderIcon size={16} style={{ color: 'rgba(30, 120, 40, 0.9)' }} />
                                    <Text c="var(--mantine-color-gray-7)" size="sm" fw={600}>Data Folder Name:</Text>
                                    <Text c="var(--mantine-color-gray-7)" size="sm" style={{ fontFamily: 'monospace' }}>{file?.name?.split('.').slice(0, -1).join('.')}</Text>
                                </Group>
                            </List.Item>

                            <List.Item>
                                <Group gap="xs">
                                    <FolderIcon size={16} style={{ color: 'rgba(30, 120, 40, 0.9)' }} />
                                    <Text c="var(--mantine-color-gray-7)" size="sm" fw={600}>JSON Content:</Text>
                                </Group>
                            </List.Item>
                        </List>
                        <div
                            style={{
                                width: '24vw',
                                height: '200px',
                                overflow: 'auto',
                            }}
                        >
                            <Box ml="xl" mt="sm">

                                <Code
                                    block
                                    style={{
                                        fontSize: '0.75rem',
                                        backgroundColor: 'rgba(30, 120, 40, 0.3)',

                                    }}
                                >
                                    {JSON.stringify(jsonUploaded, null, 2)}
                                </Code>

                            </Box>
                        </div>
                    </Box>
                </Collapse>
            </Box > */}
