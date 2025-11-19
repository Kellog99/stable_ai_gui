import { useThumbnailWS } from "@/functionalities/useThumbnailWS";
import { ReportProps } from "@/interfaces/reportInterfaces";
import { DQReportProps } from "@/functionalities/reportInterfaces";
import { image_type } from "@/properties/types";
import useStore from "@/store/dsStore";
import useNNTrustStore from "@/store/nnTrustStore";
import "./JsonRepository.css"
import { Bug, Cpu, Database } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

interface ReportCardProps {
    reportNN?: ReportProps;
    reportDQ?: DQReportProps;
}

// This componentshas the role to produce the cards for the reports' repositories.
// The TITANN and DQ report's abstract have the same structure
export default function ReportCard({ reportNN, reportDQ }: ReportCardProps) {

    const setReportFromBE = useStore((state) => state.setReportFromBE)

    const setReport = useNNTrustStore((state) => state.setReport)
    const router = useRouter()

    const imageDatas = reportNN?.prototype || reportDQ?.dataset.prototype.datas[0];


    const { thumbnails, connectionStatus, requestThumbnail } = useThumbnailWS(
        image_type,
        imageDatas as string
    );
    requestThumbnail(imageDatas as string)


    const handleClick = () => {
        if (reportNN) {
            setReport(reportNN as ReportProps)
            router.push("/pages/report/reportTITANN")
        } else if (reportDQ) {
            console.log("REPORTDQ CLICK", reportDQ)
            setReportFromBE(reportDQ as DQReportProps)
            router.push("/pages/report/reportDQ")
        }
    }

    return (
        <>
            <div className="card" onClick={handleClick}>
                {reportNN ? (
                    <div className="networkName">
                        <h3>{reportNN.info.name}</h3>
                    </div>
                ) : (reportDQ && (
                    <div className="networkName">
                        <h3>{reportDQ.dataset.name}</h3>
                    </div>)
                )}

                <div className="cardSides">
                    <div className="left">
                        <div className="networkImage">
                            <img
                                src={thumbnails.get(imageDatas as string)}
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
                                {reportNN ? (
                                    <>
                                        <div>
                                            <span className="subtitlePanel">Dataset:</span>
                                            {reportNN.dataset}
                                        </div>
                                        <div>
                                            <span className="subtitlePanel">Classes:</span>
                                            {reportNN.info.classes}
                                        </div>
                                    </>

                                ) : reportDQ && reportDQ.dataset.task === "classification" ? (
                                    <div>
                                        <span className="subtitlePanel">Classes:</span>
                                        {reportDQ.dataset.n_classes}
                                    </div>
                                ) : null}

                                {reportNN ? (
                                    <div>
                                        <span className="subtitlePanel">Params:</span> {reportNN.info.parameters}
                                    </div>) : (reportDQ &&
                                        <div>
                                            <span className="subtitlePanel">Samples:</span> {reportDQ.dataset.n_samples}
                                        </div>)}

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

                            {(reportNN?.metrics) ? (
                                Object.entries(reportNN?.metrics)
                                    .filter(([key]) => key !== "params" && key !== "confusion_matrix" && key !== "total benchmarks")
                                    .map(([key, value]) => (
                                        <div key={key}>
                                            <span className="subtitlePanel">{key}:</span> {value.toFixed(2)}
                                        </div>
                                    ))) : (
                                reportDQ &&
                                reportDQ.metrics.map((metric, index) => (
                                    <div key={index}>
                                        <span className="subtitlePanel">{metric.results.name}:</span> {metric.results.score.toFixed(2)}
                                    </div>
                                ))
                            )
                            }
                        </div>
                    </div>

                    {reportNN &&
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
                    }

                </div>

            </div>
        </>
    )
}