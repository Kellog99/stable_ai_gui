import { ModelReportProps } from "@/interfaces/reportInterfaces";
import useNNTrustStore from "@/store/nnTrustStore";
import "./JsonRepository.css"
import { Bug, Cpu, Database } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

interface ReportCardProps {
    reportNN: ModelReportProps;
}

// This component produces cards for the NNTrust report repository.
export default function ReportCard({ reportNN }: ReportCardProps) {

    const setReport = useNNTrustStore((state) => state.setModelReport)
    const router = useRouter()

    const handleClick = () => {
        setReport(reportNN)
        router.push("/pages/report/reportTITANN")
    }

    return (
        <>
            <div className="card" onClick={handleClick}>
                <div className="networkName">
                    <h3>{reportNN.info.name}</h3>
                </div>

                <div className="cardSides">
                    <div className="left">
                        <div className="networkImage">
                            <img
                                src={reportNN.info.image ?? undefined}
                                alt={`image`}
                                style={{
                                    width: "100%",
                                    objectFit: "contain",
                                    display: "block",
                                }}
                            />
                        </div>

                    </div>
                    <div className="right">

                        <div className="panel">
                            <div className="panelHeader">
                                <Database />
                                <h4>General</h4>
                            </div>
                            <div className="panelBody">
                                <div>
                                    <span className="subtitlePanel">Dataset:</span>
                                    {reportNN.info.dataset}
                                </div>
                                <div>
                                    <span className="subtitlePanel">Classes:</span>
                                    {reportNN.info.num_classes}
                                </div>
                                <div>
                                    <span className="subtitlePanel">Params:</span> {reportNN.info.parameters}
                                </div>

                            </div>
                        </div>

                    </div>
                </div>

                <div className="cardFooter">
                    <div className="panel">
                        <div className="panelHeader">
                            <Cpu />
                            <h4>Metrics</h4>
                        </div>
                        <div className="panelBody">

                            {Object.entries(reportNN.metrics)
                                .filter(([key]) => key !== "params" && key !== "confusion_matrix" && key !== "total benchmarks")
                                .filter((entry): entry is [string, number] => typeof entry[1] === "number")
                                .map(([key, value]) => (
                                    <div key={key}>
                                        <span className="subtitlePanel">{key}:</span> {value.toFixed(2)}
                                    </div>
                                ))}
                        </div>
                    </div>

                    <div className="panel">
                            <div className="panelHeader">
                                <Bug />
                                <h4>Attacks</h4>
                            </div>
                            <div className="panelBody">
                                {reportNN.attacks && Object.keys(reportNN.attacks).map((attackKey) => (
                                    <div key={attackKey}>
                                        <span className="subtitlePanel">{attackKey}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

            </div>
        </>
    )
}
