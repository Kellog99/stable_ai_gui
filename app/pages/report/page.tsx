"use client"

import FileDropZone from "@/components/client/upload/FileDropZone";
import styles from '@/styles/HomePage.module.css';
import { File, HardDrive, Upload } from "lucide-react";
import { infoModel } from "@/components/client/upload/config";
import { DragDrop } from "@/components/client/upload/DragDrop";
import { ButtonProps } from "@/interfaces/homePageInterface";
import { useEffect, useState } from "react";
import FileRepository from "@/components/client/repository/FileRepository";
import { DQReportProps } from "@/interfaces/reportInterfaces";
import useStore from "@/store/dsStore";
import { useRouter } from "next/navigation";
import { getAllDQReports } from "@/functionalities/BackendUtils";
import { uploadJsonReport_DQ } from "@/properties/urls";

export default function ReportPage() {


  const [listDatasetsReport, setListDatasetsReport] = useState<DQReportProps[]>([])
  const [file, setFile] = useState<File | null>(null);

  const {
    report,
    setReport,
  } = useStore()


  useEffect(() => {
    getAllDQReports()
      .then(setListDatasetsReport)
      .catch(err => console.error("Failed to load attacks:", err));
  }, []);

  console.log("listDatasetsReport ", listDatasetsReport)

  const router = useRouter()

  const handleReportUpload = async (selectedFile: File) => {
    if (!selectedFile) {
      console.log("No file Selected")
      return;
    }

    let body: BodyInit;
    let headers: HeadersInit = {};

    try {

      const formData = new FormData();
      formData.append("request", selectedFile);
      body = formData;

      const response = await fetch(uploadJsonReport_DQ, {
        method: 'POST',
        headers,
        body,
      });

      const data = await response.json();

      if (response.ok) {
        setFile(data);
      } else {
        console.log("Something went wrong:", data.message);
      }

    } catch (error) {
      console.error('Error uploading:', error);
    } finally {
      getAllDQReports()
        .then(setListDatasetsReport)
        .catch(err => console.error("Failed to load attacks:", err));
    }
  };

  const btnReport: ButtonProps[] = [
    {
      id: "dragDropReport",
      name: "Upload report",
      Icon: Upload,
      child: <DragDrop
        name={"File"}
        Icon={File}
        acceptedType={"application/json"}
        description={'Upload the JSON file related to the report.'}
        onFileUpload={(file) => { return handleReportUpload(file as File); }}
      />,
    },
    {
      id: "repoDatasetReport",
      name: "Repository Dataset",
      Icon: HardDrive,
      child: <FileRepository
        elements={listDatasetsReport}
        selectHandle={(report: DQReportProps) => {
          setReport(report);
          router.push("/pages/report/reportDQ")
        }}
        activeId={report?.id}
        handleDelete={(report) => {
          setListDatasetsReport(listDatasetsReport.filter(datasetContained => datasetContained.id !== report.id))
        }} />,
    },
  ]

  return (
    <div className={styles.test_container}>
      <div className={styles.upload_container}>
        <FileDropZone
          id="report_loader"
          title="Report"
          description="Drag and drop the JSON of the report."
          Icon={File}
          fileDropInformation={infoModel}
          buttons={btnReport}
        />
      </div>
    </div>

  );
}