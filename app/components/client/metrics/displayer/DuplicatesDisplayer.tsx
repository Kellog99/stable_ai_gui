"use client"

import FeatureDisplayer from "@/components/client/FeatureDisplayer";
import featureLoader from "@/functionalities/FeatureLoader";
import { getScoreColor } from "@/functionalities/Utils";
import { FeatureDTO } from "@/interfaces/genericInterface";
import { DuplicatesDTO } from "@/interfaces/metricsInterface";
import { image_type, text_type } from "@/properties/types";
import { Flex, RingProgress, Text, Title } from "@mantine/core";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AlertCust } from "../../AlertCustom";



export default function DuplicatesDisplayer(props: { duplicates: DuplicatesDTO }) {
  const searchParams = useSearchParams();
  const { featureName, score, indexes } = props.duplicates;
  const scoreRound = (score * 100).toFixed(1)
  const [feature, setFeature] = useState<FeatureDTO | null>(null)
  const [type, setType] = useState("")
  const [datasetName, setDatasetName] = useState<string | null>("")

  useEffect(() => {
    if (searchParams.get("datasetName")) {
      setDatasetName(searchParams.get("datasetName"));
    }
  }, [searchParams]);


  useEffect(() => {
    if (datasetName) {
      const loadFeature = async () => {
        try {
          const featureLoaded = await featureLoader(datasetName, featureName);
          if (featureLoaded.type === image_type || featureLoaded.type === text_type) {
            setFeature(featureLoaded);
            setType(featureLoaded.type)
          }
        } catch (error) {
          console.error('Error loading feature:', error);
        }
      };
      loadFeature();
    }
  }, [datasetName]);

  const indicesFlat = indexes.flat()
  const duplicatesImages: string[] = indicesFlat.map(i => feature?.datas[i]).filter(Boolean);

  return (
    <>
      <Flex
        direction="column"
        align="center"
      >
        <Title order={3}>Score on the {featureName} feature</Title>
        {feature && duplicatesImages.length > 0 ? (
          <>
            <RingProgress
              size={180}
              roundCaps
              sections={[{ value: score * 100, color: getScoreColor(score) }]}
              transitionDuration={1000}
              rootColor="transparent"
              label={<Text ta="center" fw={700} size="lg">{scoreRound}%</Text>}
            />
            <FeatureDisplayer indexes={indicesFlat} featureData={duplicatesImages} featureType={type} columns={2} />
          </>) : feature && duplicatesImages.length === 0 ? (
            <>
              <RingProgress
                size={180}
                roundCaps
                sections={[{ value: score * 100, color: getScoreColor(score) }]}
                transitionDuration={1000}
                rootColor="transparent"
                label={<Text ta="center" fw={700} size="lg">{scoreRound}%</Text>}
              />
              <AlertCust result={"success"} textToDisplay={`The ${featureName} feature has 0 duplicates.`} />
            </>
          )
          : null}
      </Flex>
    </>
  )

}