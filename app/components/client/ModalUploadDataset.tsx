import { Box, Code, Divider, Group, Modal, Table, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { InfoIcon } from "lucide-react";



export function ModalUploadDataset ()
{
    const [ opened, { toggle } ] = useDisclosure( false );
    
    const jsonFields = [
        {
            field: "arrow",
            type: "boolean",
            description: 'If the arrow file, containing an already injested dataset. This is the only mandatory field in any case.'
        },
        {
            field: "task",
            type: "string",
            description: ( <>This field must be specified only in the case the arrow file is not supplied and so an injestion must be done. This field specifies the task of the dataset and can be one of <Code>["classification", "single feature", "object detection"]</Code>.</> )
        },
        {
            field: "type",
            type: "string",
            description: ( <>This field must be specified only in the case the arrow file is not supplied and so an injestion must be done. This field specifies the type of the main feature of the dataset, for example <Code>image</Code> or <Code>text</Code>.</> )
        },
        {
            field: "description",
            type: "string",
            description: 'Optionally you can add a custom description of your dataset.'
        },
        {
            field: "label_dict",
            type: "object",
            description: 'Optionally you can add the map from the numerical labels to the explicit labels.'
        },
    ];

    const rows = jsonFields.map( ( element ) => (
        <Table.Tr key={ element.field }>
            <Table.Td>{ element.field }</Table.Td>
            <Table.Td c="blue" fw={ 500 } ff="monospace">
                { element.type }
            </Table.Td>
            <Table.Td>{ element.description }</Table.Td>
        </Table.Tr>
    ) );

    const jsonExample = `{
    "arrow": false,
    "task": "classification",
    "type": "image",
    "description": "This is a dataset of animals for classification.",
    "label_dict": {
        "0": "antelope",
        "1": "badger"
    }
}`

    return (
        <>
            <Box style={ {
                padding: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                width: '100%',
                cursor: 'pointer'
            } }
                onClick={ toggle }

            >
                <Group justify='space-between' >
                    <Group justify='flex-start'>
                        <InfoIcon size={ 12 } />
                        <Text size="0.6vw" c="var(--mantine-color-gray-7)">Info about the zip to upload</Text>
                    </Group>
                </Group>

                <Modal opened={ opened } onClose={ toggle } title="Upload Information" size="lg" >
                    <Divider my="xs" color="var(--mantine-color-gray-7)" />
                    <Text size="sm" c="var(--mantine-color-gray-7)" mb="8px">
                        The zip you are going to upload must contain the raw data files and a json config file, optionally it could contain the pre-injested arrow file.
                        The json config file must contain the following fields:
                    </Text>
                    <Table>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Field</Table.Th>
                                <Table.Th>Type</Table.Th>
                                <Table.Th>Description</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>{ rows }</Table.Tbody>
                    </Table>
                    <Text size="sm" c="var(--mantine-color-gray-7)" m="8px">An example of json file is the following:</Text>
                    <Code color="var(--mantine-color-gray-8)" c="white" block>
                        { jsonExample }
                    </Code>
                    <Text size="sm" c="var(--mantine-color-gray-7)" m="8px">
                        Additionaly, note that the dataset you are about to load will have the name of zip folder.
                    </Text>
                </Modal>
            </Box>
        </>
    )
}