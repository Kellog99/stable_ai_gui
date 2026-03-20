"use client"

import FileDropZone from '@/components/client/upload/FileDropZone';
import styles from '@/styles/HomePage.module.css';
import { useEffect, useState } from 'react';

// Configuration file for creating the HomePage Drag and Drop components
import { getAttacksList, getMetricsList, getCoreElements } from './functionalities/TITANNServices/get_info';
import useNNTrustStore from '@/store/nnTrustStore';
import FileRepository from './components/client/repository/FileRepository';
import { DragDrop } from './components/client/upload/DragDrop';
import { Brain, Database, DatabaseIcon, HardDrive, Upload } from 'lucide-react';
import { infoDataset, infoModel } from './components/client/upload/config';
import { ButtonProps } from './interfaces/homePageInterface';
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
      .catch(err => console.error("Failed to load attacks:", err));
  }, [setListDataset]);


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

  // Usage:
  const handleModelSelection = createToggleHandler(setModel, model);
  const handleDatasetSelection = createToggleHandler(setDataset, dataset);

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

  // Usage:
  const handleModelDeletion = createDeletionHandler(setListModels, listModels);
  const handleDatasetDeletion = createDeletionHandler(setListDataset, listDatasets);

  // ##################### Model Section #####################
  const btnModel: ButtonProps[] = [
    {
      id: "model",
      name: "Upload model",
      Icon: Upload,
      child: <DragDrop
        name={"Load your Model"}
        Icon={Brain}
        acceptedType={"zip"}
        description={'Make sure your zip contains raw data and a json config file.'}
        handleFileUpload={(file: File | null) => { uploadZip(hostname, port, "path_model_repo", file) }} />,
    },
    {
      id: "repository",
      name: "Model Repository",
      Icon: HardDrive,
      child: <FileRepository
        elements={listModels}
        activeId={model?.id}
        selectHandle={handleModelSelection}
        handleDelete={handleModelDeletion}
      />,
    }
  ]
  // #########################################################


  // ##################### Dataset Section #####################

  const btnDataset: ButtonProps[] = [
    {
      id: "dataset",
      name: "Upload dataset",
      Icon: Upload,
      child: <DragDrop
        name={"Load your Dataset"}
        Icon={Database}
        acceptedType={"zip"}
        description={'Make sure your zip contains raw data and a json config file.'}
        handleFileUpload={(file: File | null) => { uploadZip(hostname, port, "path_ds_repo", file) }}
      />,
    },
    {
      id: "repository",
      Icon: HardDrive,
      name: "Dataset Repository",
      child: <FileRepository
        elements={listDatasets}
        activeId={dataset?.id}
        selectHandle={handleDatasetSelection}
        handleDelete={handleDatasetDeletion} />,
    }
  ]

  // ###########################################################


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
          Icon={Brain}
          fileDropInformation={infoModel}
          buttons={btnModel}
        />

        {/* Dataset selection */}
        <FileDropZone
          id="dataset_loader"
          title="Dataset"
          description="Load your dataset or choose an existing dataset."
          Icon={DatabaseIcon}
          fileDropInformation={infoDataset}
          buttons={btnDataset}
        />
      </div>
    </div>
  );
}
