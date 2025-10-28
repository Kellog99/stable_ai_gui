"use client"

import FileDropZone from "@/components/client/FileDropZone";
import styles from '@/styles/HomePage.module.css';
import { Database, Upload } from "lucide-react";
import { DragDrop } from "@/components/client/upload/UploaderUnifiedDragDrop";
import { uploadModel, uploadModel_check } from "@/properties/urls";
import { getModels } from "@/functionalities/NNTrustBackendUtils";
import { ModalUploadModel } from "@/components/client/upload/ModalUploadModel";
import { JsonRepository } from "@/components/client/ReportCard";


export default function ReportPage() {

  const ReportDragDrop = () => {
    return (
      <DragDrop
        config={{
          name: "report",
          fileType: 'json',
          accept: 'application/json',
          formFieldName: "file",
          description: 'Make sure your json contains a file.',
          uploadUrlCheck: uploadModel_check, // DA MODIFICARE
          uploadUrl: uploadModel, // DA MODIFICARE
          refreshFunction: getModels, // DA MODIFICARE
          setRefreshData: getModels // DA MODIFICARE

        }}
        infoModal={<ModalUploadModel />} />) // DA MODIFICARE
  }

  const dropElement = [
    {
      id: "json",
      title: "Upload Json",
      Icon: Upload,
      child: ReportDragDrop
    },
    {
      id: "reportRepo",
      title: "Report Repository",
      Icon: Database,
      child: JsonRepository   //questo deve diventare jsonRepository 
    }
  ];


  return (
    <div className={styles.reportContainer}>
      <FileDropZone
        sections={dropElement}
        defaultActiveSection={dropElement[0].id}
      />
    </div>

  );
}