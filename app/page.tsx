"use client";
import TaskButton from '@/components/client/buttons/TaskButton';
import useStore from '@/store/nnTrustStore';
import styles from '@/styles/HomePage.module.css';
import { Database, Upload } from 'lucide-react';
import { DatasetRepository } from './components/client/DatasetsRepoLoad';
import FileDropZone from './components/client/FileDropZone';
import { ModelRepository } from './components/client/ModelRepository';
import { ModalUploadDataset } from './components/client/upload/ModalUploadDataset';
import { ModalUploadModel } from './components/client/upload/ModalUploadModel';
import { DragDrop } from './components/client/upload/UploaderUnifiedDragDrop';
import DatasetsLoader from './functionalities/DatasetsLoader';
import { getModels } from './functionalities/NNTrustBackendUtils';
import { AvailableTasks } from './components/layout/config';
import { uploadDataset_check, uploaderDataset, uploadModel, uploadModel_check } from './properties/urlsNNTrust';

const HomePage: React.FC = ({ }) => {
  const setModels = useStore((state) => state.setModels)
  const setDatasets = useStore((state) => state.setDatasets)

  const datasetSections = [
    {
      id: "repository",
      title: "Dataset Repository",
      Icon: Database,
      child: DatasetRepository
    }
    /*{
      id: "selection",
      title: "Upload Dataset",
      Icon: Upload,
      child: () => <DragDrop
        config={{
          name: "dataset",
          fileType: 'zip',
          accept: 'application/zip',
          formFieldName: "folder_zip",
          description: 'Make sure your zip contains raw data and a json config file.',
          uploadUrlCheck: uploadDataset_check,
          uploadUrl: uploaderDataset,
          refreshFunction: DatasetsLoader,
          setRefreshData: setDatasets
        }}
        infoModal={<ModalUploadDataset />} />
    }*/
  ];

  const modelSections = [
    {
      id: "modrepository",
      title: "Model Repository",
      Icon: Database,
      child: ModelRepository
    }
    /*{
      id: "model",
      title: "Upload Model",
      Icon: Upload,
      child: () => <DragDrop
        config={{
          name: "model",
          fileType: 'zip',
          accept: 'application/zip',
          formFieldName: "file",
          description: 'Make sure your zip contains raw data and a json config file.',
          uploadUrlCheck: uploadModel_check,
          uploadUrl: uploadModel,
          refreshFunction: getModels,
          setRefreshData: setModels

        }}
        infoModal={<ModalUploadModel />} />
    }*/
  ];

  const listOfSections = [datasetSections, modelSections];
  
  return (
    <div className={styles.homecontainer}>
      <div className={styles.filegrid}>
        {listOfSections.map((dropElement, index) => (
          <FileDropZone
            key={index}
            sections={dropElement}
            defaultActiveSection={dropElement[0].id}
          />
        ))}

      </div>

      <div className={styles.task}>
        <div className={styles.sectionheader}>
          <h2 className={styles.sectiontitle}>
            Analysis Tasks
          </h2>
          <p className={styles.sectionsubtitle}>
            Select an analysis task to begin
          </p>
        </div>

        <div className={styles.filegrid}>
          {
            AvailableTasks.map((task) =>
              <TaskButton
                key={ task.title }
                { ...task } /> )
          }
        </div>
      </div>
    </div>
  );
}

export default HomePage