import { DQReportProps } from "@/functionalities/reportInterfaces";
import "./JsonRepository.css"
import React, { useEffect, useState } from "react";
import ReportCard from "./ReportCard";
import { getAllDQReports } from "@/functionalities/DQServices/BackendUtils";
import { getReports } from "@/functionalities/TITANNServices/get_info";
import { AlertCust } from "../AlertCustom";


type JsonRepositoryProps = {
    tool: string;
};

export const JsonRepository: React.FC<JsonRepositoryProps> = ({ tool }) => {

    const [DQReports, setDQReports] = useState<DQReportProps[]>([]);
    const [NNReports, setNNReports] = useState<any[]>([]);

    useEffect(() => {
        if (tool === "dq") {
            const fetchDQReport = async () => {
                try {
                    const DQreports = await getAllDQReports();
                    console.log("reports from the backend", DQreports);
                    setDQReports(DQreports);

                } catch (error) {
                    console.error("Failed to fetch DQ reports:", error);
                }
            };
            fetchDQReport();

        } else if (tool === "nntrust") {
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
        }
    }, [tool]);


    return (
        <>

            <div className="cardsContainer">
                {tool == "nntrust" ? (
                    <>
                        {NNReports.length === 0 && <AlertCust result={"warning"} textToDisplay={"No reports found"} />}
                        {NNReports.map((model, key) => (
                            <ReportCard key={key} reportNN={model} />
                        ))}
                    </>
                ) : (
                    <>
                        {DQReports.length === 0 && <AlertCust result={"warning"} textToDisplay={"No reports found"} />}
                        {DQReports.map((dataset, key) => (
                            <ReportCard key={key} reportDQ={dataset as DQReportProps} />
                        ))}
                    </>
                )}

            </div>

        </>
    )
}