"use client"

import FileDropZone from "@/components/client/upload/FileDropZone";
import styles from '@/styles/HomePage.module.css';
import { File, HardDrive, Upload } from "lucide-react";
import { infoModel } from "@/components/client/upload/config";

import { DragDrop } from "@/components/client/upload/DragDrop";
import { ButtonProps } from "@/interfaces/homePageInterface";
import { useEffect, useState } from "react";
import { getReports, uploadReport } from "@/functionalities/NNTrustBackendUtils";
import FileRepository from "@/components/client/repository/FileRepository";
import useNNTrustStore from "@/store/nnTrustStore";
import { DQReportProps, infoProps, ReportAttacksProps } from "@/interfaces/reportInterfaces";
import { ReportProps } from "@/functionalities/reportInterfaces";
import useStore from "@/store/dsStore";
import { useRouter } from "next/navigation";
import { getListDatasetsReport, getListModelsReport, uploadRepo } from "@/properties/urlsNNTrust";
import { getAllDQReports } from "@/functionalities/BackendUtils";

export default function ReportPage() {

  const [listAttacksReport, setListAttacksReport] = useState<ReportAttacksProps[]>([])
  const [listDatasetsReport, setListDatasetsReport] = useState<DQReportProps[]>([])

  const {
    attackReport,
    setAttackReport,
  } = useNNTrustStore()

  const {
    report,
    setReport,
  } = useStore()


  // ################## Reports' list ##################
  //useEffect(() => {
  //  getReports(getListModelsReport)
  //    .then(setListAttacksReport)
  //    .catch(err => console.error("Failed to load attacks:", err));
  //}, [setListAttacksReport]);

  useEffect(() => {
    getAllDQReports()
      .then(setListDatasetsReport)
      .catch(err => console.error("Failed to load attacks:", err));
  }, []);

  console.log("listDatasetsReport ", listDatasetsReport)

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
            uploadReport(uploadRepo, file)
              .then(setAttackReport)
              .then(() => router.push("/pages/report/reportTITANN"))
          }
        }}
      />,
    },
    {
      id: "repoModelReport",
      name: "Repository Model",
      Icon: HardDrive,
      child: <FileRepository
        elements={listAttacksReport.map(element => element.info)}
        selectHandle={(report: infoProps) => {
          const selectedReport: ReportAttacksProps | undefined = listAttacksReport.find(value => value.info.id === report.id)
          if (selectedReport) {
            setAttackReport(selectedReport)
            router.push("/pages/report/reportTITANN")
          }
        }}
        activeId={attackReport?.info.id}
        handleDelete={(report: ReportProps) => {
          setListAttacksReport(listAttacksReport.filter(reportContained => reportContained.id !== report?.id))
        }} />,
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