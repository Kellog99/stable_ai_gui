"use client";

import { AlertCust } from '@/components/client/AlertCustom';
import AsyncTaskTracker from '@/components/client/AsyncTracker'
import { getModelInfo } from '@/functionalities/BackendUtils';
import { ModelInfo } from '@/interfaces/genericInterface';
import classes from "@/pages/tasks/dataquality/datasets/page.module.css";
import { image_type, text_type } from '@/properties/types';
import useStore from '@/store/dsStore';
import buttonsStyles from "@/styles/Config.module.css";
import { Box, Button, Center, Flex, Loader, Select, Text } from '@mantine/core';
import { MousePointerClick, Zap } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from "./page.module.css";
import { embedder_progress, embedder_start } from '@/properties/urls';
import HeaderPageTask from '@/components/client/utils/HeaderPageTask';

export default function Embedder() {

  const [featureName, setFeatureName] = useState<string>("")
  const [modelName, setModelName] = useState<string | null>("")
  const [features, setFeatures] = useState<string[]>([])
  const [computing, setComputing] = useState<boolean>(false);
  const [loadingInfo, setLoadingInfo] = useState<boolean>(false);
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);
  const [showModelInfo, setShowModelInfo] = useState<boolean>(false);


  const [compute, setCompute] = useState<boolean>(false);
  const activeTask = useStore((state) => state.activeTask);


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

  const datasetUsed = useStore((state) => state.dataset)

  const config = {
    datasetName: datasetUsed?.name,
    featureName: featureName,
    modelUsed: modelName
  };



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
      setCompute(true)  // this is going to trigger the tracker spinner 
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
    <div>

      {/*
      <Box
        className={ classes.title }
        style={ { display: "flex", flexDirection: "column", gap: "0px" } }
      >
        <div className={ classes.datasetHeader }>
          <Zap className={ classes.iconDatabase } />
          <h1 className={ classes.datasetTitle }>
            Embeddings computation
          </h1>
        </div>
        <div className={ classes.datasetDivider }></div>

      </Box>
      */}
      <HeaderPageTask
        Icon={Zap}
        title="Embeddings computation"
        descrition="Here you can compute the embeddings for the features of your dataset."
      />

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
              onChange={(value) => setFeatureName(value as string)}
              allowDeselect={false}
              clearable
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
              clearable
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
          ) : activeTask === "" ? (
            <Center>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <MousePointerClick size={22} color="white" />
                <Text size="sm">Select a feature and a model to compute embeddings</Text>
              </span>
            </Center>) : null

        }

      </Flex>

      {compute || activeTask ? (
        <AsyncTaskTracker
          action={"embedder"}
          startEndpoint={embedder_start}
          startParams={config}
          startBody={undefined}
          progressEndpoint={embedder_progress}
          pollInterval={0}
          progressDisplayMode={true} />
      ) : null}
    </div >
  );
}

