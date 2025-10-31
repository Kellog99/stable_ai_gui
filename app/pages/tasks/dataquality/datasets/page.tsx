"use client";

import { BarChartCustom } from "@/components/client/BarChart";
import FeatureDisplayer from "@/components/client/FeatureDisplayer";
import SchemaShower from "@/components/client/SchemaShower";
import featureLoader from "@/functionalities/FeatureLoader";
import { IsFeatureBond, IsFeaturePresent } from "@/functionalities/Utils";
import Dataset, { FeatureSchema } from "@/interfaces/genericInterface";
import { labelColorMapType } from "@/properties/static";
import { bbox_type, embedding_type, image_type, label_type, text_type } from "@/properties/types";
import useStore from '@/store/dsStore';
import { motion } from 'framer-motion';
import { Database, Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import classes from './page.module.css';

interface Feature {
  type: string;
  name: string;
  datas: any[];
  is_logic: boolean
}

export default function Datasets() {
  const containerRef = useRef<HTMLDivElement>(null);

  const [features, setFeatures] = useState<FeatureSchema[]>([]);
  const [connections, setConnections] = useState<[string, string][]>([]);
  const [descriptions, setDescriptions] = useState<string[]>([]);
  const [feature, setFeature] = useState<Feature | null>(null);
  const [featureType, setFeatureType] = useState<any>("");
  const [indexes, setIndexes] = useState<number[]>([]);
  const [labelFeature, setLabelFeature] = useState<Feature | null>(null);
  const [labelDict, setLabelDict] = useState<{ [key: number]: string } | null>(null);
  const [bboxesHistogramData, setBboxesHistogramData] = useState<{ label: string; samples: number }[]>([]);
  const [bboxesAreaHistogramData, setBboxesAreaHistogramData] = useState<{ label: string; samples: number }[]>([]);
  const [areEmbeddings, setAreEmbeddings] = useState<boolean>(false);


  const datasets = useStore((state) => state.datasets);
  const setDatasets = useStore((state) => state.setDatasets);
  const datasetUsed = useStore((state) => state.datasetUsed);
  const datasetName = datasetUsed?.name;
  const setData = useStore((state) => state.setData);
  const setReport = useStore((state) => state.setReport);
  const setPrototypesData = useStore((state) => state.setPrototypesData);
  const setLabelProtoData = useStore((state) => state.setLabelProtoData);
  const labelToSamples = useStore((state) => state.labelToSamples);
  const setLabelToSamples = useStore((state) => state.setLabelToSamples);
  const featureToDisplay = useStore((state) => state.featureToDisplay);
  const setFeatureToDisplay = useStore((state) => state.setFeatureToDisplay);


  const buildHistogram = useCallback((
    values: number[],
    binCount?: number
  ): { label: string; samples: number }[] => {
    if (!Array.isArray(values) || values.length === 0) return [];

    const n = values.length;
    const bins = binCount || Math.ceil(Math.sqrt(n));
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min;
    const binWidth = range === 0 ? 1 : Math.ceil((range + 1) / bins);

    const histogramBins = Array.from({ length: bins }, (_, i) => {
      const start = min + i * binWidth;
      const end = start + binWidth - 1;
      return {
        start,
        end,
        count: 0
      };
    });

    values.forEach(value => {
      const index = Math.min(
        Math.floor((value - min) / binWidth),
        bins - 1
      );
      if (index >= 0 && index < histogramBins.length) {
        histogramBins[index].count += 1;
      }
    });

    return histogramBins.map(bin => ({
      label: bin.start === bin.end ? `${bin.start}` : `${bin.start}-${bin.end}`,
      samples: bin.count
    }));
  }, []);


  const ticks = useMemo(() => {
    const dataLength = bboxesAreaHistogramData?.length ?? 0;
    const numberOfTicks = 10;

    if (dataLength === 0) return [];

    const tickIndexes = Array.from({ length: numberOfTicks }, (_, i) =>
      Math.floor(i * (dataLength - 1) / (numberOfTicks - 1))
    );
    return tickIndexes.map(i => bboxesAreaHistogramData[i]?.label ?? '');
  }, [bboxesAreaHistogramData]);


  useEffect(() => {
    if (!datasets || !datasetName) return;

    const filteredDataset = datasets.find(dataset => dataset.name === datasetName);

    if (filteredDataset) {
      setData(filteredDataset);
      setDatasets(null);
      setReport([]);
      setPrototypesData(null);
      setLabelProtoData(null);
      setLabelToSamples([]);
    }
  }, [datasets, datasetName, setData, setDatasets, setReport, setPrototypesData, setLabelProtoData, setLabelToSamples]);


  useEffect(() => {
    if (!datasetUsed) return;


    if (datasetUsed.edges) {
      setConnections(datasetUsed.edges);
    }


    const allDescriptions: string[] = [];
    if (datasetUsed.description) {
      allDescriptions.push(datasetUsed.description);
    }


    if (Array.isArray(datasetUsed?.features)) {
      const extractedFeatures = datasetUsed.features.map(({ type, name, depth, model_name }) => ({
        type,
        name,
        depth,
        model_name
      }));
      setFeatures(extractedFeatures);

      const featuresDescriptions = datasetUsed.features
        .map(({ description }) => description)
        .filter((desc): desc is string => typeof desc === 'string');

      allDescriptions.push(...featuresDescriptions);
    }

    setDescriptions(allDescriptions);
  }, [datasetUsed]);


  useEffect(() => {
    if (!featureToDisplay || !datasetName) return;

    const loadFeature = async () => {
      try {
        const featureLoaded = await featureLoader(datasetName, featureToDisplay);

        if (featureLoaded.type === image_type || featureLoaded.type === text_type) {
          setFeature(featureLoaded);
          setFeatureType(featureLoaded.type);


          if (labelFeature && !IsFeatureBond(
            datasetUsed as Dataset,
            featureLoaded?.name as string,
            labelFeature.type,
            labelFeature.name
          )) {
            setLabelFeature(null);
          }
        } else if (featureLoaded.type === label_type) {

          if (feature && IsFeatureBond(
            datasetUsed as Dataset,
            feature?.name as string,
            featureLoaded.type,
            featureLoaded.name
          )) {
            setLabelFeature(featureLoaded);
            if (featureLoaded.label_dict) {
              setLabelDict(featureLoaded.label_dict);
            }
          }
        }
      } catch (error) {
        console.error('Error loading feature:', error);
      }
    };

    loadFeature();
  }, [featureToDisplay, datasetName, datasetUsed, feature?.name, labelFeature?.name]);


  useEffect(() => {
    if (!Array.isArray(datasetUsed?.features)) return;

    const labelFeatureData = datasetUsed.features.find(f => f.type === label_type);
    const bboxFeature = datasetUsed.features.find(f => f.type === bbox_type);


    if (labelFeatureData) {
      const samplesPerClass = datasetUsed.samples_per_class;

      if (labelFeatureData.label_dict) {
        const labelDict = labelFeatureData.label_dict;
        const mapping = Object.entries(labelDict).map(([labelKey, labelName]) => {
          const key = parseInt(labelKey);
          return {
            label: labelName as string,
            samples: samplesPerClass?.[key] ?? 0
          };
        });
        setLabelToSamples(mapping);
      } else {
        const fallbackMapping = samplesPerClass
          ? Object.entries(samplesPerClass).map(([key, count]) => ({
            label: key.toString(),
            samples: count as number,
          }))
          : [];
        setLabelToSamples(fallbackMapping);
      }
    } else {
      setLabelToSamples([]);
    }


    if (bboxFeature) {
      const bboxesPerArea = datasetUsed.bboxes_areas;
      const bboxesPerSample = datasetUsed.bboxes_per_sample;

      if (Array.isArray(bboxesPerSample) && bboxesPerSample.length > 0) {
        const histogram = buildHistogram(bboxesPerSample);
        setBboxesHistogramData(histogram);
      } else {
        setBboxesHistogramData([]);
      }

      if (Array.isArray(bboxesPerArea) && bboxesPerArea.length > 0) {
        const histogram = buildHistogram(bboxesPerArea);
        setBboxesAreaHistogramData(histogram);
      } else {
        setBboxesAreaHistogramData([]);
      }
    } else {
      setBboxesHistogramData([]);
      setBboxesAreaHistogramData([]);
    }
  }, [datasetUsed, buildHistogram, setLabelToSamples]);


  useEffect(() => {
    if (!datasetUsed) return;

    const embs = IsFeaturePresent(datasetUsed, embedding_type);
    if (embs !== areEmbeddings) {
      setAreEmbeddings(embs);
    }
  }, [datasetUsed, areEmbeddings]);

  useEffect(() => {
    if (!feature?.datas || !Array.isArray(feature.datas)) return;

    const indexesList = Array.from({ length: feature.datas.length }, (_, i) => i);
    setIndexes(indexesList);
  }, [feature?.datas]);


  const handleonClose = useCallback(() => {
    setFeatureToDisplay(null);
    setLabelFeature(null);
  }, [setFeatureToDisplay]);

  return (
    <>

      <div className={classes.pageContainer}>
        <div
          className={classes.title}
          style={{ display: "flex", flexDirection: "column", gap: "0px" }}
        >
          <div className={classes.datasetHeader}>
            <Database className={classes.iconDatabase} />
            <h1 className={classes.datasetTitle}>
              {datasetUsed?.name
                ? datasetUsed.name.charAt(0).toUpperCase() + datasetUsed.name.slice(1)
                : ''} dataset
            </h1>
          </div>
          <div className={classes.datasetDivider}></div>

        </div>

        <div className={classes.featureBox}>
          <div className={classes.fixedTitle}>
            <h3 style={{ textAlign: "center", color: "#94a3b8" }}>
              Dataset schema
            </h3>
          </div>
          <div className={classes.featureContent}>

            <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <motion.div
                  animate={{
                    x: featureToDisplay && feature ? -200 : 0,
                  }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                  style={{
                    width: '100%',
                    willChange: 'transform',
                  }}
                >
                  <div
                    ref={containerRef}
                    className={classes.schemaContainer}
                  >
                    <SchemaShower
                      features={features}
                      connections={connections}
                      labelColorMap={labelColorMapType}
                      clickable={true}
                    />
                  </div>
                </motion.div>
                {!featureToDisplay && (
                  <div className={classes.tooltipBox}>
                    <Search className={classes.tooltipIcon} />
                    <span>Click on the schema to explore the features!</span>
                  </div>
                )}
              </div>
            </div>

            {featureToDisplay && feature && (
              <div
                style={{

                  position: 'relative',
                  overflow: 'auto',
                  visibility: featureToDisplay && feature ? 'visible' : 'hidden',
                  pointerEvents: featureToDisplay && feature ? 'auto' : 'none',
                }}
              >
                <motion.div
                  initial={{ opacity: 0, transform: "translateX(100px)" }}
                  animate={{
                    opacity: featureToDisplay && feature ? 1 : 0,
                    transform:
                      featureToDisplay && feature ? "translateX(0)" : "translateX(100px)",
                  }}
                  transition={{ type: "tween", duration: 0.5, ease: "easeInOut" }}
                  style={{ willChange: "transform, opacity" }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "0.25rem",
                      marginTop: "20px",
                    }}
                  >
                    <div style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "0.5rem"
                    }}>
                      <h4 style={{ textAlign: "center", flex: 1, color: "#94a3b8" }}>
                        Explore the {feature.name} feature
                      </h4>
                      <button
                        onClick={handleonClose}
                        style={{
                          background: "transparent",
                          border: "none",
                          borderRadius: "50%",
                          width: "28px",
                          height: "28px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          fontSize: "16px",
                        }}
                      >
                        ×
                      </button>

                    </div>
                    <div className={classes.featureDetails}>
                      <FeatureDisplayer
                        indexes={indexes}
                        featureData={feature.datas}
                        featureType={featureType}
                        labelData={labelFeature ? labelFeature.datas : undefined}
                        label_dict={labelDict ? labelDict as { [key: number]: string } : undefined}
                        columns={2}
                      />
                    </div>

                  </div>
                </motion.div>
              </div>
            )}
          </div>
        </div>


        <h2 style={{ color: "white", marginBottom: "0px" }}>Description</h2>
        <div className={classes.datasetDividerDesc}></div>

        <div style={{ display: 'flex', marginBottom: '30px' }}>
          <p style={{ color: "white" }}>
            <span style={{ fontWeight: 600 }}>
              {datasetUsed?.name || ""}
            </span>{" "}
            is a dataset for {datasetUsed?.task || ""}.
            {datasetUsed?.n_classes ? (
              <> {" "} It has {datasetUsed?.n_classes || ""} classes and {datasetUsed?.n_samples} samples.{" "}</>
            ) : (
              <>It has {datasetUsed?.n_samples}{" "}</>
            )}
            {descriptions?.map((description, index) => (
              <span key={index}>{description} </span>
            ))}
          </p>
        </div>


        {datasetUsed?.samples_per_class ? (
          <>
            <h2 style={{ color: "white", marginBottom: "0px" }}>Numerosity per class</h2>
            <div className={classes.datasetDividerNum}></div>
            <div style={{ margin: '20px' }}>
              <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                flexWrap: "wrap",
              }}>
                <div
                  style={{
                    marginLeft: "30px",
                    marginRight: "30px",
                    overflowX: 'auto',
                    overflowY: 'hidden',
                    maxWidth: '60vw',
                  }}
                >
                  <BarChartCustom
                    data={labelToSamples}
                    keyL="labels" />
                </div>
              </div>
            </div>
          </>
        ) : null}

        <div style={{
          display: 'flex',
          gap: '20px',
          margin: '20px auto',
          maxWidth: '2040px',
          overflowX: 'auto',
          overflow: "hidden",
          paddingBottom: '10px'
        }}>

          {datasetUsed?.bboxes_per_sample && bboxesHistogramData.length > 0 ? (
            <div style={{
              flex: '1',
              minWidth: '500px',
              maxWidth: 'calc(50% - 10px)'
            }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ display: "inline-block", textAlign: "left" }}>
                  <h2 style={{ color: "white" }}>
                    Number of Bounding Boxes per Image
                  </h2>
                  <div className={classes.datasetDividerDesc}></div>
                </div>
              </div>


              <div style={{ width: '100%' }}>
                <div style={{ display: "flex", alignContent: "center", flexDirection: "column", flexWrap: "wrap" }}>

                  <div
                    style={{
                      marginLeft: "30px",
                      marginRight: "30px",
                      overflowX: 'auto',
                      overflowY: 'hidden',
                      width: '100%',
                      maxWidth: '100%',
                    }}
                  >
                    <div style={{ display: "flex", flexDirection: "column", alignContent: "center" }}>
                      <BarChartCustom
                        data={bboxesHistogramData}
                        keyL="bboxesHis"
                        dynamicWidth={true}
                        tooltipsSets={true}
                        tooltipsUM="bounding boxes"
                      />

                      <p
                        style={{
                          fontSize: "0.875rem",
                          marginTop: "0.25rem",
                          color: "#868e96",
                        }}
                      >
                        Bounding Boxes per Image
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          ) : null}

          {datasetUsed?.bboxes_areas && bboxesAreaHistogramData.length > 0 ? (
            <div style={{
              flex: '1',
              minWidth: '500px',
              maxWidth: 'calc(50% - 10px)'
            }}>

              <div style={{ textAlign: "center" }}>
                <div style={{ display: "inline-block", textAlign: "left" }}>
                  <h2 style={{ color: "white" }}>
                    Number of Bounding Boxes per Image
                  </h2>
                  <div className={classes.datasetDividerNum}></div>
                </div>
              </div>

              <div style={{ width: '100%' }}>
                <div style={{ display: "flex", flexDirection: "column", alignContent: "center", justifyContent: "center", flexWrap: "wrap" }}>
                  <div
                    style={{
                      marginLeft: "30px",
                      marginRight: "30px",
                      overflowX: 'auto',
                      overflowY: 'hidden',
                      width: '100%', // Usa tutta la larghezza disponibile
                      maxWidth: '100%',
                    }}
                  >
                    <div style={{ display: "flex", flexDirection: "column", alignContent: "center" }}>

                      <BarChartCustom
                        data={bboxesAreaHistogramData}
                        keyL="bboxesHis"
                        dynamicWidth={true}
                        xAxisSets={true}
                        tooltipsSets={true}
                        tooltipsUM="px²"
                      />
                      <p
                        style={{
                          fontSize: "0.875rem",
                          marginTop: "0.25rem",
                          color: "#868e96",
                        }}
                      >
                        Bounding Box Area (px²)
                      </p>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>

      </div >

    </>
  );
}
