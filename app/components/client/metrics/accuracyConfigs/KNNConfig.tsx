import { useForm } from "@mantine/form";
import useStore from '@/store/dsStore';
import { useState } from "react";
import { Box, Button, Center, Flex, NumberInput, Slider, Text } from "@mantine/core";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faCheck
} from '@fortawesome/free-solid-svg-icons';


export default function KNNConfig() {
    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            contamination: 0.1,
            k: 6
        },
    });


    const [clicked, setClicked] = useState(false)
    const setInternalConfigs = useStore((state) => state.setInternalConfigs)


    const handleSubmit = (formValues: any) => {
        setClicked(true)
        setInternalConfigs(formValues);
        setTimeout(() => {
            setClicked(false);
        }, 3000);
    }



    return (
        <form onSubmit={form.onSubmit(handleSubmit)}>
            <Box style={{ margin: "10px" }}>
                <Flex
                    direction="column"
                    gap="xl"
                >

                    <NumberInput
                        variant="filled"
                        label="Number of neighbours"
                        defaultValue={5}
                        {...form.getInputProps('k')}
                        styles={{
                            label:{
                                color:"#374151"
                            }
                        }}
                    />

                    <Flex
                        direction="column"
                        gap="xs">
                        <Text size="sm" c="#374151" style={{ marginBottom: 0 }}>Contamination</Text>
                        <Slider
                            size="sm"
                            defaultValue={0.1}
                            min={0}
                            max={1}
                            step={0.01}
                            color="#e5e7eb"
                            marks={[
                                { value: 0, label: '0' },
                                { value: 1, label: '1' },
                            ]}
                            {...form.getInputProps('contamination')}
                        />
                    </Flex>


                </Flex>
            </Box>
            <Center>
                <Button type="submit" mt="md" color="#3b82f6">
                    {clicked ? (<>
                        <FontAwesomeIcon icon={faCheck} style={{ marginRight: 8 }} />
                        <span>Configs modified</span></>)
                        : "Modify"}
                </Button>
            </Center>
        </form >)
}