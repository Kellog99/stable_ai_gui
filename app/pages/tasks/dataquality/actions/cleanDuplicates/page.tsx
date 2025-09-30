"use client";

import { image_type, text_type } from '@/properties/types';
import { cleaner_get } from '@/properties/urls';
import useStore from '@/store/dsStore';
import { Box, Center, Flex, Progress, Select, Text } from '@mantine/core';
import { useEffect, useState } from 'react';
import Link from "next/link";
import classes from "@/pages/tasks/dataquality/datasets/page.module.css"
import { MousePointerClick } from 'lucide-react';
import { MagicWandSparkles } from '@vectopus/atlas-icons-react';
import React from 'react';
import { AlertCust } from '@/components/client/AlertCustom';
import { GetDatasetAndSave } from '@/functionalities/DatasetsLoader';

export default function CleanDuplicates() {
  const [features, setFeatures] = useState<string[]>([])
  const [featureName, setFeatureName] = useState<any>("")

  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<string | null>(null);

  const datasetUsed = useStore((state) => state.datasetUsed)
  const setData = useStore((state) => (state.setData));


  async function prova(name: string) {
    const baseUrl = cleaner_get

    const url = new URL(baseUrl);


    url.searchParams.append('featureName', name);
    url.searchParams.append('datasetName', datasetUsed?.name as string);

    const response = await fetch(url);
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (reader) {
      try {
        while (true) {
          // Read a chunk from the stream

          const { done, value } = await reader.read();

          if (done) {
            console.log("Stream complete");
            break;
          }

          // Decode the bytes to string
          const text = decoder.decode(value, { stream: true });
          console.log(text)
          // Process the SSE format (data: {...})
          const lines = text.split('\n\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const jsonData = JSON.parse(line.substring(6));
                console.log('Received progress update:', jsonData);

                // Handle the progress update
                if (jsonData.status === "complete") {
                  console.log("Process completed:", jsonData.result);
                  if (jsonData.dataset) {
                    const dataset = await GetDatasetAndSave(jsonData.dataset)
                    setData(dataset)
                  }
                  setResult(jsonData.result)
                } else if (jsonData.progress !== undefined) {
                  // Update progress if available
                  console.log(`Progress: ${jsonData.progress}%`);
                  setProgress(jsonData.progress)
                }
              } catch (e) {
                // Handle potential JSON parsing errors
                console.error('Error parsing SSE data:', e);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error reading stream:', error);
      } finally {
        reader.releaseLock();
      }
    }
  }


  useEffect(() => {
    if (Array.isArray(datasetUsed?.features)) {
      const extractedFeatures = datasetUsed.features
        .filter(({ type }) => type === image_type || type === text_type)
        .map(({ name }) => name);

      setFeatures(extractedFeatures);
    }
  }, [datasetUsed])


  const handleCleaner = (name: string) => {
    console.log("feature name:", name)
    setFeatureName(name)
    if (name) {
      prova(name)
    }
  }


  return (
    <div className="w-full h-screen">
      <Box
        className={classes.title}
        style={{ display: "flex", flexDirection: "column", gap: "0px" }}
      >
        <div className={classes.datasetHeader}>
          <MagicWandSparkles className={classes.iconDatabase} />
          <h1 className={classes.datasetTitle}>
            Duplicates Cleaning
          </h1>
        </div>
        <div className={classes.datasetDivider}></div>

      </Box>

      <div className={classes.featureBox}>
        <Flex direction="row" justify="space-between" align="flex-start">
          <Flex
            direction="row"
            gap="xs">

            <Select
              id="feature"
              radius="md"
              label="Feature"
              placeholder="Choose feature to embed"
              data={features}
              value={featureName}
              onChange={(value) => handleCleaner(value as string)}
              allowDeselect={false}
              clearable={true}
              required={true}
            />
          </Flex>
        </Flex>

      </div>
      {!featureName ? (
        <Center>
          <span
            style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <MousePointerClick size={22} color="white" />
            <Text size="xs">
              Select a feature to clean
            </Text>
          </span>
        </Center>
      ) : featureName !== "" && result === null ? (

        <>
          <Center>
            <Text size="sm" style={{ marginTop: "60px" }}>Cleaning Duplicates...</Text>
          </Center>

          <Box style={{ position: 'relative', marginTop: 30 }}>
            <Progress
              value={progress}
              size="xl"
              radius="xl"
              color="red"
              striped
              animated
              style={{
                height: "30px"
              }}
            />
            <Text
              size="sm"
              fw={700}
              c="black"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
              }}
            >
              {progress}%
            </Text>
          </Box>
        </>
      ) : result == "Complete!" ? (
        <>
          <AlertCust result={'success'} textToDisplay={`The ${featureName} feature has been correctly cleaned from duplicates.`} />

        </>

      ) : result == "Feature image is already embedded!" ? (
        <>
          <AlertCust
            result={'success'}
            textToDisplay={
              <>
                The {featureName} feature is already cleaned. Check the number of duplicates{" "}
                <Link
                  href={{
                    pathname: "/pages/dataquality/metrics/duplicates",
                    query: { datasetName: datasetUsed?.name },
                  }}
                  style={{ color: "blue" }}
                >
                  here
                </Link>.
              </>
            } />
        </>
      ) : null}

    </div>
  )
}





