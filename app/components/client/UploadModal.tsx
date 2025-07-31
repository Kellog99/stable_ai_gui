"use client"

import { Divider, Modal, Text, Tooltip } from "@mantine/core";
import ZipUploader from "./Uploader";
import { InfoCircle } from "@vectopus/atlas-icons-react";


interface UploadDatasetModalProps
{
    opened: boolean;
    close: () => void;
}

export default function UploadModal ( { opened, close }: UploadDatasetModalProps )
{
    return (
        <>
            <Modal.Root
                opened={ opened }
                onClose={ () => close() }

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