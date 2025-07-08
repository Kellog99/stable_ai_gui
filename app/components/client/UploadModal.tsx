"use client"

import { Alert, Box, Button, CloseButton, Divider, FileButton, Flex, Group, LoadingOverlay, Modal, Overlay, Select, Text, TextInput, Tooltip } from "@mantine/core";
import { useEffect, useState } from "react";
import { Folder, InfoCircle, UploadArrowTray } from "@vectopus/atlas-icons-react";
import DatasetsLoader, { uploadFile } from "@/functionalities/DatasetsLoader";
import { isNotEmpty, useForm } from "@mantine/form";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import
{
    faCheck, faCircleExclamation
} from '@fortawesome/free-solid-svg-icons';
import { copyFiles, upload } from "@/functionalities/BackendUtils";
import BatchFileUpload from "./Uploader";
import SequentialFileUpload from "./Uploader";
import FolderUploader from "./Uploader";
import ZipUploader from "./Uploader";


interface UploadDatasetModalProps
{
    opened: boolean;
    close: () => void;
}

export default function UploadModal ( { opened, close }: UploadDatasetModalProps )
{

    const [ fileSelected, setFileSelected ] = useState( false );
    const [ fileName, setFileName ] = useState<string>( "" )
    const [ clicked, setClicked ] = useState( false )
    const [ reloading, setReloading ] = useState( false )
    const [ showError, setShowError ] = useState( false )


    {/*
    const handleFileUpload = ( file: any ) =>
    {
        setFileName( file.name )
        console.log("path", file)
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
        */}

    const form = useForm( {
        mode: 'uncontrolled',
        initialValues: {
            filepath: "",
            name: fileSelected ? fileName : "",
            task: "",
            description: "",
            type: "",
            modality: ""

        },
        validate: {
            filepath: isNotEmpty( 'Please choose a file path' ),
            name: isNotEmpty( 'Please choose a name' ),
            task: isNotEmpty( 'Please choose a task' ),
            description: isNotEmpty( 'Please supply a brief description' ),
            type: isNotEmpty( 'Please indicate the type of the ingestion you want to perform' ),
            modality: isNotEmpty( 'Please indicate the type of the main feature' ),

        },
    } );


    const handleSubmit = ( formValues: any ) =>
    {
        const path = require( 'path' );
        if ( formValues.name === path.basename( formValues.filepath ) ) {

            copyFiles( formValues.filepath )

        } else {

            const newFolderName = formValues.name;

            copyFiles( formValues.filepath, newFolderName )

        }

        setClicked( true );

        const { filepath, ...rest } = formValues;
        const updatedFormValues = { ...rest };


        if ( updatedFormValues.type === "Classification" ) {
            updatedFormValues.type = "class";
        } else if ( updatedFormValues.type === "Single Feature" ) {
            updatedFormValues.type = "single"
        } else if ( updatedFormValues.type === "Object Detection" ) {
            updatedFormValues.type == "odetect"
        }



        setReloading( true )
        upload( updatedFormValues ).then( () =>
        {
            setReloading( false )
            window.location.reload();

        } ).catch( ( error ) =>
        {
            setReloading( false );
            setShowError( true )

            setTimeout( () =>
            {
                setClicked( false );
            }, 3000 );
        } );

    };


    useEffect( () =>
    {
        if ( fileSelected ) {
            form.setFieldValue( 'name', fileName, { forceUpdate: false } );
        } else {
            form.setFieldValue( 'name', '', { forceUpdate: false } );
        }
    }, [ fileSelected, fileName ] );



    const handleClose = () =>
    {
        close()
        setFileSelected( false )
        setShowError( false )
        form.reset()
    }

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
                        <ZipUploader/>
                    </Modal.Body>

                </Modal.Content>
            </Modal.Root >
        </>
    )
}