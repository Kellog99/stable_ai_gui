import { useThumbnailWS } from "@/functionalities/useThumbnailWS";
import { DQReportProps, ReportProps } from "@/interfaces/reportInterfaces";
import { image_type } from "@/properties/types";
import useNNTrustStore from "@/store/nnTrustStore";
import styles from "@/styles/JsonRepository.module.css"
import { Bug, Cpu, Database } from "lucide-react";
import { useRouter } from "next/navigation";
import { report } from "node:process";
import React from "react";

interface ReportCardProps {
    reportNN?: ReportProps;
    reportDQ?: DQReportProps;
}

export default function ReportCard({ reportNN, reportDQ }: ReportCardProps) {



    const setReport = useNNTrustStore((state) => state.setReport)
    const router = useRouter()

    const imageDatas = reportNN?.image || reportDQ?.dataset.prototype.datas[0];

    console.log("imagedata", imageDatas)

    const { thumbnails, connectionStatus, requestThumbnail } = useThumbnailWS(
        image_type,
        imageDatas as string
    );
    requestThumbnail(imageDatas as string)


    const handleClick = () => {
        //reportName può essere o l'ID per i report di nntrust oppure il nome del dataset per dq
        if (reportNN) {
            setReport(reportNN as ReportProps)
            router.push("/pages/report/reportTITANN")
        } else if (reportDQ) {
            router.push("/pages/report/reportDQ")
        }
    }

    return (
        <>
            <div className={styles.card} onClick={handleClick}>
                {reportNN ? (
                    <div className={styles.networkName}>
                        <h3>{reportNN.info.name} on {reportNN.info.dataset}</h3>
                    </div>
                ) : (reportDQ && (
                    <div className={styles.networkName}>
                        <h3>{reportDQ.dataset.name}</h3>
                    </div>)
                )}

                <div className={styles.cardSides}>
                    <div className={styles.left}>
                        <div className={styles.networkImage}>
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
                    <div className={styles.right}>

                        <div className={styles.panel}>
                            <div className={styles.panelHeader}>
                                <Database />
                                <h4>General</h4>
                            </div>
                            <div className={styles.panelBody}>
                                <div>
                                    <span className={styles.subtitlePanel}>Task:</span>
                                    {reportNN ? reportNN.info.task : reportDQ?.dataset.task}
                                </div>

                                {reportNN ? (
                                    <div>
                                        <span className={styles.subtitlePanel}>Classes:</span>
                                        {reportNN.info.classes}
                                    </div>
                                ) : reportDQ && reportDQ.dataset.task === "classification" ? (
                                    <div>
                                        <span className={styles.subtitlePanel}>Classes:</span>
                                        {reportDQ.dataset.n_classes}
                                    </div>
                                ) : null}

                                {reportNN ? (
                                    <div>
                                        <span className={styles.subtitlePanel}>Params:</span> {reportNN.info.parameters}
                                    </div>) : (reportDQ &&
                                        <div>
                                            <span className={styles.subtitlePanel}>Samples:</span> {reportDQ.dataset.n_samples}
                                        </div>)}

                            </div>
                        </div>

                    </div>
                </div>

                <div className={styles.cardFooter}>
                    <div className={styles.panel}>
                        <div className={styles.panelHeader}>
                            <Cpu />
                            <h4>Metrics</h4>
                        </div>
                        <div className={styles.panelBody}>

                            {(reportNN?.metrics) ? (
                                Object.entries(reportNN?.metrics)
                                    .filter(([key]) => key !== "params" && key !== "confusion_matrix")
                                    .map(([key, value]) => (
                                        <div key={key}>
                                            <span className={styles.subtitlePanel}>{key}:</span> {value}
                                        </div>
                                    ))) : (
                                reportDQ &&
                                reportDQ.metrics.map((metric, index) => (
                                    <div key={index}>
                                        <span className={styles.subtitlePanel}>{metric.results.name}:</span> {metric.results.score.toFixed(2)}
                                    </div>
                                ))
                            )
                            }
                        </div>
                    </div>

                    {reportNN && 
                    <div className={styles.panel}>
                        <div className={styles.panelHeader}>
                            <Bug />
                            <h4>Attacks</h4>
                        </div>
                        <div className={styles.panelBody}>
                            {reportNN.attacks && Object.keys(reportNN.attacks).map((attackKey) => (
                                <div key={attackKey}>
                                    <span className={styles.subtitlePanel}>{attackKey}</span>
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