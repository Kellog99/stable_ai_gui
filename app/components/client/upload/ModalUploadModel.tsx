import { Box, Code, Divider, Group, Modal, Table, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { InfoIcon } from "lucide-react";



export function ModalUploadModel ()
{
    const [ opened, { toggle } ] = useDisclosure( false );
    
    const jsonFields = [
        {
            field: "name",
            type: "string",
            description: 'The name of the model. This field in mandatory.'
        },
        {
            field: "ecc",
            type: "string",
            description: "Specify if you want"
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
    "name": "resnet50",
    "ecc": "bla bla",
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
                        The zip you are going to upload must contain the <Code>.pth</Code> file and a json config file. In particular the following scaffolding must be followed:
                        <div style={{ fontFamily: "monospace", fontSize: "14px", lineHeight: "20px", marginTop: "8px", marginBottom: "8px", backgroundColor: "var(--mantine-color-gray-0)", padding: "8px", borderRadius: "4px" }}>
                            <div>modelName.zip</div>
                            <div style={{ marginLeft: "20px" }}>|__ model.pth</div>
                            <div style={{ marginLeft: "20px" }}>|__ modelName.json</div>
                        </div>

                        The json config file must contain the following fields:
                    </Text>
                    <Table>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Name</Table.Th>
                                <Table.Th>Ecc</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>{ rows }</Table.Tbody>
                    </Table>
                    <Text size="sm" c="var(--mantine-color-gray-7)" m="8px">An example of json file is the following:</Text>
                    <Code color="var(--mantine-color-gray-8)" c="white" block>
                        { jsonExample }
                    </Code>
                </Modal>
            </Box>
        </>
    )
}