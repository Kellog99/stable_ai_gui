import { useForm } from "@mantine/form";
import useStore from '../../../../store/dsStore';
import { useState } from "react";
import { Box, Button, Flex, NumberInput, Select, Slider, Switch, Text } from "@mantine/core";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import
{
    faCheck
} from '@fortawesome/free-solid-svg-icons';
import { model_type_LUNAR, negative_sampling_LUNAR } from "../utils";

export default function IForestConfig ()
{

    const form = useForm( {
        mode: 'uncontrolled',
        initialValues: {
            model_type: "WEIGHT",
            n_neighbours: 5,
            negative_sampling: "MIXED",
            val_size: 0.1,
            epsilon: 0.1,
            proportion: 1,
            n_epochs: 200,
            lr: 0.001,
            wd: 0.1,
            contamination: 0.1


        },
    } );

    const setInternalConfigs = useStore( ( state ) => state.setInternalConfigs )
    const [ clicked, setClicked ] = useState( false )
    const [ showMaxSamples, setShowMaxSamples ] = useState( false )


    const handleSubmit = ( formValues: any ) =>
    {
        setInternalConfigs( formValues );
        setClicked( true )
        setTimeout( () =>
        {
            setClicked( false );
        }, 3000 );
    }



    return (
        <form onSubmit={ form.onSubmit( handleSubmit ) }>
            <Flex
                direction="column"
                gap="xl"
            >
                <Select
                    id="modelType"
                    radius="md"
                    label="Model Type"
                    defaultValue="WEIGHT"
                    data={ model_type_LUNAR }
                    { ...form.getInputProps( 'model_type' ) }

                />
                <NumberInput
                    variant="filled"
                    label="Number of neighbours"
                    defaultValue={ 5 }
                    { ...form.getInputProps( 'n_neighbours' ) }
                />

                <Select
                    id="negativeSampling"
                    radius="md"
                    label="Negative sampling"
                    defaultValue="MIXED"
                    data={ negative_sampling_LUNAR }
                    { ...form.getInputProps( 'negative_sampling' ) }

                />

                <Flex
                    direction="column"
                    gap="xs">
                    <Text size="sm" style={ { marginBottom: 0 } }>Validation Size</Text>
                    <Slider
                        size="sm"
                        defaultValue={ 0.1 }
                        min={ 0 }
                        max={ 1 }
                        step={ 0.01 }
                        marks={ [
                            { value: 0, label: '0' },
                            { value: 1, label: '1' },
                        ] }
                        { ...form.getInputProps( 'val_size' ) }
                    />
                </Flex>

                <NumberInput
                    variant="filled"
                    label="Epsilon"
                    defaultValue={ 0.1 }
                    { ...form.getInputProps( 'epsilon' ) }
                />

                <NumberInput
                    variant="filled"
                    label="Proportion"
                    defaultValue={ 1 }
                    { ...form.getInputProps( 'proportion' ) }
                />

                <NumberInput
                    variant="filled"
                    label="Number of epochs"
                    defaultValue={ 200 }
                    { ...form.getInputProps( 'n_epochs' ) }
                />

                <NumberInput
                    variant="filled"
                    label="Learning rate"
                    defaultValue={ 0.001 }
                    { ...form.getInputProps( 'lr' ) }
                />

                <NumberInput
                    variant="filled"
                    label="Weight decay"
                    defaultValue={ 0.1 }
                    { ...form.getInputProps( 'wd' ) }
                />

                <Flex
                    direction="column"
                    gap="xs">
                    <Text size="sm" style={ { marginBottom: 0 } }>Contamination</Text>
                    <Slider
                        size="sm"
                        defaultValue={ 0.1 }
                        min={ 0 }
                        max={ 1 }
                        step={ 0.01 }
                        marks={ [
                            { value: 0, label: '0' },
                            { value: 1, label: '1' },
                        ] }
                        { ...form.getInputProps( 'contamination' ) }
                    />
                </Flex>

            </Flex>
            <Button type="submit" mt="md">
                { clicked ? ( <>
                    <FontAwesomeIcon icon={ faCheck } style={ { marginRight: 8 } } />
                    <span>Configs modified</span></> )
                    : "Modify" }
            </Button>
        </form > )
}