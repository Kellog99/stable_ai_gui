"use client"

import FileDropZone from "@/components/client/upload/FileDropZone";
import styles from '@/styles/HomePage.module.css';
import { reportSection } from "@/components/layout/homePageConfig";

export default function ReportPage() {



  return (
    <div className={styles.test_container}>
      <div className={styles.reportContainer}>
        <FileDropZone {...reportSection} />
      </div>
    </div>

  );
}