import { LoadedFile } from "@/app/types";
import { useState } from "react";
import { Eye, Trash2, FileText } from 'lucide-react';
import FileDropZone from "@/app/components/FileDropZone";
import './ReportPage.css';


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
    <div className="report-container">
      {/* Header */}
      <div className="report-header">
        <h1 className="report-title">
          Report Center
        </h1>
        <p className="report-subtitle">
          Upload and manage your analysis reports
        </p>
      </div>

      {/* File Management */}
      {reportFiles.length > 0 && (
        <div className="files-section">
          <h2 className="files-title">Loaded Files</h2>
          <div className="files-grid">
            {reportFiles.map((file, index) => (
              <div key={index} className="file-item">
                <div className="file-info">
                  <FileText className="file-icon" />
                  <span className="file-name">{file.name}</span>
                </div>
                <div className="file-actions">
                  <button
                    onClick={() => handleShowData(index)}
                    className="action-button view-button"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View</span>
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="action-button delete-button"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}


    </div>
  );
}