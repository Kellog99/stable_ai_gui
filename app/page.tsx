"use client"

import FileDropZone from '@/components/client/upload/FileDropZone';
import styles from '@/styles/HomePage.module.css';
import { useEffect, useState } from 'react';
import FileRepository from './components/client/repository/FileRepository';
import { DragDrop } from './components/client/upload/DragDrop';
import { Database, DatabaseIcon, HardDrive, Upload } from 'lucide-react';
import { infoDataset } from './components/client/upload/config';
import { ButtonProps } from './interfaces/homePageInterface';
import useStore from './store/dsStore';
import { DatasetInfo } from './interfaces/NNInterfaces';
import DatasetsLoader from './functionalities/DatasetsLoader';
import { upload_post } from './properties/urls';


export const title = "Data Quality"

export default function HomePage() {

  const { dataset, setDataset } = useStore()
  const [listDatasets, setListDataset] = useState<DatasetInfo[]>([])
  const [loadingDS, setLoadingDS] = useState<boolean>(false)
  const [file, setFile] = useState<File | null>(null);


  // ################## Datasets' list ################## 
  useEffect(() => {
    setLoadingDS(true);
    DatasetsLoader().then(fetchedData => {

      setListDataset(fetchedData)
    }).catch(err => console.error("Failed to load datasets:", err))
      .finally(() => setLoadingDS(false));
  }, [setListDataset]);


  const handleDatasetUpload = async (selectedFile: File) => {
    if (!selectedFile) {
      console.log("No file Selected")
      return;
    }

    let body: BodyInit;
    let headers: HeadersInit = {};

    try {

      const formData = new FormData();
      formData.append("folder_zip", selectedFile);
      body = formData;

      const response = await fetch(upload_post, {
        method: 'POST',
        headers,
        body,
      });

      const data = await response.json();

      if (response.ok) {
        setFile(data);
      } else {
        console.log("Something went wrong:", data.message);
      }

    } catch (error) {
      console.error('Error uploading:', error);
    } finally {
      DatasetsLoader().then(fetchedData => {
        setListDataset(fetchedData)
      }).catch(err => console.error("Failed to load datasets:", err))
    }
  };

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
        onFileUpload={(file) => {
          return handleDatasetUpload(file as File);
        }}
      />,
    },
    {
      id: "repository",
      Icon: HardDrive,
      name: "Dataset Repository",
      child: <FileRepository
        elements={listDatasets}
        selectHandle={(selectDataset: DatasetInfo | null) => {
          if (selectDataset) {
            if (!dataset) setDataset(selectDataset)
            else { setDataset(selectDataset && selectDataset.id === dataset.id ? null : selectDataset) }
          }
        }}
        activeId={dataset?.id}
        loading={loadingDS}
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
          Upload your own <b>Dataset</b> in the space below or choose one of the preloaded ones from the appropriate <b>Repository</b> to conduct a quality analysis.
        </p>
      </div>

      <div className={styles.upload_container}>
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
