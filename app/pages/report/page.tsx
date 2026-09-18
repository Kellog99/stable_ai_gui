"use client"

import FileRepository from "@/components/client/repository/FileRepository";
import styles from '@/styles/HomePage.module.css';
import {File} from "lucide-react";
import {infoModel} from "@/components/client/repository/config";

import {useEffect, useState} from "react";
import {getCoreElements} from "@/functionalities/TITANNServices/get_info";
import useNNTrustStore from "@/store/nnTrustStore";
import {ModelReportProps} from "@/interfaces/reportInterfaces";
import {useRouter} from "next/navigation";
import useBackendVariablesStore from "@/store/globalStore";

export default function ReportPage() {

    const {
        hostname,
        port
    } = useBackendVariablesStore()

    const {
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
            .then(
                (modelReportList) => setModelsReports(modelReportList as ModelReportProps[])
            )
    }, [setModelsReports, hostname, port]);

    // ################# router #################
    const router = useRouter()
    console.log(modelsReports.map((rep)=>rep.id))


    return (
        <div className={styles.test_container}>
            <div className={styles.upload_container}>
                <FileRepository
                    key="report_loader"
                    title="Report"
                    elements={modelsReports}
                    description="Drag and drop the JSON of the report."
                    Icon={File}
                    fileDropInformation={infoModel}
                    handleSelection={(report: ModelReportProps | null) => {
                        if (report) {
                            setModelReport(report);
                            router.push("/pages/report/reportTITANN");
                        }
                    }}
                    repositoryType="model"
                />
            </div>
        </div>

    );
}
