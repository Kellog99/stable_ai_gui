"use client"

import { Divider, Modal, Text, Tooltip } from "@mantine/core";
import ZipUploader from "./Uploader";
import { InfoCircle } from "@vectopus/atlas-icons-react";
import ModelUploader from "./ModelUploader";


interface UploadDatasetModalProps {
    opened: boolean;
    close: () => void;
    object: string;
}

export default function UploadModal({ opened, close, object }: UploadDatasetModalProps) {

    return (
        <>
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
                        {object === "dataset" ? <ZipUploader /> : <ModelUploader />}
                    </Modal.Body>

                </Modal.Content>
            </Modal.Root >
        </>
    )
}