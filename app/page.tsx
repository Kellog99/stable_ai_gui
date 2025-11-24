"use client"

import FileDropZone from '@/components/client/upload/FileDropZone';
import styles from '@/styles/HomePage.module.css';
import { useEffect, useState } from 'react';

// Configuration file for creating the HomePage Drag and Drop components
import { getAttacksList, getDatasetsList, getModelsList } from './functionalities/NNTrustBackendUtils';
import useNNTrustStore from '@/store/nnTrustStore';
import FileRepository from './components/client/repository/FileRepository';
import { DragDrop } from './components/client/upload/DragDrop';
import { Brain, Database, DatabaseIcon, HardDrive, Upload } from 'lucide-react';
import { infoDataset, infoModel } from './components/client/upload/config';
import { ButtonProps } from './interfaces/homePageInterface';
import useStore from './store/dsStore';
import { DatasetInfo, ModelInfo } from './interfaces/NNInterfaces';


export const title = "Stable-AI"

export default function HomePage() {

  // At this level It is asked for the list of all the attacks
  // const setAttacks = useStore((state) => state.setAttacks)
  const { model, setAttacks, setModel } = useNNTrustStore()
  const { dataset, setDataset } = useStore()

  const [listModels, setListModels] = useState<ModelInfo[]>([])
  const [listDatasets, setListDataset] = useState<DatasetInfo[]>([])

  // ################## Attacks' list ##################
  useEffect(() => {
    getAttacksList()
      .then(setAttacks)
      .catch(err => console.error("Failed to load attacks:", err));
  }, [setAttacks]);

  // ################## Models' list ################## 
  useEffect(() => {
    getModelsList()
      .then(setListModels)
      .catch(err => console.error("Failed to load attacks:", err));
  }, [setListModels]);

  // ################## Datasets' list ################## 
  useEffect(() => {
    getDatasetsList()
      .then(setListDataset)
      .catch(err => console.error("Failed to load attacks:", err));
  }, [setListDataset]);

  // Model selection's buttons
  const btnModel: ButtonProps[] = [
    {
      id: "model",
      name: "Upload model",
      Icon: Upload,
      child: <DragDrop
        name={"title"}
        Icon={Brain}
        acceptedType={"zip"}
        description={'Make sure your zip contains raw data and a json config file.'}
        onFileSelect={() => { }} />,
    },
    {
      id: "repository",
      name: "Model Repository",
      Icon: HardDrive,
      child: <FileRepository
        elements={listModels}
        selectHandle={(model) => { setModel(model as ModelInfo) }}
        activeId={model?.id}
        handleDelete={(model) => {
          setListModels(listModels.filter(modelContained => modelContained.id !== (model as ModelInfo).id))
        }}
      />,
    }
  ]

  // Dataset selection's buttons
  const btnDataset: ButtonProps[] = [
    {
      id: "dataset",
      name: "Upload dataset",
      Icon: Upload,
      child: <DragDrop
        name={"title"}
        Icon={Database}
        acceptedType={"zip"}
        description={'Make sure your zip contains raw data and a json config file.'}
        onFileSelect={() => { }}
      />,
    },
    {
      id: "repository",
      Icon: HardDrive,
      name: "Model Repository",
      child: <FileRepository
        elements={listDatasets}
        selectHandle={(dataset) => { setDataset(dataset as DatasetInfo) }}
        activeId={dataset?.id}
        handleDelete={(dataset) => {
          setListDataset(listDatasets.filter(datasetContained => datasetContained.id !== (dataset as DatasetInfo).id))
        }} />,
    }
  ]



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
