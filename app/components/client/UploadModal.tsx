"use client"

import { Box, Button, CloseButton, Divider, FileButton, Flex, Group, Modal, Text, TextInput, Tooltip } from "@mantine/core";
import { useEffect, useState } from "react";
import { Folder, InfoCircle, UploadArrowTray } from "@vectopus/atlas-icons-react";
import { uploadFile } from "@/functionalities/DatasetsLoader";
import { isNotEmpty, useForm } from "@mantine/form";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import
{
    faCheck
} from '@fortawesome/free-solid-svg-icons';


interface UploadDatasetModalProps
{
    opened: boolean;
    close: () => void;
}

export default function UploadModal ( { opened, close }: UploadDatasetModalProps )
{

    const [ fileUpload, setFileUpload ] = useState<File | null>( null )
    const [ fileSelected, setFileSelected ] = useState( false );
    const [ fileName, setFileName ] = useState<string>( "" )
    const [ filePath, setFilePath ] = useState<string>( "" )
    const [ uploadConfigs, setUploadConfigs ] = useState<Object>( {} )
    const [ clicked, setClicked ] = useState( false )

    const [name, extension] = fileName.split( '.' );
    

    const handleFileUpload = ( file: any ) =>
    {
        setFileName( file.name )
        setFilePath( `/public/` )
        setFileSelected( true );
        setFileUpload( file )
        form.setFieldValue( 'file', file );
    }



    const handleCancel = () =>
    {
        setFileSelected( false )
        setFileName( "" )
    }

    const form = useForm( {
        mode: 'uncontrolled',
        initialValues: {
            name: fileSelected ? name : "",
            task: "",
            description: "",
            file: null,
        },
        validate: {
            name: isNotEmpty( 'Please choose a name' ),
            task: isNotEmpty( 'Please choose a task' ),
            description: isNotEmpty( 'Please supply a brief description' ),
            file: ( value ) => ( value ? null : 'Please upload a file' ),
        },
    } );


    const handleSubmit = ( formValues: any ) =>
    {
        
        if ( fileUpload instanceof File ) {
            const formData = new FormData();


            if ( formValues.name === name ) {
                formData.append( "file", fileUpload as File );
                uploadFile( formData );
            
            } else {

                const newFileName = formValues.name + "." + extension;
                formData.append( "file", fileUpload as File, newFileName );
                uploadFile( formData );
            }

            console.log( "formdata", formData )

            setClicked( true );

            console.log("path", filePath)
            const updatedFormValues = {
                ...formValues,
                path: filePath
            };

            setUploadConfigs( updatedFormValues );

            setTimeout( () =>
            {
                setClicked( false );
            }, 3000 );
        }
    };


    useEffect( () =>
    {
        if ( fileSelected ) {
            form.setFieldValue( 'name', name, { forceUpdate: false } );
        } else {
            form.setFieldValue( 'name', '', { forceUpdate: false } );
        }
    }, [ fileSelected, fileName ] );


    console.log( "upload Configs", uploadConfigs )

    const handleClose = () =>
    {
        close()
        setFileSelected( false )
        form.reset()
    }


    {/*
    useEffect( () =>
    {
        if ( !file ) return;

        const uploadFile = async () =>
        {
            const formData = new FormData();
            formData.append( "file", file );

            try {
                const res = await fetch( "/api/upload", {
                    method: "POST",
                    body: formData,
                } );
                if ( !res.ok ) throw new Error( "Upload failed" );
                alert( "File uploaded successfully" );

            } catch ( err ) {
                alert( "Error uploading file" );
            }
        };

        uploadFile();
    }, [ file ] );
*/}

    return (
        <>
            <Modal.Root
                opened={ opened }
                onClose={ handleClose }

                radius="md"
                centered
                transitionProps={ { transition: 'fade', duration: 150, timingFunction: 'linear' } }
                styles={ {
                    header: {
                        borderBottom: '1px solid #ccc',  // adds a line below the title section
                        fontWeight: 'bold',              // make title bold
                        paddingBottom: 0,               // add some spacing below the line
                    },
                } }>

                <Modal.Overlay />
                <Modal.Content>
                    <Modal.Header>
                        <Modal.Title>
                            <span style={ { display: 'flex', alignItems: 'center', gap: "8px" } }>
                                <Text fw={ 600 }>Upload New Dataset</Text>
                                <Tooltip
                                    multiline
                                    w={ 220 }
                                    withArrow
                                    transitionProps={ { duration: 200 } }
                                    label="Here you can upload your own dataset so you can explore and analyze it.
                                    For more information about how you should prepare your dataset, check the Help section.">
                                    <InfoCircle size={ 15 } />
                                </Tooltip>
                            </span>
                        </Modal.Title>
                        <Modal.CloseButton />
                        <Divider my="md" />
                    </Modal.Header>

                    <Modal.Body>
                        <form onSubmit={ form.onSubmit( handleSubmit ) }>

                            <Flex direction="column" gap="md">

                                <Box
                                    style={ ( theme ) => ( {
                                        border: '2px dashed',
                                        borderColor: form.errors.file ? theme.colors.red[ 6 ] : 'black',
                                        padding: '10px',
                                        marginTop: '20px',
                                        '&:hover': {
                                            borderColor: form.errors.file ? theme.colors.red[ 6 ] : 'black',
                                            boxShadow: form.errors.file ? `0 0 0 1px ${theme.colors.red[ 6 ]}` : undefined,
                                            transition: 'border-color 150ms ease, box-shadow 150ms ease',
                                        },
                                        position: 'relative',
                                    } ) }
                                >

                                    <Flex direction="column" justify="center" align="center" gap="md">

                                        { fileSelected ? (
                                            <>
                                                <Folder size={ 18 } />
                                                <Flex direction="row" gap="xs" align="center">
                                                    <Text size="sm" c="dimmed">{ fileName }</Text>
                                                    <CloseButton size="xs" onClick={ handleCancel } />
                                                </Flex>

                                            </> ) : (
                                            <>
                                                <FileButton onChange={ handleFileUpload } accept="image/png,image/jpeg">
                                                    { ( props ) =>
                                                        <Button { ...props } radius="xl" variant="light">
                                                            <UploadArrowTray size={ 18 } />
                                                        </Button> }
                                                </FileButton>

                                                <Text
                                                    size="sm"

                                                    style={ ( theme ) => ( {
                                                        color: form.errors.file ? theme.colors.red[ 6 ] : theme.colors.gray[ 6 ],
                                                    } ) }
                                                >Drag and drop a .zip file here, or click to select</Text>
                                            </> ) }
                                    </Flex>
                                    { form.errors.file && (
                                        <Text
                                            size="xs"
                                            style={ ( theme ) => ( {
                                                position: 'absolute',
                                                top: '100%',
                                                left: '70%',
                                                marginTop: 4,
                                                color: theme.colors.red[ 6 ],
                                            } ) }
                                        >{ form.errors.file }</Text>
                                    ) }
                                </Box>


                                <TextInput
                                    label="Name"
                                    placeholder="Specify the name of the Dataset"
                                    withAsterisk
                                    { ...form.getInputProps( 'name' ) }
                                />
                                <TextInput
                                    label="Task"
                                    placeholder="Specify the task of the Dataset"
                                    withAsterisk
                                    { ...form.getInputProps( 'task' ) }
                                />
                                <TextInput
                                    label="Description"
                                    placeholder="Write a description of the Dataset"
                                    withAsterisk
                                    { ...form.getInputProps( 'description' ) }
                                />

                                <Button type="submit" mt="md" >
                                    { clicked ? ( <>
                                        <FontAwesomeIcon icon={ faCheck } style={ { marginRight: 8 } } />
                                        <span>Dataset Uploaded</span></> )
                                        : "Upload" }
                                </Button>


                            </Flex>
                        </form>
                    </Modal.Body>

                </Modal.Content>
            </Modal.Root >
        </>
    )
}