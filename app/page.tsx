"use client"

import FileDropZone from '@/components/client/upload/FileDropZone';
import styles from '@/styles/HomePage.module.css';
import { useEffect } from 'react';

// Configuration file for creating the HomePage Drag and Drop components
import { listOfSections } from '@/components/layout/configHomePage';
import { getAttacksList, getModelsList } from './functionalities/NNTrustBackendUtils';
import useNNTrustStore from '@/store/nnTrustStore';


export const title = "Stable-AI"

export default function HomePage() {

  // At this level It is asked for the list of all the attacks
  // const setAttacks = useStore((state) => state.setAttacks)
  const { setAttacks, listModels, setListModels } = useNNTrustStore()
  //Getting all the attacks
  useEffect(() => {
    getAttacksList()
      .then(setAttacks)
      .catch(err => console.error("Failed to load attacks:", err));
  }, [setAttacks]);

  // Getting the list of all the available models 
  useEffect(() => {
    getModelsList()
      .then(setListModels)
      .catch(err => console.error("Failed to load attacks:", err));
  }, [listModels, setListModels]);


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
        {listOfSections.map((dropElement, index) => (
          <FileDropZone
            key={index}
            {...dropElement}
          />
        ))}
      </div>
    </div>
  );
}
