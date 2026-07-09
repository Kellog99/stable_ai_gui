"use client"

import FileDropZone from '@/components/client/upload/FileDropZone';
import styles from '@/styles/HomePage.module.css';
import { useEffect, useState } from 'react';

// Configuration file for creating the HomePage Drag and Drop components
import { getAttacksList, getMetricsList, getCoreElements } from './functionalities/TITANNServices/get_info';
import useNNTrustStore from '@/store/nnTrustStore';
import { Brain, DatabaseIcon } from 'lucide-react';
import { infoDataset, infoModel } from './components/client/upload/config';
import useStore from './store/dsStore';
import { DatasetInfo, ModelInfo } from './interfaces/homePageInterface';
import useBackendVariablesStore from './store/globalStore';
import uploadZip from './functionalities/UploadZip';

export const title = "Stable-AI"

export default function HomePage() {

  // Extracting the main variables that are needed for the services.
  const {
    hostname,
    port
  } = useBackendVariablesStore()

  // At this level It is asked for the list of all the attacks
  const {
    model,
    setAttacks,
    setModel,
    setMetrics,
  } = useNNTrustStore()

  //  Dataset global variables
  const {
    dataset,
    setDataset
  } = useStore()

  const [listModels, setListModels] = useState<ModelInfo[]>([])
  const [listDatasets, setListDataset] = useState<DatasetInfo[]>([])

  // ################## Attacks' list ##################
  useEffect(() => {
    getMetricsList(hostname, port)
      .then(setMetrics)
      .catch(err => console.error("Failed to load attacks:", err));
  }, [setMetrics, hostname, port]);

  useEffect(() => {
    getAttacksList(hostname, port)
      .then(setAttacks)
      .catch(err => console.error("Failed to load attacks:", err));
  }, [setAttacks, hostname, port]);

  // ################## Models' list ################## 
  useEffect(() => {
    getCoreElements(
      hostname,
      port,
      "path_model_repo",
      "info.json"
    )
      .then((listModels) => setListModels(listModels as ModelInfo[]))
      .catch(err => console.error("Failed to load models:", err));
  }, [hostname, port]);

  // ################## Datasets' list ################## 
  useEffect(() => {
    getCoreElements(
      hostname,
      port,
      "path_ds_repo",
      "info.json"
    )
      .then((listDatasets) => setListDataset(listDatasets as DatasetInfo[]))
      .catch(err => console.error("Failed to load datasets:", err));
  }, [hostname, port, setListDataset]);


  // ################## Selection handler ##################
  // this handler works fine for both model and dataset
  const createToggleHandler = <T extends ModelInfo | DatasetInfo>(
    setter: (value: T | null) => void,
    currentValue: T | null
  ) => {
    return (selected: ModelInfo | DatasetInfo) => {
      if (!selected) return;

      if (!currentValue) {
        setter(selected as T);
      } else {
        setter(selected.id === currentValue.id ? null : (selected as T));
      }
    };
  };

  // ################## Deletion handler ##################
  const createDeletionHandler = <T extends ModelInfo | DatasetInfo>(
    setter: React.Dispatch<React.SetStateAction<T[]>>,
    currentList: T[] | null
  ) => {
    return (selected: ModelInfo | DatasetInfo) => {
      if (!selected) return;

      if (currentList && currentList.length > 0) {
        const updatedList = currentList.filter(value => value.id !== selected.id) as T[];
        setter(updatedList.length > 0 ? updatedList : []);
      }
    };
  };
  return (
    <div className={styles.home_page}>
      <div className={styles.home_header}>
        <h1 className={styles.home_title}>
          Welcome to {title}
        </h1>
        <p className={styles.home_subtitle}>
          Upload the <b>Dataset</b> or the <b>Model</b> in the space below or upload them from the appropriate <b>Repository</b> to conduct a quality and vulnerability analysis.
        </p>
      </div>

      <div className={styles.upload_container}>
        {/* Model selection */}
        <FileDropZone
          key={"model_loader"}
          id={'model_loader'}
          title="Model"
          description="Drag and drop your model or choose an existing model."
          elements={listModels}
          Icon={Brain}
          fileDropInformation={infoModel}
          handleSelection={createToggleHandler(setModel, model)}
          handleDeletion={createDeletionHandler(setListModels, listModels)}
          handleFileUpload={(file: File | null) => { uploadZip(hostname, port, "path_model_repo", file) }}
        />

        {/* Dataset selection */}
        <FileDropZone
          id="dataset_loader"
          title="Dataset"
          description="Load your dataset or choose an existing dataset."
          elements={listDatasets}
          Icon={DatabaseIcon}
          fileDropInformation={infoDataset}
          handleSelection={createToggleHandler(setDataset, dataset)}
          handleDeletion={createDeletionHandler(setListDataset, listDatasets)}
          handleFileUpload={(file: File | null) => { uploadZip(hostname, port, "path_ds_repo", file) }}
        />
      </div>
    </div>
  );
}
