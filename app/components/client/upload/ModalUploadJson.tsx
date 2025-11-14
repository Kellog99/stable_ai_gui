import { Box, Code, Divider, Group, Modal, Table, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { InfoIcon } from "lucide-react";



export function ModalUploadJson() {
    const [opened, { toggle }] = useDisclosure(false);

    const jsonFields = [
        {
            field: "dataset",
            type: "Dataset",
            description: 'The dataset DTO containing the information about the dataset'
        },
        {
            field: "tool",
            type: "string",
            description: (<>Specify the tool the report belongs to, E.g., <Code>dq</Code> for data quality reports and <Code>nntrust</Code> for TITANN reports.</>)
        },
        {
            field: "metrics",
            type: "Object",
            description: "The metrics object containing the various metrics computed for the dataset."
        }];

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
  "dataset": {
    "name": "animals",
    "n_samples": 5400,
    "task": "classification"
    // ... etc
  },
  "tool": "dq",
  "metrics": [
    {
      "internalConfigs": {},
      "results": {
        "name": "uniqueness",
        "featureName": "image",
        "score": 0.9927777777777778,
        "indexes": [
          39,
          2,
          2,
          2,
          2,
          2,
          2,
          2
          // ... continues
        ]
      }
    }
  ]
}
`

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
                        <Text size="0.6vw" c="var(--mantine-color-gray-7)">Info about the json to upload</Text>
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
                        The json config file must contain the following fields:
                    </div>
                    <Table>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Name</Table.Th>
                                <Table.Th>Type</Table.Th>
                                <Table.Th>Description</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>{rows}</Table.Tbody>
                    </Table>
                    <Text size="sm" c="var(--mantine-color-gray-7)" m="8px">An example of json file for a data quality report is the following:</Text>
                    <Code color="var(--mantine-color-gray-8)" c="white" block>
                        {jsonExample}
                    </Code>
                </Modal>
            </Box>
        </>
    )
}