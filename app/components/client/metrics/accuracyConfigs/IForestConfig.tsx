import { useForm } from "@mantine/form";
import useStore from '../../../../store/dsStore';
import { useState } from "react";
import { Box, Button, Flex, NumberInput, Slider, Switch, Text } from "@mantine/core";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import
{
    faCheck
} from '@fortawesome/free-solid-svg-icons';

export default function IForestConfig ()
{

    const form = useForm( {
        mode: 'uncontrolled',
        initialValues: {
            //n_estimators: 100,
            //max_samples: "auto",
            contamination: 0.1,
            //max_features: 1,
            //bootstrap: false,
            //n_jobs: 1,
            //n_iterations: null,
            //random_state: null
        },
    } );

    const setInternalConfigs = useStore( ( state ) => state.setInternalConfigs )
    const [ clicked, setClicked ] = useState( false )
    const [ showMaxSamples, setShowMaxSamples ] = useState( false )


    const handleSubmit = ( formValues: any ) =>
    {
        setInternalConfigs( formValues );
        setClicked( true )
        setTimeout(() => {
            setClicked(false);
          }, 3000);
    }



    return (
        <form onSubmit={ form.onSubmit( handleSubmit ) }>
            <Box style={ { margin: "10px" } }>
            <Flex
                direction="column"
                gap="xl"
            >
                {/*
                <NumberInput
                    variant="filled"
                    label="Number of estimators"
                    defaultValue={ 100 }
                    { ...form.getInputProps( 'n_estimators' ) }
                />

                <Flex direction="column" gap="xs">
                    <Text size="sm" style={ { marginBottom: 0 } }>Max Samples</Text>

                    <Switch
                        checked={ !showMaxSamples }
                        label="auto"
                        onChange={ ( event ) => setShowMaxSamples( !event.currentTarget.checked ) }
                    />

                    { showMaxSamples && (
                        <NumberInput
                            variant="filled"
                            defaultValue={ 100 }
                            { ...form.getInputProps( 'max_samples' ) }
                        />
                    ) }
                </Flex>
*/}
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

{/*
                <Flex
                    direction="column"
                    gap="xs">
                    <Text size="sm" style={ { marginBottom: 0 } }>Max features</Text>
                    <Slider
                        size="sm"
                        defaultValue={ 1 }
                        { ...form.getInputProps( 'max_features' ) }
                    />
                </Flex>

                <Switch
                    label="bootstrap"
                    { ...form.getInputProps( 'bootstrap' ) }
                />

                <NumberInput
                    variant="filled"
                    label="Number of jobs"
                    defaultValue={ 1 }
                    { ...form.getInputProps( 'n_jobs' ) }
                />

                <NumberInput
                    variant="filled"
                    label="Number of iterations"
                    defaultValue={ 0 }
                    { ...form.getInputProps( 'n_iterations' ) }
                />

                <NumberInput
                    variant="filled"
                    label="Random state"
                    defaultValue={ 0 }
                    { ...form.getInputProps( 'random_state' ) }
                />
 */}
            </Flex>
            </Box>
           
            
            <Button type="submit" mt="md">
                { clicked ? ( <>
                    <FontAwesomeIcon icon={ faCheck } style={ { marginRight: 8 } } />
                    <span>Configs modified</span></> )
                    : "Modify" }
            </Button>
        </form > )
}