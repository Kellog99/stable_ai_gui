import styles from "@/styles/JsonRepository.module.css"
import React, { useEffect, useState } from "react";
import ReportCard from "./ReportCard";
import { getReports } from "@/functionalities/NNTrustBackendUtils";
import { AlertCust } from "./AlertCustom";

export const JsonRepository = () => {

    const [NNReports, setNNReports] = useState<any[]>([]);
    useEffect(() => {
        const fetchNNReport = async () => {
            try {
                const NNreports = await getReports();
                console.log("reports from the backend", NNreports);
                setNNReports(NNreports);

            } catch (error) {
                console.error("Failed to fetch NN reports:", error);
            }
        };
        fetchNNReport();
    }, []);

    return (
        <>
            <div className={styles.cardsContainer}>

                {NNReports.length === 0 && <AlertCust result={"warning"} textToDisplay={"No reports found"} />}
                {NNReports.map((model, key) => (
                    <ReportCard key={key} report={model} />
                ))}

            </div>

        </>
    )
}