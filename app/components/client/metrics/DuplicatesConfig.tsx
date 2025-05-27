"use client";

import { useState } from 'react';
import { Box, Button, Flex, NumberInput, Slider,  Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import useStore from '../../../store/dsStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import
{
    faCheck
} from '@fortawesome/free-solid-svg-icons';
import React from 'react';





function DuplicatesConfig ()
{

    const form = useForm( {
        mode: 'uncontrolled',
        initialValues: {
            k: 6,
            thr: 0.05,
            //backend: 'faiss',
            //metric: 'euclidean',
            //normalize: true
        },
    } );

    
    const [ clicked, setClicked ] = useState( false )
    
    const setInternalConfigs = useStore( ( state ) => state.setInternalConfigs )
    
    const handleSubmit = ( formValues: any) =>
    {   
        setClicked(true)
        setInternalConfigs( formValues );
        setTimeout(() => {
            setClicked(false);
          }, 3000);
        
    }


    return (
        <form onSubmit={ form.onSubmit(handleSubmit) }>
            <Box style={ { margin: "10px" } }>
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
               
            {/*
                <NativeSelect variant="filled" radius="md" label="Backend" data={backend_duplicates} { ...form.getInputProps( 'backend' ) } />
                <NativeSelect variant="filled" radius="md" label="Metric" data={metric_duplicates} { ...form.getInputProps( 'metric' ) } />

                <Switch
                    defaultChecked
                    label="Normalize Embeddings"
                    { ...form.getInputProps( 'normalize' ) }
                />
            */}
            </Flex> 
            </Box>

            <Button type="submit" mt="md" >
                { clicked ? ( <>
                    <FontAwesomeIcon icon={ faCheck } style={ { marginRight: 8 } } />
                    <span>Configs modified</span></> )
                    : "Modify" }
            </Button>

        </form>
    );
}

export default React.memo(DuplicatesConfig);

