"use client"
import { useState } from "react";
import { FileText } from 'lucide-react';

import styles from '@/styles/HomePage.module.css'
import { LoadedFile } from "@/interfaces/NNInterfaces";
import FileDropZone from "@/components/client/FileDropZone";


interface ReportPageProps {
  reportFiles: LoadedFile[];
  onFileSelect: (file: File) => void;
  onFileDelete: (index: number) => void;
}

export default function ReportPage({ reportFiles, onFileSelect, onFileDelete }: ReportPageProps) {
  const [selectedFileIndex, setSelectedFileIndex] = useState<number | null>(null);
  const [jsonData, setJsonData] = useState<any>(null);

  const handleShowData = async (index: number) => {
    const file = reportFiles[index];
    try {
      const text = await file.file.text();
      const data = JSON.parse(text);
      setJsonData(data);
      setSelectedFileIndex(index);
    } catch (error) {
      console.error('Error parsing JSON:', error);
      alert('Invalid JSON file');
    }
  };


  return (
    <div className={styles.reportContainer}>
      <FileDropZone
        id="drop3"
        title="Report"
        Icon={FileText}
        description="Upload the JSON file for seeing the report."
        acceptedTypes={['json']}
      />
    </div>

  );
}