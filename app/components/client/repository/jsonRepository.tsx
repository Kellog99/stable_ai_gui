import "./JsonRepository.css"
import React, { useEffect, useState } from "react";
import ReportCard from "./ReportCard";
import { getReports } from "@/functionalities/TITANNServices/get_info";
import { AlertCust } from "../AlertCustom";
import useBackendVariablesStore from "@/store/globalStore";

export const JsonRepository: React.FC = () => {
    const [NNReports, setNNReports] = useState<any[]>([]);
    const { hostname, port } = useBackendVariablesStore();

    useEffect(() => {
        const fetchNNReport = async () => {
            try {
                const NNreports = await getReports(hostname, port);
                setNNReports(NNreports);
            } catch (error) {
                console.error("Failed to fetch NN reports:", error);
            }
        };
        fetchNNReport();
    }, [hostname, port]);


    return (
        <>

            <div className="cardsContainer">
                {NNReports.length === 0 && <AlertCust result={"warning"} textToDisplay={"No reports found"} />}
                {NNReports.map((model, key) => (
                    <ReportCard key={key} reportNN={model} />
                ))}

            </div>

        </>
    )
}
