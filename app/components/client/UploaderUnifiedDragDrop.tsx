import { ActionIcon, Group, Text } from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import { IconFileText, IconFileZip, IconTrash, IconUpload, IconX } from '@tabler/icons-react';
import { useState } from 'react';
import styles from "../../pages/dataquality/datasets/page.module.css";

type Props = {
    config: {
        fileType: string;
        accept: string[] | undefined;
        description?: string;
    };
};



export function DragDrop ( { config }: Props )
{
    const [ file, setFile ] = useState<File | null>( null );
    const [ message, setMessage ] = useState<string>( '' );
    const [ loading, setLoading ] = useState<boolean>( false );
    const [ uploadStatus, setUploadStatus ] = useState<string | null>( null );

    const validateFile = ( selectedFile: File ): boolean =>
    {
        const expectedExtension = `.${config.fileType}`;
        const expectedMimeType = config.fileType === 'zip' ? 'application/zip' : 'application/octet-stream';

        return selectedFile.name.endsWith( expectedExtension ) ||
            ( config.fileType === 'zip' && selectedFile.type === expectedMimeType );
    };
    const handleFileChange = async ( selectedFile: File ) =>
    {
        console.log( "Selected file:", selectedFile );
        if ( !selectedFile ) {
            setMessage( 'No file selected.' );
            setUploadStatus( null );
            return;
        }

        if ( !validateFile( selectedFile ) ) {
            setMessage( `Please select a ${config.accept} file.` );
            setUploadStatus( 'error' );
            return;
        }

        setFile( selectedFile );
        setMessage( `Selected file: ${selectedFile.name}. Ready to upload.` );
        setUploadStatus( null );
    };


    return (


        <div className={ styles.featureBox }>
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
                maxSize={ 5 * 1024 ** 2 }
                accept={ config.accept }
                multiple={ false }
            >
                <Group justify="center" gap="xl" mih={ 180 } style={ { pointerEvents: 'none' } }>
                    <Dropzone.Accept>
                        <IconUpload size={ 52 } color="var(--mantine-color-blue-6)" stroke={ 1.5 } />
                    </Dropzone.Accept>
                    <Dropzone.Reject>
                        <IconX size={ 52 } color="var(--mantine-color-red-6)" stroke={ 1.5 } />
                    </Dropzone.Reject>
                    <Dropzone.Idle>
                        { config.fileType === 'zip' ? (
                            <IconFileZip size={ 52 } color="var(--mantine-color-dimmed)" stroke={ 1.5 } />
                        ) : (
                            <IconFileText size={ 52 } color="var(--mantine-color-dimmed)" stroke={ 1.5 } />
                        ) }
                    </Dropzone.Idle>

                    <div>
                        <Text size="xl" inline>
                            Drag a { config.fileType } file here or click to select
                        </Text>
                        <Text size="sm" c="dimmed" inline mt={ 7 }>
                            { config.description }
                        </Text>
                    </div>
                </Group>
            </Dropzone>

            { file && (
                <Group justify="space-between" mt="sm">
                    <Text size="sm">{ file.name }</Text>
                    <ActionIcon
                        color="red"
                        onClick={ () =>
                        {
                            setFile( null );
                            setMessage( '' );
                        } }
                    >
                        <IconTrash size={ 16 } />
                    </ActionIcon>
                </Group>
            ) }
        </div>

    );
}