import { Code, Divider, Modal, Table, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { InfoIcon } from "lucide-react";
import { InfoUploader } from "@/interfaces/homePageInterface";
import "./InfoLoader.css"
interface InfoLoaderProps {
    config: InfoUploader
}
export const InfoLoader: React.FC<InfoLoaderProps> = ({
    config
}) => {
    const [opened, { toggle }] = useDisclosure(false);
    return (
        <>
            <button className="info-container" onClick={toggle}>
                <InfoIcon size={"calc(var(--icon-size) / 2)"} />
            </button >
            <Modal opened={opened} onClose={toggle} size="lg" color="black" >
                <h2 style={{ color: "black", margin: 0, marginTop: "-10px" }}>Input Information</h2>
                <Divider my="xs" />
                <div
                    style={{
                        fontSize: "0.875rem", // Mantine "sm" ≈ 14px
                        color: "var(--mantine-color-gray-7)",
                        marginBottom: "8px",
                    }}
                >
                    {config.description}.
                    In particular the following scaffolding must be followed:
                    <Code color="var(--mantine-color-gray-8)" c="white" block>
                        {Object.entries(config.scaffholding).map(([folderName, files]) => (
                            <div key={folderName}>
                                <div>{folderName}</div>
                                <div style={{ borderLeft: "1px solid gray", paddingTop: "4px" }}>
                                    {files.map((file) => (
                                        <div key={file}>
                                            _ {file}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </Code>


                    The json config file must contain the following fields:
                </div>
                <Table>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Name</Table.Th>
                            <Table.Th>Ecc</Table.Th>
                            <Table.Th>Description</Table.Th>
                        </Table.Tr>
                    </Table.Thead>

                    <Table.Tbody>
                        {config.fields.map((element) => (
                            <Table.Tr key={element.field}>
                                <Table.Td>{element.field}</Table.Td>
                                <Table.Td c="blue" fw={500} ff="monospace">
                                    {element.type}
                                </Table.Td>
                                <Table.Td dangerouslySetInnerHTML={{ __html: element.description }} />
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>

                <Text size="sm" c="var(--mantine-color-gray-7)" m="8px">An example of json file is the following:</Text>
                <Code color="var(--mantine-color-gray-8)" c="white" block>
                    {JSON.stringify(config.example, null, 2)}
                </Code>
            </Modal >

        </>
    )
}