"use client"

import { Box, Button, Divider, FileButton, Flex, Group, Modal, Text, TextInput, Tooltip } from "@mantine/core";
import { useEffect, useState } from "react";
import { InfoCircle, UploadArrowTray } from "@vectopus/atlas-icons-react";

interface UploadDatasetModalProps {
    opened: boolean;
    close: () => void;
}

export default function UploadModal({ opened, close }: UploadDatasetModalProps) {
    const [file, setFile] = useState<File | null>(null)


    useEffect(() => {
        if (!file) return;

        const uploadFile = async () => {
            const formData = new FormData();
            formData.append("file", file);

            try {
                const res = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                });
                if (!res.ok) throw new Error("Upload failed");
                alert("File uploaded successfully");

            } catch (err) {
                alert("Error uploading file");
            }
        };

        uploadFile();
    }, [file]);


    return (
        <>
            <Modal.Root
                opened={opened}
                onClose={close}

                radius="md"
                centered
                transitionProps={{ transition: 'fade', duration: 150, timingFunction: 'linear' }}
                styles={{
                    header: {
                        borderBottom: '1px solid #ccc',  // adds a line below the title section
                        fontWeight: 'bold',              // make title bold
                        paddingBottom: 0,               // add some spacing below the line
                    },
                }}>

                <Modal.Overlay />
                <Modal.Content>
                    <Modal.Header>
                        <Modal.Title>
                            <span style={{ display: 'flex', alignItems: 'center', gap: "8px" }}>
                                <Text fw={600}>Upload New Dataset</Text>
                                <Tooltip
                                    multiline
                                    w={220}
                                    withArrow
                                    transitionProps={{ duration: 200 }}
                                    label="Here you can upload your own dataset so you can explore and analyze it.
                                For more information about how you should prepare your dataset, check the Help section.">
                                    <InfoCircle size={15} />
                                </Tooltip>
                            </span>
                        </Modal.Title>
                        <Modal.CloseButton />
                        <Divider my="md" />
                    </Modal.Header>
                    <Modal.Body>
                        <Flex direction="column" gap="md">
                            <Box style={{ border: '2px dashed black', padding: '10px', marginTop: "20px" }}>
                                <Flex direction="column" justify="center" align="center" gap="md">
                                    <FileButton onChange={setFile} accept=".zip">
                                        {(props) => <Button {...props} radius="xl" variant="light"><UploadArrowTray size={18} /></Button>}
                                    </FileButton>
                                    <Text size="sm" c="dimmed">Drag and drop a .zip file here, or click to select</Text>
                                </Flex>
                            </Box>
                            <TextInput
                                label="Name"
                                placeholder="Specify the name of the Dataset"
                                required={true}
                            />
                            <TextInput
                                label="Task"
                                placeholder="Specify the task of the Dataset"
                                required={true}
                            />
                        </Flex>
                    </Modal.Body>
                </Modal.Content>
            </Modal.Root>





        </>
    )
}