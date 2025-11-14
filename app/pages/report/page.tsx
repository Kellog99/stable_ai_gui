"use client"

import FileDropZone from "@/components/client/FileDropZone";
import styles from '@/styles/HomePage.module.css';
import { Database, Upload } from "lucide-react";
import { DragDrop } from "@/components/client/upload/UploaderUnifiedDragDrop";
import { JsonRepository } from "@/components/client/JsonRepository";
import { ModalUploadJson } from "@/components/client/upload/ModalUploadJson";



export default function ReportPage() {

  const dropElement = [
    {
      id: "json",
      title: "Upload Json",
      Icon: Upload,
      child: () =>
        <DragDrop
          config={{
            name: "report",
            fileType: 'json',
            accept: 'application/json',
            formFieldName: "request",
            description: 'Make sure your json contains a file.',
            uploadUrlCheck: "", 
            uploadUrl: "",
          }}
          infoModal={<ModalUploadJson />} />
    },
    {
      id: "NNreportRepo",
      title: "NNTrust Reports",
      Icon: Database,
      child: () => <JsonRepository tool="nntrust" />
    },
    {
      id: "DQreportRepo",
      title: "DQ Reports",
      Icon: Database,
      child: () => <JsonRepository tool="dq" />,
    },

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