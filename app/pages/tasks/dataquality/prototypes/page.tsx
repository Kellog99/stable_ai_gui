"use client";

import FeatureDisplayer from "@/components/client/FeatureDisplayer";
import { getPrototypes } from "@/functionalities/BackendUtils";
import { IsFeatureSameLength } from "@/functionalities/Utils";
import Dataset, { PrototypesInt } from "@/interfaces/genericInterface";
import { image_type, label_type, text_type } from "@/properties/types";
import { Button, Center, Flex, Loader, Select, Text, Box } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import featureLoader from "@/functionalities/FeatureLoader";
import classes from './page.module.css';
import { Layers, MousePointerClick } from "lucide-react";
import useStore from "@/store/dsStore";
import buttonsStyles from "@/styles/Config.module.css"
import { DatasetInfo } from "@/interfaces/NNInterfaces";
import HeaderPageTask from "@/components/client/utils/HeaderPageTask";



export default function Prototypes() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [features, setFeatures] = useState<string[]>([])
    const [labelFeatures, setLabelFeatures] = useState<string[]>([])
    const [featureName, setFeatureName] = useState<any>("")
    const [labelFeatureName, setLabelFeatureName] = useState<string>("")

    const [prototypes, setPrototypes] = useState<PrototypesInt | null>(null)
    const labelDict = useStore((state) => state.labelDict)
    const setLabelDict = useStore((state) => state.setLabelDict)

    const featureData = useStore((state) => state.prototypesData)
    const setFeatureData = useStore((state) => state.setPrototypesData)

    const [featureType, setFeatureType] = useState<any>("")

    const labelData = useStore((state) => state.labelProtoData)
    const setLabelData = useStore((state) => state.setLabelProtoData)

    const [isLoading, setIsLoading] = useState<boolean>(false)

    const datasetUsed = useStore((state) => state.dataset)

    const datasetName = datasetUsed?.name



    useEffect(() => {
        if (Array.isArray(datasetUsed?.features)) {
            const extractedFeatures = datasetUsed.features
                .filter(({ type }) => type === image_type || type === text_type)
                .map(({ name }) => name);

            if (featureName !== "") {
                const load_labels = async () => {
                    const feature = await featureLoader(datasetUsed.name, featureName)
                    const lb_feature = await IsFeatureSameLength(datasetUsed as DatasetInfo, feature.datas.length);
                    setLabelFeatures(lb_feature as string[])
                };
                load_labels()

                const labelFeature = datasetUsed.features.find(feature => feature.type === label_type);
                if (labelFeature?.label_dict) {
                    setLabelDict(labelFeature.label_dict)
                }
            }
            setFeatures(extractedFeatures);
        }
    }, [datasetUsed, featureName])


    const handleClick = async () => {
        setIsLoading(true);
        try {
            if (labelFeatureName) {
                const fetchedData = await getPrototypes(datasetName as string, featureName, labelFeatureName);
                setPrototypes(fetchedData);
                console.log("fetched prototypes", fetchedData)
            }
            else {
                const fetchedData = await getPrototypes(datasetName as string, featureName);
                setPrototypes(fetchedData);
            }
        } finally {
            setIsLoading(false);
        }
    };

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
        <div>
            {/*}
            <Box
                className={classes.title}
                style={{ display: "flex", flexDirection: "column", gap: "0px" }}
            >
                <div className={classes.datasetHeader}>
                    <Layers className={classes.iconDatabase} />
                    <h1 className={classes.datasetTitle}>
                        Prototypes visualization
                    </h1>
                </div>
                <div className={classes.datasetDivider}></div>

            </Box>
            */}

            <HeaderPageTask
                Icon={Layers}
                title="Prototypes visualization"
                descrition="Here you can visualize the prototypes of your dataset"
            />

            <div className={classes.featureBox}>
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
                <Flex justify="end">
                    <Button mt="md" size="sm"
                        onClick={handleClick}
                        disabled={
                            (datasetUsed?.task === "single_feature" && !featureName) ||
                            (datasetUsed?.task !== "single_feature" && (!featureName || !labelFeatureName))
                        }
                        className={`${buttonsStyles.buttonBase} ${buttonsStyles.computeNow}`}
                    >
                        Get Prototypes
                    </Button>
                </Flex>
            </div>
            {isLoading ? (
                <Flex
                    mih={150}
                    justify="center"
                    align="center"
                    direction="column"
                    wrap="wrap"
                    style={{ width: "100%" }}
                >
                    <Text>Loading...</Text>
                    <Loader />
                </Flex>
            ) : prototypes && featureData && labelData ? (
                <Flex
                    mih={150}
                    justify="center"
                    align="center"
                    direction="column"
                    wrap="wrap"
                    style={{ width: "100%" }}
                >
                    <div ref={containerRef} className="h-[600px] overflow-auto">
                        <FeatureDisplayer
                            featureData={featureData}
                            featureType={featureType}
                            labelData={labelData}
                            label_dict={labelDict as { [key: number]: string }}
                            columns={4}
                        />
                    </div>
                </Flex>
            ) : (
                <Center>
                    <span
                        style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                    >
                        <MousePointerClick size={22} color="white" />
                        <Text size="xs">
                            {datasetUsed?.task === "single_feature"
                                ? "Select a feature "
                                : "Select a feature and a label "}
                            to see the prototypes
                        </Text>
                    </span>
                </Center>
            )}


        </div>
    )
}