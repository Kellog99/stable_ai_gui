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

  const [listAttacksReport, setListAttacksReport] = useState<ModelReportProps[]>([])

  const {
    hostname,
    port
  } = useBackendVariablesStore()

  const {
    modelReport: attackReport,
    setAttackReport,
  } = useNNTrustStore()


  // ################## Reports' list ##################
  useEffect(() => {
    getCoreElements(
      hostname,
      port,
      "path_model_report_repo",
      "report.json"
    )
      .then((modelReportList) => setListAttacksReport(modelReportList as ModelReportProps[]))
  }, [setListAttacksReport, hostname, port]);

  // ################# router ################# 
  const router = useRouter()

  // ################# Report's buttons ################# 
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
        onFileUpload={(file: File | null) => {
          if (file) {
            // uploadReport(file)
            //   .then(setAttackReport)
            //   .then(() => router.push("/pages/report/reportTITANN"))
          }
        }}
      />,
    },
    {
      id: "repoModelReport",
      name: "Repository Model",
      Icon: HardDrive,
      child: <FileRepository
        elements={listAttacksReport.map((attackReport) => attackReport.info)}
        selectHandle={(report) => {
          const selectedReport: ModelReportProps | undefined = listAttacksReport.find(value => value.info.id === (report as InfoProps).id)
          if (selectedReport) {
            setAttackReport(selectedReport)
            router.push("/pages/report/reportTITANN")
          }
        }}
        activeId={attackReport?.info.id}
        handleDelete={(report) => {
          const reportId: string = (report as ModelInfo).id
          setListAttacksReport(listAttacksReport.filter(reportContained => (reportContained as ModelReportProps).info.id !== reportId))
        }} />,
    }
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