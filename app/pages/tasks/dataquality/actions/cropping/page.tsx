"use client";
import { useState, useEffect } from 'react';
import { Progress, Flex, Select, Text, Box, Center, Button } from '@mantine/core';

import { bbox_type, image_type } from '@/properties/types';
import { cropper_get } from '@/properties/urls';
import Link from "next/link";
import { GetDatasetAndSave } from '@/functionalities/DatasetsLoader';
import classes from "../../datasets/page.module.css"
import { CropPathfinder } from '@vectopus/atlas-icons-react';
import { MousePointerClick } from 'lucide-react';
import { AlertCust } from '@/components/client/AlertCustom';
import buttonsStyles from "@/styles/Config.module.css"
import useStore from '@/store/dsStore';

function Home() {

  const [featureName, setFeatureName] = useState<any>("")
  const [bboxFeatureName, setBboxFeatureName] = useState<any>("")
  const [features, setFeatures] = useState<string[]>([])
  const [bboxFeatures, setBboxFeatures] = useState<string[]>([])
  const [datasetName, setDatasetName] = useState<string | null>("")


  const [isConnected, setIsConnected] = useState(false);
  const [isCropping, setIsCropping] = useState(false);
  const [progress, setProgress] = useState(0);

  const [result, setResult] = useState<string | null>(null);

  const [progressColor, setProgressColor] = useState<string | null>("red");

  const datasetUsed = useStore((state) => state.datasetUsed)
  const setData = useStore((state) => (state.setData));


  async function ssl_crop(bboxFeatureName: string) {
    const baseUrl = cropper_get

    const url = new URL(baseUrl);

    // Option 1: Pass datasets as a single comma-separated list
    url.searchParams.append('featureName', featureName);
    url.searchParams.append('datasetName', datasetUsed?.name as string);
    url.searchParams.append('bboxName', bboxFeatureName);

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
                if (jsonData.type === "conversion") {
                  setProgressColor("blue")
                } else {
                  setProgressColor("red")
                }
                // Handle the progress update
                if (jsonData.status === "complete") {
                  setIsCropping(false)
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
        reader.releaseLock(); // Always release the lock when done
      }
    }
  }

  useEffect(() => {
    if (Array.isArray(datasetUsed?.features)) {
      const extractedFeatures = datasetUsed.features
        .filter(({ type }) => type === image_type)
        .map(({ name }) => name);

      const extractedBoundingBoxes = datasetUsed.features
        .filter(({ type }) => type === bbox_type)
        .map(({ name }) => name);

      setFeatures(extractedFeatures);
      setBboxFeatures(extractedBoundingBoxes);

    }
  }, [datasetUsed])

  const startCropping = (bboxFeatureName: string) => {
    setBboxFeatureName(bboxFeatureName)
    if (bboxFeatureName) {
      ssl_crop(bboxFeatureName)
    }
  }


  return (
    <div className="w-full h-screen">

      <Box
        className={classes.title}
        style={{ display: "flex", flexDirection: "column", gap: "0px" }}
      >
        <div className={classes.datasetHeader}>
          <CropPathfinder className={classes.iconDatabase} />
          <h1 className={classes.datasetTitle}>
            Cropping
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
              placeholder="Choose feature to crop"
              data={features}
              value={featureName}
              onChange={(value) => setFeatureName(value)}
              allowDeselect={false}
              clearable={!isConnected}
              required={true}
            />

            <Select
              id="feature"
              radius="md"
              label="Bounding boxes"
              placeholder="Choose bounding boxes to use"
              data={bboxFeatures}
              value={bboxFeatureName}
              onChange={(value) => setBboxFeatureName(value)}
              allowDeselect={false}
              clearable={!isConnected}
              required={true}
            />

          </Flex>

        </Flex>

        <Flex direction="column" justify="space-between" align="end">
          <Button style={{ marginTop: "20px" }}
            onClick={() => {
              ssl_crop(bboxFeatureName);
              setIsCropping(true);
            }}
            disabled={!featureName || !bboxFeatureName || result == "Complete!" || isCropping || result == "Feature image is already cropped!"}
            className={`${buttonsStyles.buttonBase} ${buttonsStyles.computeNow}`}>
            Crop Image
          </Button>
        </Flex>
      </div>




      {!featureName || !bboxFeatureName ? (
        <>
          <Center>
            <span
              style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <MousePointerClick size={22} color="white" />
              <Text size="xs">
                Select a feature to crop and a bounding box to use
              </Text>
            </span>
          </Center>
        </>
      ) : featureName !== "" && result === null && bboxFeatureName !== "" && isCropping === true ? (

        <div>
          <Center>
            <Text size="sm" style={{ marginTop: "60px" }}>Cropping images...</Text>
          </Center>

          <Box style={{ position: 'relative', marginTop: 60 }}>
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
        </div>
      ) : result == "Complete!" ? (
        <>
          <AlertCust result={'success'} textToDisplay={`The ${featureName} feature has been correctly cropped and added to schema.`} />
          {/*
        <Alert
          variant="light"
          color="green"
          radius="md"
          title={result}
          icon={<FontAwesomeIcon icon={faCheck} />}
          style={{ display: 'inline-block', maxWidth: '100%', marginTop: "30px" }}>

          The {featureName} feature has been correctly cropped and added to schema.
        </Alert>
*/}
        </>

      ) : result == "Feature image is already cropped!" ? (
        <>
          <AlertCust result={'warning'} textToDisplay={
            <>
              The {featureName} feature is already cropped. Check the dataset schema{" "}
              <Link
                href={{
                  pathname: "/pages/dataquality/datasets",
                  query: { datasetName: datasetName }
                }}
                style={{ color: 'blue' }}
              >
                here
              </Link>.
            </>} />
          {/*
        <Alert
          variant="light"
          color="orange"
          radius="md"
          title="Attention!"
          icon={<FontAwesomeIcon icon={faCircleExclamation} />}
          style={{ display: 'inline-block', maxWidth: '100%', marginTop: "30px" }}
        >
          The {featureName} feature is already cropped. Check the dataset schema{" "}
          <Link
            href={{
              pathname: "/pages/dataquality/datasets",
              query: { datasetName: datasetName }
            }}
            style={{ color: 'blue' }}
          >
            here
          </Link>.
        </Alert>
*/}
        </>
      ) : null}

    </div>
  );
}

export default function Cropper() {
  return (

    <Home />

  )
}
