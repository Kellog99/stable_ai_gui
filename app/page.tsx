"use client"

import FileDropZone from '@/components/client/upload/FileDropZone';
import styles from '@/styles/HomePage.module.css';
import { listOfSections } from '@/components/layout/homePageConfig';
import useStore from '@/store/nnTrustStore';
import { RegisterObjectProps } from '@/interfaces/NNInterfaces';
import { useEffect } from 'react';

export const title = "Stable-AI"

export default function HomePage() {
  // At this level It is asked for the list of all the attacks
  // const setAttacks = useStore((state) => state.setAttacks)
  const { setAttacks } = useStore()
  useEffect(() => {
    (async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/attacks/getInfo');
        if (!response.ok) {
          throw new Error(`HTTP error for the attacks' list! Status: ${response.status}`);
        }

        const listAttacks: { [key: string]: RegisterObjectProps } = await response.json();
        setAttacks(listAttacks);
      } catch (err) {
        console.error(err instanceof Error ? err.message : "An unknown error occurred");
      }
    })();
  }, [setAttacks]);

  return (
    <div className={styles.home_page}>
      <div className={styles.home_container}>
        
        <div className={styles.home_header}>
          <h1 className={styles.home_title}>
            Welcome to {title}
          </h1>
          <p className={styles.home_subtitle}>
            Upload the <b>Dataset</b> or the <b>Model</b> in the space below or upload them from the appropriate <b>Repository</b> to conduct a quality and vulnerability analysis.
          </p>
        </div>

        <div className={styles.upload_grid}>
          {listOfSections.map((dropElement, index) => (
            <FileDropZone
              key={index}
              {...dropElement}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
