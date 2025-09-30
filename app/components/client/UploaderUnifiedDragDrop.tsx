import { ActionIcon, Box, Button, Code, Collapse, Divider, Flex, Group, List, Stack, Text, ThemeIcon } from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import { useDisclosure } from '@mantine/hooks';
import { IconChevronDown, IconCloudUpload, IconDatabase, IconFileText, IconFileZip, IconTrash, IconUpload, IconX } from '@tabler/icons-react';
import { CheckIcon, FolderIcon } from 'lucide-react';
import { useState } from 'react';
import classes from '../../styles/FileDropZone.module.css';

type Props = {
    config: {
        name: string;
        fileType: string;
        accept: string;
        description?: string;
        uploadUrl: string;
        refreshFunction: () => Promise<any>; //ex: "DatasetsLoader" is the function the reloads the data with the new upload
        setRefreshData: ( data: any ) => void;

    };
    infoModal: React.ReactNode
};



export function DragDrop ( { config, infoModal }: Props )
{
    const [ file, setFile ] = useState<File | null>( null );
    const [ message, setMessage ] = useState<string>( '' );
    const [ loading, setLoading ] = useState<boolean>( false );
    const [ uploadStatus, setUploadStatus ] = useState<string | null>( null );
    const [jsonUploaded, setJsonUploaded] = useState<Object>({})

    const [ openedJs, { toggle: toggleJs } ] = useDisclosure( false );

    const validateFile = ( selectedFile: File ): boolean =>
    {

        const expectedExtension = `.${config.fileType}`;
        const expectedMimeType = config.fileType === 'zip' ? 'application/zip' : 'application/octet-stream';

        return selectedFile.name.endsWith( expectedExtension ) ||
            ( config.fileType === 'zip' && selectedFile.type === expectedMimeType );
    };


    const handleFileChange = async ( selectedFile: File ) =>
    {
        if ( !selectedFile ) {
            setMessage( 'No file selected.' );
            setUploadStatus( null );
            return;
        }

        if ( !validateFile( selectedFile ) ) {
            console.log( "sono qui" )
            setMessage( `Please select a ${config.accept} file.` );
            setUploadStatus( 'error' );
            return;
        }

        setFile( selectedFile );
        setMessage( `Selected file: ${selectedFile.name}. Ready to upload.` );
        setUploadStatus( null );
    };

    const handleUpload = async () =>
    {
        if ( !file ) {
            setMessage( `Please select a ${config.fileType} file first.` );
            setUploadStatus( 'error' );
            return;
        }

        setMessage( `Uploading ${file.name}...` );
        setLoading( true );
        setUploadStatus( null );

        const formData = new FormData();
        formData.append( config.name, file );

        try {
            const response = await fetch( config.uploadUrl, {
                method: 'POST',
                body: formData,
            } );

            if ( response.ok ) {
                const data = await response.json();
                setJsonUploaded(data)
                setMessage( `Upload successful` );
                setUploadStatus( 'success' );
            }
        } catch ( error ) {
            console.error( 'Error uploading:', error );
            setMessage( `An error occurred: ${error}` );
            setUploadStatus( 'error' );

        } finally {
            if ( config.refreshFunction && config.setRefreshData ) {
                config.refreshFunction().then( fetchedData =>
                {
                    if ( config.fileType === 'pth' ) {
                        config.setRefreshData?.( fetchedData.names );
                    } else {
                        config.setRefreshData?.( fetchedData );
                    }
                } );
            }
            setLoading( false );
        }
    };



    return (
        <>
            <Stack
                justify="space-around">

                { infoModal }

                <div className={ classes.dropzone }>
                    { file ? (
                        <>
                            <Group justify="space-between" mt="sm" style={ { width: '100%' } }>
                                <Flex direction="column" justify="flex-start" align="flex-start" gap="xs">
                                    <Text size="md" c="dimmed">File chosen:</Text>
                                    <Group justify='center'>
                                        <IconDatabase size={ 30 } color="#475569" />
                                        <Text size="xl" fw={ 600 } c="#1e293b" inline>{ file.name }</Text>
                                    </Group>
                                </Flex>

                                <ActionIcon
                                    color="#FF6961"
                                    onClick={ () =>
                                    {
                                        setFile( null );
                                        setMessage( '' );
                                    } }

                                >
                                    <IconTrash size={ 20 } />
                                </ActionIcon>
                            </Group>

                        </>
                    ) : (
                        <Dropzone
                            onDrop={ ( files ) =>
                            {
                                const newFile = files[ 0 ];
                                if ( newFile ) {
                                    handleFileChange( newFile );
                                }
                            } }
                            onReject={ () =>
                            {
                                setMessage( 'Invalid file type or size' );
                            } }
                            maxSize={ 1000 * 1024 ** 2 }
                            accept={ Object.fromEntries(
                                ( Array.isArray( config.accept ) ? config.accept : [ config.accept ] )
                                    .map( type => [ type, [ config.fileType ] ] )
                            ) }
                            multiple={ false }
                        >
                            <Flex direction="column" justify="center" align="center" gap="xl" mih={ 180 } style={ { pointerEvents: 'none' } }>
                                <Dropzone.Accept>
                                    <ThemeIcon size={ 65 } radius="xl" variant="light" color="var(--mantine-color-blue-6)" >
                                        <IconUpload size={ 50 } stroke={ 1.5 } />,
                                    </ThemeIcon>
                                    <Text size="lg" fw={ 600 } mt="20px" c="#333333" inline>
                                        Release to load
                                    </Text>
                                </Dropzone.Accept>
                                <Dropzone.Reject>
                                    <ThemeIcon size={ 65 } radius="xl" variant="light" color="#FF6961" >
                                        <IconX size={ 48 } stroke={ 1.5 } />
                                    </ThemeIcon>

                                    <Text size="lg" fw={ 600 } mt="20px" c="#333333" inline>
                                        You are trying to upload a file that is not a .{ config.fileType } file!
                                    </Text>

                                </Dropzone.Reject>
                                <Dropzone.Idle>
                                    { config.fileType === 'zip' ? (
                                        <ThemeIcon size={ 65 } radius="xl" variant="light" color="#475569" >
                                            <IconFileZip size={ 48 } stroke={ 1.5 } />
                                        </ThemeIcon>
                                    ) : (
                                        <ThemeIcon size={ 65 } radius="xl" variant="light" color="#475569" >
                                            <IconFileText size={ 48 } stroke={ 1.5 } />
                                        </ThemeIcon>
                                    ) }


                                    <Text size="1vw" fw={ 600 } c="#1e293b" mt="20px" inline >
                                        Drag a { config.fileType } file here or click to select
                                    </Text>

                                    <Text size="0.6vw" c="#475569" inline mt={ 7 }>
                                        { config.description }
                                    </Text>

                                </Dropzone.Idle>

                            </Flex>
                        </Dropzone>
                    ) }

                </div>

                <Box style={ {
                    padding: '10px',
                    backgroundColor: 'rgba(53, 216, 61, 0.2)',
                    borderRadius: '8px',
                    width: '100%',

                    visibility: file ? "visible" : "hidden"
                } }


                >
                    <Group justify='space-between' onClick={ toggleJs } style={ { cursor: 'pointer' } }  >
                        <Group justify='flex-start'>
                            <CheckIcon size={ 12 } />
                            <Text size="sm" c="var(--mantine-color-gray-7)">Data you loaded:</Text>
                        </Group>
                        <IconChevronDown size={ 16 } style={ { color: "var(--mantine-color-gray-7)", marginLeft: 10, transform: openedJs ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' } } />
                    </Group>

                    <Collapse in={ openedJs }>
                        <Divider my="xs" color="rgba(30, 120, 40, 0.9)" />

                        <Box
                            p="md"
                            style={ {
                                backgroundColor: 'rgba(30, 120, 40, 0.05)',
                                borderRadius: '8px',
                                border: '1px solid rgba(30, 120, 40, 0.2)'
                            } }
                        >
                            <List
                                spacing="sm"
                                size="sm"
                                icon={
                                    <ThemeIcon
                                        color="rgba(30, 120, 40, 0.9)"
                                        size={ 8 }
                                        radius="xl"
                                    />
                                }
                            >
                                <List.Item>
                                    <Group gap="xs">
                                        <FolderIcon size={ 16 } style={ { color: 'rgba(30, 120, 40, 0.9)' } } />
                                        <Text c="var(--mantine-color-gray-7)" size="sm" fw={ 600 }>Data Folder Name:</Text>
                                        <Text c="var(--mantine-color-gray-7)" size="sm" style={ { fontFamily: 'monospace' } }>{ file?.name?.split( '.' ).slice( 0, -1 ).join( '.' ) }</Text>
                                    </Group>
                                </List.Item>

                                <List.Item>
                                    <Group gap="xs">
                                        <FolderIcon size={ 16 } style={ { color: 'rgba(30, 120, 40, 0.9)' } } />
                                        <Text c="var(--mantine-color-gray-7)" size="sm" fw={ 600 }>JSON Content:</Text>
                                    </Group>
                                </List.Item>
                            </List>

                            <Box ml="xl" mt="sm">
                                <Code block style={ { fontSize: '0.75rem', backgroundColor: "rgba(30, 120, 40, 0.3)" } }>
                                    {JSON.stringify(jsonUploaded, null, 2)}
                                </Code>
                            </Box>

                        </Box>
                    </Collapse>

                </Box >

                <Group justify="center" mt="md">
                    <Button
                        leftSection={ <IconCloudUpload size={ 16 } /> }
                        onClick={ handleUpload }
                        loading={ loading }
                        disabled={ !file || loading }
                        size="md"
                        variant="gradient"
                        gradient={ { from: "#1e293b", to: "red", deg: 90 } }
                    >
                        { loading ? 'Uploading...' : 'Upload' }
                    </Button>
                </Group>
            </Stack >
        </>


    );
}