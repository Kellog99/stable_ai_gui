"use client";

import FeatureDisplayer from "@/components/client/FeatureDisplayer";
import { getPrototypes } from "@/functionalities/BackendUtils";
import { IsFeatureBond, IsFeatureSameLength } from "@/functionalities/Utils";
import Dataset, { PrototypesInt } from "@/interfaces/genericInterface";
import { image_type, label_type, text_type } from "@/properties/types";
import { Button, Flex, Loader, Select, Text } from "@mantine/core";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import useStore from '../../../store/dsStore';
import featureLoader from "@/functionalities/FeatureLoader";



export default function Prototypes() {
    const searchParams = useSearchParams();
    const containerRef = useRef<HTMLDivElement>(null);

    const [datasetName, setDatasetName] = useState<string | null>("")
    const [features, setFeatures] = useState<string[]>([])
    const [labelFeatures, setLabelFeatures] = useState<string[]>([])
    const [featureName, setFeatureName] = useState<any>("")
    const [labelFeatureName, setLabelFeatureName] = useState<string>("")

    const [prototypes, setPrototypes] = useState<PrototypesInt | null>(null)
    const labelDict = useStore((state) => state.labelDict)
    const setLabelDict = useStore((state) => state.setLabelDict)
    //const [labelDict, setLabelDict] = useState<{ [key: number]: string } | null>(null)

    const featureData = useStore((state) => state.prototypesData)
    const setFeatureData = useStore((state) => state.setPrototypesData)

    const [featureType, setFeatureType] = useState<any>("")

    const labelData = useStore((state) => state.labelProtoData)
    const setLabelData = useStore((state) => state.setLabelProtoData)

    const [isLoading, setIsLoading] = useState<boolean>(false)

    const datasetUsed = useStore((state) => state.datasetUsed)

    useEffect(() => {
        if (searchParams.get("datasetName")) {
            setDatasetName(searchParams.get("datasetName"))
        }
    }, [searchParams])


    useEffect(() => {
        if (Array.isArray(datasetUsed?.features)) {
            const extractedFeatures = datasetUsed.features
                .filter(({ type }) => type === image_type || type === text_type)
                .map(({ name }) => name);

            //const extractedlabelFeatures = datasetUsed.features
            //    .filter( ( { type } ) => type === label_type )
            //    .map( ( { name } ) => name );

            if (featureName !== "") {
                const load_labels = async () => {
                    const feature = await featureLoader(datasetUsed.name, featureName)
                    const lb_feature = await IsFeatureSameLength(datasetUsed as Dataset, feature.datas.length);
                    setLabelFeatures(lb_feature as string[])
                };
                load_labels()


                //const labelFeatures = IsFeatureBond( datasetUsed as Dataset, featureName, label_type )
                //setLabelFeatures( labelFeatures as string[] )
                const labelFeature = datasetUsed.features.find(feature => feature.type === label_type);
                if (labelFeature?.label_dict) {
                    setLabelDict(labelFeature.label_dict)
                }

            }

            setFeatures(extractedFeatures);
            //setLabelFeatures( extractedlabelFeatures )


        }
    }, [datasetUsed, featureName])


    const handleClick = async () => {
        setIsLoading(true);
        try {
            if (labelFeatureName) {
                const fetchedData = await getPrototypes(datasetName as string, featureName, labelFeatureName);
                setPrototypes(fetchedData);
            }
            else {
                const fetchedData = await getPrototypes(datasetName as string, featureName);
                setPrototypes(fetchedData);
            }
        } finally {
            setIsLoading(false);
        }
    };

    {/*
    useEffect(() => {
        if (featureName) {
            setIsLoading(true);
            getPrototypes(datasetName as string, featureName, labelFeatureName)
                .then(fetchedData => {
                    setPrototypes(fetchedData);

                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [featureName, labelFeatureName]);
    */}

    useEffect(() => {
        if (prototypes) {
            setFeatureType(prototypes.type);
            const data = prototypes.datas.map(({ data }) => data);
            const labelData = prototypes.datas.map(({ label_data }) => label_data);
            setFeatureData(data)
            setLabelData(labelData)
        }

    }, [prototypes])


    return (
        <div className="w-full h-screen">
            <div style={{
                marginTop: "50px",
                marginLeft: "100px",
                marginRight: "100px",
            }}>

                <div style={{ width: '300px', position: 'relative', marginBottom: '20px' }}>
                    <Flex
                        direction="row"
                        gap="xs">

                        <Select
                            id="feature"
                            radius="md"
                            label="Feature"
                            placeholder="Choose feature to visualize"
                            data={features}
                            value={featureName}
                            onChange={(value) => setFeatureName(value)}
                            required={true}
                        />

                        {datasetUsed?.task != "single_feature" ? (
                            <Select
                                id="labelFeature"
                                radius="md"
                                label="Label Feature"
                                placeholder="Choose label"
                                data={labelFeatures}
                                value={labelFeatureName}
                                onChange={(value) => setLabelFeatureName(value as string)}
                                required={true}
                            />) : null}

                    </Flex>

                    <Button mt="md" size="sm"
                        onClick={handleClick}
                        disabled={
                            (datasetUsed?.task === "single_feature" && !featureName) ||
                            (datasetUsed?.task !== "single_feature" && (!featureName || !labelFeatureName))
                        }
                    >
                        Get Prototypes
                    </Button>
                </div>
                {isLoading ? (
                    <>
                        <Flex
                            mih={150}
                            justify="center"
                            align="center"
                            direction="column"
                            wrap="wrap"
                            style={{ width: '100%' }}
                        >
                            <p>Loading...</p>
                            <Loader />
                        </Flex>
                    </>
                ) : (<>
                    {prototypes && featureData && labelData ? (
                        <>
                            <Flex
                                mih={150}
                                justify="center"
                                align="center"
                                direction="column"
                                wrap="wrap"
                                style={{ width: '100%' }}
                            >
                                <div ref={containerRef} className="h-[600px] overflow-auto">
                                    <FeatureDisplayer featureData={featureData} featureType={featureType} labelData={labelData} label_dict={labelDict as { [key: number]: string }} columns={4} />
                                </div>
                            </Flex>

                        </>
                    ) : (datasetUsed?.task == "single_feature" ? 
                        (<Text size="xs">Select Feature</Text>) :
                        (<Text size="xs">Select Feature and Label</Text>)
                    )}
                </>)}

            </div>
        </div>
    )
}