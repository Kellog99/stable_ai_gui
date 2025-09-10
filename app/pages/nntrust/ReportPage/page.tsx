"use client"
import { useState } from "react";
import { Eye, Trash2, FileText } from 'lucide-react';

import './ReportPage.css';
import { LoadedFile } from "@/interfaces/NNInterfaces";


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

  const handleDelete = (index: number) => {
    onFileDelete(index);
    if (selectedFileIndex === index) {
      setSelectedFileIndex(null);
      setJsonData(null);
    }
  };

  return (
    <div> ciao sto funzionando :)</div>
   
  );
}