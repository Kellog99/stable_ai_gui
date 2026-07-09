"use client"

import FileDropZone from "@/components/client/upload/FileDropZone";
import styles from '@/styles/HomePage.module.css';
import { File, HardDrive, Upload } from "lucide-react";
import { infoModel } from "@/components/client/upload/config";

import { DragDrop } from "@/components/client/upload/DragDrop";
import { ButtonProps, InfoProps, ModelInfo } from "@/interfaces/homePageInterface";
import { useEffect, useState } from "react";
import { getCoreElements } from "@/functionalities/TITANNServices/get_info";
import FileRepository from "@/components/client/repository/FileRepository";
import useNNTrustStore from "@/store/nnTrustStore";
import { ModelReportProps } from "@/interfaces/reportInterfaces";
import { useRouter } from "next/navigation";
import useBackendVariablesStore from "@/store/globalStore";

export default function ReportPage() {

  const {
    hostname,
    port
  } = useBackendVariablesStore()

  const {
    modelReport,
    setModelReport: setAttackReport,
  } = useNNTrustStore()

  const [modelsReports, setModelsReports] = useState<ModelReportProps[]>([])

  // ################## Reports' list ##################
  useEffect(() => {
    getCoreElements(
      hostname,
      port,
      "path_model_report_repo",
      "report.json"
    )
      .then((modelReportList) => setModelsReports(modelReportList as ModelReportProps[]))
  }, [setModelsReports, hostname, port]);

  // ################# router ################# 
  const router = useRouter()



  return (
    <div className={styles.test_container}>
      <div className={styles.upload_container}>
        <FileDropZone
          key="report_loader"
          id="report_loader"
          title="Report"
          elements={modelsReports.map((report) => report.info)}
          description="Drag and drop the JSON of the report."
          Icon={File}
          fileDropInformation={infoModel}
          handleSelection={(report) => {
            const selectedReport: ModelReportProps | undefined = modelsReports.find(value => value.info.id === (report as InfoProps).id);
            if (selectedReport) {
              setAttackReport(selectedReport);
              router.push("/pages/report/reportTITANN");
            }
          }}
          handleDeletion={(report) => {
            const reportId: string = (report as ModelInfo).id;
            setModelsReports(modelsReports.filter(reportContained => (reportContained as ModelReportProps).info.id !== reportId));
          }}
          handleFileUpload={(file: File | null) => {
            if (file) {
              // uploadReport(file)
              //   .then(setAttackReport)
              //   .then(() => router.push("/pages/report/reportTITANN"))
            }
          }} />
      </div>
    </div>

  );
}