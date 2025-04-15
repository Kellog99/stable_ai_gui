"use client";

import { Button, Flex, Modal, Select } from "@mantine/core";
import { useEffect, useState } from "react";
import useStore from '../../../store/dsStore';
import { image_type, label_type, text_type } from "@/properties/types";
import { useDisclosure } from "@mantine/hooks";

interface ConfigsProps
{
    labelFeatureReq?: boolean
}


export default function Config ( props: ConfigsProps )
{
    const [ features, setFeatures ] = useState<string[]>( [] )
    const [ labelFeatures, setLabelFeatures ] = useState<string[]>( [] )

    const [ featureName, setFeatureName ] = useState<any>( "" )
    const [ labelFeatureName, setLabelFeatureName ] = useState<string>( "" )

    const [ opened, { open, close } ] = useDisclosure( false );


    const datasetUsed = useStore( ( state ) => state.datasetUsed )

    useEffect( () =>
    {
        if ( Array.isArray( datasetUsed?.features ) ) {
            const extractedFeatures = datasetUsed.features
                .filter( ( { type } ) => type === image_type || type === text_type )
                .map( ( { name } ) => name );

            setFeatures( extractedFeatures );

            if ( props?.labelFeatureReq === true ) {
                const extractedlabelFeatures = datasetUsed.features
                    .filter( ( { type } ) => type === label_type )
                    .map( ( { name } ) => name );

                setLabelFeatures( extractedlabelFeatures )
            }
        }
    }, [ datasetUsed ] )

    return (
        <div>
            <Flex
                direction="row"
                align="end"
                gap="md">

                <Select
                    id="feature"
                    radius="md"
                    label="Feature"
                    placeholder="Choose feature to visualize"
                    data={ features }
                    value={ featureName }
                    onChange={ ( value ) => setFeatureName( value ) }
                    required={ true }
                />

                {props?.labelFeatureReq ? (<Select
                    id="labelFeature"
                    radius="md"
                    label="Label Feature"
                    placeholder="Choose label"
                    data={ labelFeatures }
                    value={ labelFeatureName }
                    onChange={ ( value ) => setLabelFeatureName( value as string ) }
                    required={ true }
                />): null}
                
                <Modal opened={ opened } onClose={ close } title="Configurations">
                    <p>Hey</p>
                </Modal>
                <Button variant="default" onClick={ open } radius="md">
                    Configs
                </Button>
            </Flex>

            <Flex
                direction="row"
                justify="end"
                gap="md">
                <Button>
                    Add to report
                </Button>
                <Button>
                    Compute Now
                </Button>
            </Flex>
        </div >
    )
}