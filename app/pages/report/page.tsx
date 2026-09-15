"use client"

import FileSelectionPanel from "@/components/client/repository/FileSelectionPanel";
import styles from '@/styles/HomePage.module.css';
import { File } from "lucide-react";
import { infoModel } from "@/components/client/repository/config";

import {InfoProps} from "@/interfaces/homePageInterface";
import { useEffect, useState } from "react";
import { getCoreElements } from "@/functionalities/TITANNServices/get_info";
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
    setModelReport,
  } = useNNTrustStore()

  const [modelsReports, setModelsReports] = useState<ModelReportProps[]>([])

  // ################## Reports' list ##################
  useEffect(() => {
    getCoreElements(
      hostname,
      port,
      "path_model_report_repo",
      "report_model"
    )
      .then((modelReportList) => setModelsReports(modelReportList as ModelReportProps[]))
  }, [setModelsReports, hostname, port]);

  // ################# router ################# 
  const router = useRouter()



  return (
    <div className={styles.test_container}>
      <div className={styles.upload_container}>
        <FileSelectionPanel
          key="report_loader"
          title="Report"
          elements={modelsReports.map((report) => report.info)}
          description="Drag and drop the JSON of the report."
          Icon={File}
          fileDropInformation={infoModel}
          handleSelection={(report) => {
            const selectedReport: ModelReportProps | undefined = modelsReports.find(value => value.info.id === (report as InfoProps).id);
            if (selectedReport) {
              setModelReport(selectedReport);
              router.push("/pages/report/reportTITANN");
            }
          }}
          repositoryType="model"
        />
      </div>
    </div>

  );
}
