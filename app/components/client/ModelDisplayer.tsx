import useStore from "@/store/nnTrustStore";
import { Card, Divider, Group, Stack, Text, ThemeIcon } from "@mantine/core";
import { Brain, Hash } from "lucide-react";

interface ModelDisplayerProps {
    modelName: string
}




export default function ModelDisplayer(props: ModelDisplayerProps) {
    const models = useStore((state) => state.models)
    console.log("MODELS LOADED", models)
    return (
        <>
        
       <Text>you made it </Text>
        {/*
            <Card shadow="sm" padding="lg" radius="md" withBorder style={{ backgroundColor: '#f8f9fa' }}>
                <Card.Section>
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: "8px",
                        padding: "12px 16px"
                    }}>
                        <Brain size={20} color="#228be6" strokeWidth={2} />
                        <Text fw={600} c="blue" size="lg"> {props.modelName} </Text>
                    </div>
                    <Divider />
                </Card.Section>
                <Stack gap="xs" mt="md">
                    <Group gap="xs">
                        <Hash size={18} style={{ color: '#868e96' }} />
                        <Text c="dimmed" size="sm"> Task: classification</Text>
                    </Group>
                    <Group gap="xs">
                        <Hash size={18} style={{ color: '#868e96' }} />
                        <Text c="dimmed" size="sm"> Num classes: 1000</Text>
                    </Group>
                </Stack>
            </Card>
            */}
        </>
    )
}