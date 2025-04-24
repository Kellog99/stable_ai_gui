import { useForm } from "@mantine/form";
import useStore from '../../../../store/dsStore';
import { useState } from "react";
import { Box, Button, Flex, Slider, Text } from "@mantine/core";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import
{
    faCheck
} from '@fortawesome/free-solid-svg-icons';


export default function MahalanobisConfig ()
{
    const form = useForm( {
        mode: 'uncontrolled',
        initialValues: {
            threshold_percentile: 97.5,
        },
    } );


    const [ clicked, setClicked] = useState(false)
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
        <form onSubmit={ form.onSubmit( handleSubmit ) }>
            <Box style={ { margin: "10px" } }>
                <Flex
                    direction="column"
                    gap="xs">
                    <Text size="sm" style={ { marginBottom: 0 } }>Threshold</Text>
                    <Slider
                        size="sm"
                        defaultValue={ 97.5 }
                        min={ 0 }
                        max={ 100 }
                        marks={ [
                            { value: 0, label: '0' },
                            { value: 100, label: '100' },
                        ] }
                        { ...form.getInputProps( 'threshold_percentile' ) }
                    />
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