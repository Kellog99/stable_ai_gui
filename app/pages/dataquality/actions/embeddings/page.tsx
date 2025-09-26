"use client";

import { getModelInfo } from '@/functionalities/BackendUtils';
import { ModelInfo } from '@/interfaces/genericInterface';
import { image_type, text_type } from '@/properties/types';
import { embedder_get } from '@/properties/urls';
import {
  faCheck, faCircleExclamation
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Alert, Box, Button, Center, Flex, Loader, Progress, Select, Table, Text } from '@mantine/core';
import Link from "next/link";
import { useEffect, useRef, useState } from 'react';
import useStore from '../../../../store/dsStore';
import classes from "../../datasets/page.module.css"
import buttonsStyles from "../../../../styles/Config.module.css"
import { GetDatasetAndSave } from '../../../../functionalities/DatasetsLoader';
import { useSearchParams } from 'next/navigation';
import { MousePointerClick, Zap } from 'lucide-react';
import styles from "./page.module.css"
import { AnyKindOfDictionary } from 'lodash';
import { AlertCust } from '@/components/client/AlertCustom';

function Home() {
  const socketRef = useRef<WebSocket | null>(null);

  const [featureName, setFeatureName] = useState<any>("")
  const [modelName, setModelName] = useState<string | null>("")
  const [features, setFeatures] = useState<string[]>([])
  const [datasetName, setDatasetName] = useState<string | null>("")


  const [isConnected, setIsConnected] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Idle');
  const [result, setResult] = useState<string | null>(null);
  const [projecting, setProjecting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [computing, setComputing] = useState<boolean>(false);
  const [loadingInfo, setLoadingInfo] = useState<boolean>(false);
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);
  const [showModelInfo, setShowModelInfo] = useState<boolean>(false);

  const searchParams = useSearchParams();
  const showPrecompiled = searchParams.get('autoSelectModel') === 'true';

  useEffect(() => {
    if (showPrecompiled) {
      const fetchModelInfo = async () => {
        setModelName("apple/DFN5B-CLIP-ViT-H-14-378");
        setLoadingInfo(true);
        try {
          const modelInfoReceived = await getModelInfo("apple/DFN5B-CLIP-ViT-H-14-378");
          setModelInfo(modelInfoReceived);
          setShowModelInfo(true);
        } catch (error) {
          console.error("Error fetching model info:", error);
        } finally {
          setLoadingInfo(false);
        }
      };

      fetchModelInfo();
    }
  }, [showPrecompiled]);



  const datasetUsed = useStore((state) => state.datasetUsed)
  const setData = useStore((state) => (state.setData));


  async function computeEmbeddings(model: string) {
    console.log("La chiamata è partita :))))")
    const baseUrl = embedder_get

    const url = new URL(baseUrl);

    // Option 1: Pass datasets as a single comma-separated list
    url.searchParams.append('featureName', featureName);
    url.searchParams.append('datasetName', datasetUsed?.name as string);
    url.searchParams.append('modelUsed', model)
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
                } else if (jsonData.status == "projecting") {
                  setProjecting(true);
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
        .filter(({ type }) => type === image_type || type === text_type)
        .map(({ name }) => name);

      setFeatures(extractedFeatures);
    }
  }, [datasetUsed])


  function checkModelFeatureCompatibility(modelInfo: ModelInfo, featureName: string) {
    if (Array.isArray(datasetUsed?.features) && modelInfo) {
      const feature = datasetUsed.features.find(f => f.name === featureName);
      const type = feature?.type;

      if (type === image_type && modelInfo.supports_images == true) {
        return true;
      } else if (type === text_type && modelInfo.supports_text == true) {
        return true;
      } else {
        return false;
      }
    }
  }

  const connectAndAssingModel = async (model: string) => {

    setModelName(model)
    if (model) {
      setLoadingInfo(true);
      const modelInfoReceived = await getModelInfo(model);
      setModelInfo(modelInfoReceived);
      setShowModelInfo(true);
      setLoadingInfo(false);

    }
  }

  const handleCompute = () => {
    setComputing(true)
    if (modelName) {
      computeEmbeddings(modelName)
    }
  }

  const formatValue = (value: any) => {
    if (value === null) {
      return <span className={styles.nullValue}>-</span>;
    }
    if (typeof value === 'boolean') {
      return (
        <span className={value ? styles.trueValue : styles.falseValue}>
          {value.toString()}
        </span>
      );
    }
    return value;
  };



  return (
    <div className="w-full h-screen">

      <Box
        className={classes.title}
        style={{ display: "flex", flexDirection: "column", gap: "0px" }}
      >
        <div className={classes.datasetHeader}>
          <Zap className={classes.iconDatabase} />
          <h1 className={classes.datasetTitle}>
            Embeddings computation
          </h1>
        </div>
        <div className={classes.datasetDivider}></div>

      </Box>



      <Flex direction="column">
        <div className={classes.featureBox}>
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
              onChange={(value) => setFeatureName(value)}
              allowDeselect={false}
              clearable={!isConnected}
              required={true}
            />

            <Select
              id="feature"
              radius="md"
              label="Model name"
              placeholder="Choose model to use"
              data={[
                "sentence-transformers/all-MiniLM-L6-v2",
                "openai/clip-vit-base-patch32",
                "google/vit-base-patch16-224",
                "bert-base-uncased",
                "apple/DFN5B-CLIP-ViT-H-14-378"
              ]}
              value={modelName}
              onChange={(value) => connectAndAssingModel(value as string)}
              allowDeselect={false}
              clearable={!isConnected}
              required={true}
              onClear={() => {
                setShowModelInfo(false);
                setModelInfo(null);
                setComputing(false);
              }}
            />
          </Flex>

          <Flex
            direction="row"
            justify="end"
            gap="md">

            <Button style={{ marginTop: "20px" }}
              onClick={handleCompute}
              disabled={!featureName || !modelName || !checkModelFeatureCompatibility(modelInfo as ModelInfo, featureName) || computing}
              className={`${buttonsStyles.buttonBase} ${buttonsStyles.computeNow}`}>
              Compute Embeddings
            </Button>
          </Flex>

        </div>

        {showModelInfo && modelInfo ? (
          <>
            <Flex direction="row" gap="md" align="center" wrap="nowrap">
              <div className={styles.container}>
                <div className={styles.header}>
                  Model Info
                </div>
                <table className={styles.table}>
                  <tbody>
                    <tr>
                      <td className={styles.label}>Name</td>
                      <td className={styles.value}>{modelInfo.name}</td>
                    </tr>
                    <tr>
                      <td className={styles.label}>Model Type</td>
                      <td className={styles.value}>{modelInfo.model_type}</td>
                    </tr>
                    <tr>
                      <td className={styles.label}>Architecture</td>
                      <td className={styles.value}>{modelInfo.architecture}</td>
                    </tr>
                    <tr>
                      <td className={styles.label}>Support Text</td>
                      <td className={styles.value}>{formatValue(modelInfo.supports_text)}</td>
                    </tr>
                    <tr>
                      <td className={styles.label}>Support Images</td>
                      <td className={styles.value}>{formatValue(modelInfo.supports_images)}</td>
                    </tr>
                    <tr>
                      <td className={styles.label}>Support Audio</td>
                      <td className={styles.value}>{formatValue(modelInfo.supports_audio)}</td>
                    </tr>
                    <tr>
                      <td className={styles.label}>Embedding Dimension</td>
                      <td className={styles.value}>{formatValue(modelInfo.embedding_dim)}</td>
                    </tr>
                    <tr>
                      <td className={`${styles.label} ${styles.lastRow}`}>Max Length</td>
                      <td className={`${styles.value} ${styles.lastRow}`}>{formatValue(modelInfo.max_length)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {!checkModelFeatureCompatibility(modelInfo, featureName) && (
                <>
                  <AlertCust result={'warning'} textToDisplay="Check the compatibility between the selected model and the feature type." />

                </>
              )}
            </Flex>
          </>) : loadingInfo ? (
            <>
              <Flex
                mih={150}
                justify="center"
                align="center"
                direction="column"
                wrap="wrap"
              >
                <Loader size={30} />
              </Flex>
            </>
          ) :
          <Center>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <MousePointerClick size={22} color="white" />
              <Text size="sm">Select a feature and a model to compute embeddings</Text>
            </span>
          </Center>}

      </Flex>

      {computing && result==null? (

        <div>
          <Center>
            {projecting ?
              <Text size="sm" style={{ marginTop: "60px" }}>Projecting embeddings...</Text>
              : <Text size="sm" style={{ marginTop: "60px" }}>Computing embeddings...</Text>}

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
      ) :
        result == "Complete!" ? (<>
          <AlertCust result={'success'} textToDisplay={`The ${featureName} feature has been correctly embedded and added to schema.`} />
          {/*
          <Alert
            variant="light"
            color="green"
            radius="md"
            title={result}
            icon={<FontAwesomeIcon icon={faCheck} />}
            style={{ display: 'inline-block', maxWidth: '100%', marginTop: "30px" }}>

            The {featureName} feature has been correctly embedded and added to schema.
          </Alert>
          */}
        </>


        ) : result == "Feature is already embedded!" ? (
          <>
            <AlertCust
              result={'warning'}
              textToDisplay={<>
                The {featureName} feature is already embedded. Check the dataset schema{" "}
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
            The {featureName} feature is already embedded. Check the dataset schema{" "}
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


        ) : null
      }
    </div >
  );
}

export default function Embedder() {
  return (

    <Home />

  )
}
