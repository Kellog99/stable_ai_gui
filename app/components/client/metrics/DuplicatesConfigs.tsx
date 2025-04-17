"use client";

import { useState } from 'react';
import { Button, Flex, NativeSelect, NumberInput, Slider, Switch, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import useStore from '../../../store/dsStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import
{
    faCheck
} from '@fortawesome/free-solid-svg-icons';




export default function DuplicatesConfigs ()
{

    const form = useForm( {
        mode: 'uncontrolled',
        initialValues: {
            k: 6,
            thr: 0.05,
            backend: 'Faiss',
            metric: 'Euclidean',
            normalize: true
        },
    } );

    const setInternalConfigs = useStore( ( state ) => state.setInternalConfigs )
    const [ clicked, setClicked ] = useState( false )
    
    console.log("CLICKED?", clicked)
    

    const handleSubmit = ( formValues: any) =>
    {   
        setInternalConfigs( formValues );
        console.log( "FORM VALUES:", formValues )
    }



    return (
        <form onSubmit={ form.onSubmit(handleSubmit) }>
            <Flex
                direction="column"
                gap="xl"
            >
                <NumberInput
                    variant="filled"
                    label="Number of neighbours"
                    defaultValue={ 6 }
                    { ...form.getInputProps( 'k' ) }
                />
                <Flex
                    direction="column"
                    gap="xs">
                    <Text size="sm" style={ { marginBottom: 0 } }>Threshold</Text>

                    <Slider
                        size="sm"
                        defaultValue={ 0.05 }
                        min={ 0 }
                        max={ 1 }
                        step={ 0.01 }
                        marks={ [
                            { value: 0, label: '0' },
                            { value: 1, label: '1' },
                        ] }
                        { ...form.getInputProps( 'thr' ) }
                    />
                </Flex>

                <NativeSelect variant="filled" radius="md" label="Backend" data={ [ 'Faiss', 'Scikit' ] } { ...form.getInputProps( 'backend' ) } />
                <NativeSelect variant="filled" radius="md" label="Metric" data={ [ 'Euclidean', 'Cosine' ] } { ...form.getInputProps( 'metric' ) } />

                <Switch
                    defaultChecked
                    label="Normalize Embeddings"
                    { ...form.getInputProps( 'normalize' ) }
                />
            </Flex>

            <Button type="submit" mt="md" onClick={(() => setClicked(true))}>
                { clicked ? ( <>
                    <FontAwesomeIcon icon={ faCheck } style={ { marginRight: 8 } } />
                    <span>Configs modified</span></> )
                    : "Modify" }
            </Button>

        </form>
    );
}

