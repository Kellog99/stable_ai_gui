"use client"

import FileDropZone from "@/components/client/upload/FileDropZone";
import styles from '@/styles/HomePage.module.css';
import { File, HardDrive, Upload } from "lucide-react";
import { infoModel } from "@/components/client/upload/config";

import { DragDrop } from "@/components/client/upload/DragDrop";
import { ButtonProps } from "@/interfaces/homePageInterface";
import { useEffect, useState } from "react";
import { getModelsReport } from "@/functionalities/NNTrustBackendUtils";
import FileRepository from "@/components/client/repository/FileRepository";
import useNNTrustStore from "@/store/nnTrustStore";
import { BenchmarkDataProps, DQReportProps } from "@/interfaces/reportInterfaces";
import { ReportProps } from "@/functionalities/reportInterfaces";
import useStore from "@/store/dsStore";
import { useRouter } from "next/navigation";

export default function ReportPage() {

  const [listAttacksReport, setListAttacksReport] = useState<ReportProps[]>([])
  const [listDatasetsReport, setListDatasetsReport] = useState<DQReportProps[]>([])

  const {
    attackReport,
    setAttackReport,
    setBenchmark,
  } = useNNTrustStore()

  const {
    report,
    setReport,
  } = useStore()


  // ################## Reports' list ##################
  useEffect(() => {
    getModelsReport()
      .then(setListAttacksReport)
      .catch(err => console.error("Failed to load attacks:", err));

  }, [setListAttacksReport]);

  // ################## Benchmarking ##################  
  useEffect(() => {
    if (!listAttacksReport) return;

    const benchmarkData: { [key: string]: BenchmarkDataProps } = {};

    listAttacksReport.forEach((report: ReportProps) => {
      if (!report?.info?.name) return; // skip if id is missing


      benchmarkData[report.info.name] = {
        name: report.info.name,
        param: report.info.parameters,
        task: report.info.task,
        metrics: Object.fromEntries(
          Object.entries(report.metrics).filter(([metric, value]) => metric !== "confusionmatrix")),
      };
    });

    setBenchmark(benchmarkData);
  }, [listAttacksReport]);

  // ################# router ################# 
  const router = useRouter()

  const btnReport: ButtonProps[] = [
    {
      id: "report",
      name: "Upload report",
      Icon: Upload,
      child: <DragDrop
        name={"File"}
        Icon={File}
        acceptedType={"json"}
        description={'Upload the JSON file related to the report.'}
        onFileSelect={() => { }}
      />,
    },
    {
      id: "repo-model-report",
      name: "Repository Model",
      Icon: HardDrive,
      child: <FileRepository
        elements={listAttacksReport}
        selectHandle={(report: ReportProps) => {
          setAttackReport(report);
          router.push("./reportTITANN")
        }}
        activeId={attackReport?.id}
        handleDelete={(report: ReportProps) => {
          setListAttacksReport(listAttacksReport.filter(reportContained => reportContained.id !== report?.id))
        }} />,
    },
    {
      id: "repo-dataset-report",
      name: "Repository Dataset",
      Icon: HardDrive,
      child: <FileRepository
        elements={listDatasetsReport}
        selectHandle={(dataset: DQReportProps) => {
          setReport(dataset);
          router.push("./reportDQ")
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
          key={"report"}
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