import { ActionIcon, Box, Button, Code, Divider, Flex, Group, Modal, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import { useDisclosure } from '@mantine/hooks';
import { IconCloudUpload, IconDatabase, IconFileText, IconFileZip, IconTrash, IconUpload, IconX } from '@tabler/icons-react';
import { InfoIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import classes from '../../styles/FileDropZone.module.css';

type Props = {
    config: {
        fileType: string;
        accept: string;
        description?: string;
        title: string;
        icon: React.ReactNode;
    };
};



export function DragDrop ( { config }: Props )
{
    const [ file, setFile ] = useState<File | null>( null );
    const [ message, setMessage ] = useState<string>( '' );
    const [ loading, setLoading ] = useState<boolean>( false );
    const [ uploadStatus, setUploadStatus ] = useState<string | null>( null );
    const [ opened, { toggle } ] = useDisclosure( false );

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
        console.log( "file uploaded :))" )
    }

    useEffect( () =>
    {
        console.log( "message updated:", message );
        if ( file ) {
            console.log( 'File ready for upload:', file );
        }

    }, [ file, message ] )

    const jsonExample = `{
    "arrow": false,
    "task": "classification",
    "type": "image",
    "description": "Some text",
    "label_dict": {
        "0": "antelope",
        "1": "badger"
    }
}`;

    return (
        <>
            <Stack>
                <Box style={ {
                    padding: '10px',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    width: '100%'
                } }
                    onClick={ toggle }
            
                >
                    <Group justify='space-between' >
                        <Group justify='flex-start' style={ { cursor: 'pointer' } }>
                            <InfoIcon size={ 12 } />
                            <Text size="sm" c="var(--mantine-color-gray-7)">Info about the zip to upload</Text>
                        </Group>
                        {/*<IconChevronDown size={ 16 } style={ { color: "var(--mantine-color-gray-7)", marginLeft: 10, transform: opened ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' } } />*/ }
                    </Group>
                    <Modal opened={ opened } onClose={ toggle } title="Upload Information" >
                        
                        <Divider my="xs" color="var(--mantine-color-gray-7)" />
                        <Text size="sm" c="var(--mantine-color-gray-7)" mb="8px">
                            The zip you are going to upload must contain the raw data files and a json config file, optionally it could contain the pre-injested arrow file.
                            The json config file must contain the following fields:
                        </Text>
                        <Code color="var(--mantine-color-gray-8)" c="white" block>
                            { jsonExample }
                        </Code>
                        <Text size="sm" c="var(--mantine-color-gray-7)" mt="8px">
                            The fields <Code color="var(--mantine-color-gray-8)" c="white">task</Code> and <Code color="var(--mantine-color-gray-8)" c="white">type</Code> are mandatory in case the arrow file is not supplied.
                        </Text>
                    </Modal>
                    {/*
                                        <Collapse in={ opened }>
                        <Divider my="xs" color="var(--mantine-color-gray-7)"/>
                        <Text size="sm" c="var(--mantine-color-gray-7)" mb="8px">
                            The zip you are going to upload must contain the raw data files and a json config file, optionally it could contain the pre-injested arrow file.
                            The json config file must contain the following fields:
                        </Text>
                        <Code color="var(--mantine-color-gray-8)" c="white" block>
                            { jsonExample }
                        </Code>
                        <Text size="sm" c="var(--mantine-color-gray-7)" mt="8px">
                            The fields <Code color="var(--mantine-color-gray-8)" c="white">task</Code> and <Code color="var(--mantine-color-gray-8)" c="white">type</Code> are mandatory in case the arrow file is not supplied.
                        </Text>

                    </Collapse>
                    */}
                </Box>

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
                                        <IconUpload size={ 48 } stroke={ 1.5 } />,
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


                                    <Text size="xl" fw={ 600 } c="#1e293b" mt="20px" inline >
                                        Drag a { config.fileType } file here or click to select
                                    </Text>

                                    <Text size="sm" c="#475569" inline mt={ 7 }>
                                        { config.description }
                                    </Text>

                                </Dropzone.Idle>

                            </Flex>
                        </Dropzone>
                    ) }

                </div>

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
                        { loading ? 'Uploading...' : 'Upload File' }
                    </Button>
                </Group>
            </Stack>
        </>


    );
}