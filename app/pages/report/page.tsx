"use client"
import { useState } from "react";

import FileDropZone2 from "@/components/client/FileDropZone2";
import { LoadedFile } from "@/interfaces/NNInterfaces";
import styles from '@/styles/HomePage.module.css';
import { Database, Upload } from "lucide-react";
import { DragDrop } from "@/components/client/upload/UploaderUnifiedDragDrop";
import { uploadModel, uploadModel_check } from "@/properties/urls";
import { getModels } from "@/functionalities/NNTrustBackendUtils";
import { ModalUploadModel } from "@/components/client/upload/ModalUploadModel";
import { ModelRepository } from "@/components/client/ModelDisplayer";

interface ReportPageProps
{
  reportFiles: LoadedFile[];
  onFileSelect: ( file: File ) => void;
  onFileDelete: ( index: number ) => void;
}

export default function ReportPage ( { reportFiles, onFileSelect, onFileDelete }: ReportPageProps )
{

  const ReportDragDrop = () =>
    {
      return (
        <DragDrop
          config={ {
            name: "report",
            fileType: 'json',
            accept: 'application/json',
            formFieldName: "file",
            description: 'Make sure your json contains a file.',
            uploadUrlCheck: uploadModel_check, // DA MODIFICARE
            uploadUrl: uploadModel, // DA MODIFICARE
            refreshFunction: getModels, // DA MODIFICARE
            setRefreshData: getModels // DA MODIFICARE
  
          } }
          infoModal={ <ModalUploadModel /> } /> ) // DA MODIFICARE
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
      child: ModelRepository
    }
  ];


  return (
    <div className={ styles.reportContainer }>
      <FileDropZone2
        sections={ dropElement }
        defaultActiveSection={ dropElement[ 0 ].id }
      />
    </div>

  );
}