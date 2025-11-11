import classes from '@/styles/FileDropZone.module.css';
import { ActionIcon, Box, Button, Code, Collapse, Divider, Flex, Group, List, Loader, Stack, Text, ThemeIcon } from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import { useDisclosure } from '@mantine/hooks';
import { IconChevronDown, IconCloudUpload, IconDatabase, IconTrash, IconUpload, IconX } from '@tabler/icons-react';
import { Brain, CheckIcon, Database, FileText, FolderIcon } from 'lucide-react';
import { useState } from 'react';
import { AlertCust } from '../AlertCustom';
import { fetchExternalImage } from 'next/dist/server/image-optimizer';
import { json } from 'stream/consumers';
import { uploadJsonReport_DQ } from '@/properties/urls';
import { uploadJsonReport_NN } from '@/properties/urlsNNTrust';

type Props = {
    config: {
        name: string;
        fileType: string;
        accept: string; // for a zip file in Linux the MIME type is "application/zip" while for Windows it's "application/x-zip-compressed"
        description?: string;
        uploadUrlCheck: string;
        uploadUrl: string;
        formFieldName: string;
        refreshFunction?: () => Promise<any>; // e.g., "DatasetsLoader" reloads the data with the new upload
        setRefreshData?: (data: any) => void;
    };
    infoModal: React.ReactNode;
};

type UploadedJson = {
  tool: string; // mandatory field
  [key: string]: any; // any other optional fields
};

export const DragDrop: React.FC<Props> = ({ config, infoModal }) => {

    const [file, setFile] = useState<File | null>(null);
    const [message, setMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [uploadStatus, setUploadStatus] = useState<string | null>(null);
    const [jsonUploaded, setJsonUploaded] = useState<UploadedJson>({tool: ''});
    const [loadingHC, setLoadingHC] = useState<boolean>(false)

    const [openedJs, { toggle: toggleJs }] = useDisclosure(false);

    const handleFileChange = async (selectedFile: File) => {
        if (!selectedFile) {
            setMessage('No file selected.');
            setUploadStatus(null);
            return;
        }

        console.log("Selected file:", selectedFile);

        let body: BodyInit;
        let headers: HeadersInit = {};

        if (config.name !== "report") {

            try {

                const formData = new FormData();
                formData.append(config.formFieldName, selectedFile);
                body = formData;
                setLoadingHC(true);

                const response = await fetch(config.uploadUrlCheck, {
                    method: 'POST',
                    headers,
                    body,
                });

                const data = await response.json();
                console.log("DATA", data);

                if (response.ok) {
                    setJsonUploaded(data);
                    setUploadStatus('success');
                } else {
                    setMessage(data.detail || "An error occurred during load check");
                    setUploadStatus('error');
                }

            } catch (error) {
                console.error('Error uploading:', error);
                setMessage(`An error occurred: ${error}`);
                setUploadStatus('error');

            } finally {

                if (config.refreshFunction && config.setRefreshData) {
                    try {
                        const fetchedData = await config.refreshFunction();
                        if (config.name === 'model') {
                            console.log("Fetched data:", fetchedData.models);
                            config.setRefreshData?.(fetchedData.models);
                        } else {
                            console.log("FETCHED DATA", fetchedData);
                            config.setRefreshData?.(fetchedData);
                        }
                    } catch (e) {
                        console.error("Error refreshing data:", e);
                    }
                }

                setLoadingHC(false);
                setFile(selectedFile);
            }

        } else {

            try {
                setLoadingHC(true);
                const fileContent = await selectedFile.text();
                const jsonData = JSON.parse(fileContent);
                console.log("JSON DATA", jsonData);
                setJsonUploaded(jsonData);
                
        
            } catch (error) {
                console.error('Error reading JSON file:', error);
                setMessage(`An error occurred while reading the JSON file: ${error}`);
                setUploadStatus('error');
                return;
            } finally {
                setLoadingHC(false);
                setFile(selectedFile);
            }
        }
    };


    const handleUpload = async () => {
       
        if (config.name !== "report") {
            if (!file) {
                setMessage(`Please select a ${config.fileType} file first.`);
                setUploadStatus('error');
                return;
            }

            setMessage(`Uploading ${file.name}...`);
            setLoading(true);
            setUploadStatus(null);
            const fileName = file.name.split('.').slice(0, -1).join('.')

            const url = new URL(config.uploadUrl);
            if (config.name == "dataset") {
                url.searchParams.append("dataset_name", fileName);
            } else if (config.name == "model") {
                url.searchParams.append("model_name", fileName);
            }

            try {
                const response = await fetch(url);
                console.log("RESPONSE", response)

                if (response.ok) {
                    setMessage(`Upload successful! Check the Dataset Repository.`);
                    setUploadStatus('success');
                } else {
                    const data = await response.json(); // 👈 parse JSON body
                    setMessage(data.message || "An error occurred");
                    setUploadStatus('error');
                }

            } catch (error) {
                console.error('Error uploading:', error);
                setMessage(`An error occurred: ${error}`);
                setUploadStatus('error');

            } finally {
                if (config.refreshFunction && config.setRefreshData) {
                    config.refreshFunction().then(fetchedData => {
                        if (config.name === 'model') {
                            config.setRefreshData?.(fetchedData.models);
                        } else {
                            config.setRefreshData?.(fetchedData);
                        }
                    });
                }
                setLoading(false);
            }
        } else {
           
            try {
                const body = JSON.stringify(jsonUploaded);
                const headers = { "Content-Type": "application/json" };
                
                const tool = jsonUploaded.tool

                const url = tool === "dq"? uploadJsonReport_DQ : uploadJsonReport_NN

                const response = await fetch(url, {
                    method: 'POST',
                    headers,
                    body,
                });

                if (response.ok) {
                    setMessage('Report uploaded successfully!');
                    setUploadStatus('success');
                } else {
                    const data = await response.json();
                    setMessage(data.message || 'An error occurred uploading the report.');
                    setUploadStatus('error');
                }

            } catch (error) {
                console.error('Error uploading report:', error);
                setMessage(`An error occurred: ${error}`);
                setUploadStatus('error');
            }
        }
    };

    return (
        <>
            <Stack
                justify="space-around">
                <div className={classes.containerDropzone}>
                    {infoModal}

                    <div className={classes.dropzone}>
                        {file ? (
                            <>
                                <Group justify="space-between" mt="sm" style={{ width: '100%' }}>
                                    <Flex direction="column" justify="flex-start" align="flex-start" gap="xs">
                                        <Text size="md" c="dimmed">File chosen:</Text>
                                        <Group justify='center'>
                                            <IconDatabase size={30} color="#475569" />
                                            <Text size="xl" fw={600} c="#1e293b" inline>{file.name}</Text>
                                        </Group>
                                    </Flex>

                                    <ActionIcon
                                        color="#FF6961"
                                        onClick={() => {
                                            setFile(null);
                                            setMessage('');
                                            setUploadStatus(null);
                                        }}

                                    >
                                        <IconTrash size={20} />
                                    </ActionIcon>
                                </Group>

                            </>
                        ) : (
                            <Dropzone
                                onDrop={(files) => {
                                    const newFile = files[0];
                                    if (newFile) {
                                        handleFileChange(newFile);
                                    }
                                }}
                                onReject={() => {
                                    setMessage('Invalid file type or size');
                                }}
                                maxSize={1000 * 1024 ** 2}
                                accept={Object.fromEntries(
                                    (Array.isArray(config.accept) ? config.accept : [config.accept])
                                        .map(type => [type, [config.fileType]])
                                )}
                                multiple={false}
                            >
                                <Flex direction="column" justify="center" align="center" gap="xl" mih={180} style={{ pointerEvents: 'none' }}>
                                    <Dropzone.Accept>
                                        <ThemeIcon size={65} radius="xl" variant="light" color="var(--mantine-color-blue-6)" >
                                            <IconUpload size={50} stroke={1.5} />,
                                        </ThemeIcon>
                                        <Text size="lg" fw={600} mt="20px" c="#333333" inline>
                                            Release to load
                                        </Text>
                                    </Dropzone.Accept>
                                    <Dropzone.Reject>
                                        <ThemeIcon size={65} radius="xl" variant="light" color="#FF6961" >
                                            <IconX size={48} stroke={1.5} />
                                        </ThemeIcon>

                                        <Text size="lg" fw={600} mt="20px" c="#333333" inline>
                                            You are trying to upload a file that is not a .{config.fileType} file!
                                        </Text>

                                    </Dropzone.Reject>
                                    <Dropzone.Idle>
                                        {loadingHC ? (
                                            <>
                                                <Loader />
                                            </>
                                        ) : (config.name === 'dataset' ? (<>
                                            <ThemeIcon size={65} radius="xl" variant="light" color="#475569" >
                                                <Database size={48} />
                                            </ThemeIcon>
                                            <Text size="1vw" fw={600} c="#1e293b" mt="20px" inline >
                                                Dataset
                                            </Text>
                                        </>

                                        ) : (config.name === 'model' ? (<>
                                            <ThemeIcon size={65} radius="xl" variant="light" color="#475569" >
                                                <Brain size={48} />
                                            </ThemeIcon>
                                            <Text size="1vw" fw={600} c="#1e293b" mt="20px" inline >
                                                Model
                                            </Text>
                                        </>
                                        ) : (config.name === 'report' ? (<>
                                            <ThemeIcon size={65} radius="xl" variant="light" color="#475569" >
                                                <FileText size={48} />
                                            </ThemeIcon>
                                            <Text size="1vw" fw={600} c="#1e293b" mt="20px" inline >
                                                Report
                                            </Text>
                                        </>) : null)))}


                                        <Text size="0.7vw" fw={600} c="#1e293b" mt="16px" inline >
                                            Drag a {config.fileType} file here or click to select
                                        </Text>

                                        <Text size="0.6vw" c="#475569" inline mt={7}>
                                            {config.description}
                                        </Text>

                                    </Dropzone.Idle>

                                </Flex>
                            </Dropzone>
                        )}

                    </div>

                    {jsonUploaded && (
                        <>
                            <Box style={{
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

                            </Box >

                            <Group justify="center" mt="md">
                                <Button
                                    leftSection={<IconCloudUpload size={16} />}
                                    onClick={handleUpload}
                                    loading={loading}
                                    disabled={!file || loading}
                                    size="md"
                                    variant="gradient"
                                    gradient={{ from: "#1e293b", to: "red", deg: 90 }}
                                >
                                    {loading ? 'Uploading...' : 'Upload'}
                                </Button>
                            </Group>
                        </>
                    )}

                    {uploadStatus == "success" ? (
                        <AlertCust result={'success'} textToDisplay={message} />
                    ) : (
                        uploadStatus == "error" ? (
                            <AlertCust result={'error'} textToDisplay={message} />
                        ) : null
                    )}
                </div>
            </Stack >
        </>


    );
}