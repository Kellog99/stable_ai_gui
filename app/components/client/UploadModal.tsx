"use client"

import { Divider, Text, Tooltip } from "@mantine/core";
import { InfoCircle } from "@vectopus/atlas-icons-react";
import { usePathname } from "next/navigation";
import ModelUploader from "./ModelUploader";
import NNDatasetUploader from "./NNDatasetUploader";
import ZipUploader from "./Uploader";


interface UploadDatasetModalProps
{
    
    object: string;
}

export default function UploadModal ( {  object }: UploadDatasetModalProps )
{
    const pathName = usePathname();

    const isNNTrust = pathName.includes( '/nntrust' );

    return (
        <>
            {/*
            <Modal.Root
                opened={opened}
                onClose={() => close()}

                radius="md"
                centered
                transitionProps={{ transition: 'fade', duration: 150, timingFunction: 'linear' }}
                styles={{
                    header: {
                        borderBottom: '1px solid #ccc',  
                        fontWeight: 'bold',              
                        paddingBottom: 0,               
                    },
                }}>
                <Modal.Overlay />
                <Modal.Content>
                    <Modal.Header>
                        <Modal.Title>
                            <span style={{ display: 'flex', alignItems: 'center', gap: "8px" }}>
                                {object == "dataset" ? (<>
                                    <Text fw={600}>Upload New Dataset</Text>
                                    <Tooltip
                                        multiline
                                        w={220}
                                        withArrow
                                        transitionProps={{ duration: 200 }}
                                        label="Here you can upload your own dataset.
                                    For more information about how you should prepare your dataset, check the Help section.">
                                        <InfoCircle size={15} />
                                    </Tooltip>
                                </>) : (<>
                                    <Text fw={600}>Upload New Model</Text>
                                    <Tooltip
                                        multiline
                                        w={220}
                                        withArrow
                                        transitionProps={{ duration: 200 }}
                                        label="Here you can upload your own model so you can test it.">
                                        <InfoCircle size={15} />
                                    </Tooltip>
                                </>)}

                            </span>
                        </Modal.Title>
                        <Modal.CloseButton />
                        <Divider my="md" />
                    </Modal.Header>

                    <Modal.Body>
                        {object === "dataset" ? (isNNTrust ? <NNDatasetUploader/> : <ZipUploader />) : <ModelUploader />}
                    </Modal.Body>

                </Modal.Content>
            </Modal.Root >*/}


            <div
                style={ {
                    borderRadius: 'md',
                    border: '1px solid #ccc',
                } }>
                <div style={ {
                    borderBottom: '1px solid #ccc',
                    fontWeight: 'bold',
                    paddingBottom: 0,
                    padding: '16px',
                } }>
                    <div>
                        <span style={ { display: 'flex', alignItems: 'center', gap: "8px" } }>
                            { object == "dataset" ? ( <>
                                <Text fw={ 600 }>Upload New Dataset</Text>
                                <Tooltip
                                    multiline
                                    w={ 220 }
                                    withArrow
                                    transitionProps={ { duration: 200 } }
                                    label="Here you can upload your own dataset.
             For more information about how you should prepare your dataset, check the Help section.">
                                    <InfoCircle size={ 15 } />
                                </Tooltip>
                            </> ) : ( <>
                                <Text fw={ 600 }>Upload New Model</Text>
                                <Tooltip
                                    multiline
                                    w={ 220 }
                                    withArrow
                                    transitionProps={ { duration: 200 } }
                                    label="Here you can upload your own model so you can test it.">
                                    <InfoCircle size={ 15 } />
                                </Tooltip>
                            </> ) }
                        </span>
                    </div>
                    <Divider my="md" />
                </div>
                <div style={ { padding: '16px' } }>
                    { object === "dataset" ? ( isNNTrust ? <NNDatasetUploader /> : <ZipUploader /> ) : <ModelUploader /> }
                </div>
            </div>
        </>
    )
}