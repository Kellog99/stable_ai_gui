import { Box, Code, Divider, Group, Modal, Table, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { InfoIcon } from "lucide-react";


export function ModalUploadDataset() {
    const [opened, { toggle }] = useDisclosure(false);

    const jsonFields = [
        {
            field: "name",
            type: "string",
            description: "Name of the dataset."
        },
        {
            field: "description",
            type: "string",
            description: "A short description of the dataset."
        },
        {
            field: "num_classes",
            type: "number",
            description: "The total number of classes in the dataset (applicable for classification tasks)."
        },
        {
            field: "subset",
            type: "number",
            description: "Optional: Number of samples to use from the full dataset for testing or quick experiments."
        },
        {
            field: "batch",
            type: "number",
            description: "Batch size to be used during training or inference."
        },
        {
            field: "type_dataset",
            type: "number",
            description: "To define..."
        },
        {
            field: "type",
            type: "string",
            description: (<>The type of the main feature of the dataset, e.g. <Code>image</Code>, <Code>text</Code>, etc.</>)
        },
        {
            field: "mode",
            type: "string",
            description: (<>The task mode of the dataset, e.g., <Code>classification</Code>, <Code>object detection</Code> or <Code>single feature</Code>.</>)
        },
        {
            field: "num_workers",
            type: "number",
            description: "Number of worker threads to use for data loading."
        },
        {
            field: "source_path",
            type: "string",
            description: "to define"
        },
        {
            field: "transform_config",
            type: "object",
            description: "Configuration object for data transformations and preprocessing.",
            properties: [
                {
                    field: "size",
                    type: "number",
                    description: "Target size to which images will be resized."
                },
                {
                    field: "crop",
                    type: "number",
                    description: "Size of the crop to be applied after resizing."
                },
                {
                    field: "transform_id",
                    type: "string",
                    description: "Identifier for a predefined transformation pipeline, e.g., 'imagenet_like_crop'."
                },
                {
                    field: "mean",
                    type: "array",
                    description: "Mean values for each channel used in normalization."
                },
                {
                    field: "std",
                    type: "array",
                    description: "Standard deviation values for each channel used in normalization."
                }
            ]
        }
    ];


    const rows = jsonFields.map((element) => (
        <Table.Tr key={element.field}>
            <Table.Td>{element.field}</Table.Td>
            <Table.Td c="blue" fw={500} ff="monospace">
                {element.type}
            </Table.Td>
            <Table.Td>{element.description}</Table.Td>
        </Table.Tr>
    ));

    const jsonExample = `{
    "name": "animals",
    "description":"Animals!",
    "num_classes": 90,
    "subset": 20,
    "batch": 2,
    "type_dataset": 2,
    "type":"image",
    "mode":"classification",
    "num_workers": 0,
    "source_path": "C:/.../datasets/animals/data",
    "transform_config": {
        "size": 256,
        "crop": 224,
        "transform_id": "imagenet_like_crop",
        "mean": [
            0.5074,
            0.5308,
            0.5306
        ],
        "std": [
            0.2639,
            0.2518,
            0.2521
        ]
    }
}`

    return (
        <>
            <Box style={{
                padding: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                width: '100%',
                cursor: 'pointer'
            }}
                onClick={toggle}

            >
                <Group justify='space-between' >
                    <Group justify='flex-start'>
                        <InfoIcon size={12} />
                        <Text size="0.6vw" c="var(--mantine-color-gray-7)">Info about the zip to upload</Text>
                    </Group>
                </Group>

                <Modal opened={opened} onClose={toggle} title="Upload Information" size="lg" >
                    <Divider my="xs" color="var(--mantine-color-gray-7)" />
                    <div
                        style={{
                            fontSize: "0.875rem", // Mantine "sm" ≈ 14px
                            color: "var(--mantine-color-gray-7)",
                            marginBottom: "8px",
                        }}
                    >
                    The zip you are going to upload must contain the raw data files and a json config file. In particular the following scaffolding must be followed:
                    <div style={{ fontFamily: "monospace", fontSize: "14px", lineHeight: "20px", marginTop: "8px", marginBottom: "8px", backgroundColor: "var(--mantine-color-gray-0)", padding: "8px", borderRadius: "4px" }}>
                        <div>datasetName.zip</div>
                        <div style={{ marginLeft: "20px" }}>|__ data</div>
                        <div style={{ marginLeft: "20px" }}>|__ datasetName.json</div>
                    </div>

                    The json config file must contain the following fields:
                </div>
                <Table>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Field</Table.Th>
                            <Table.Th>Type</Table.Th>
                            <Table.Th>Description</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{rows}</Table.Tbody>
                </Table>
                <Text size="sm" c="var(--mantine-color-gray-7)" m="8px">An example of json file is the following:</Text>
                <Code color="var(--mantine-color-gray-8)" c="white" block>
                    {jsonExample}
                </Code>
            </Modal>
        </Box >
        </>
    )
}