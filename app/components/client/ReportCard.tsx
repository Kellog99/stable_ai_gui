import { useThumbnailWS } from "@/functionalities/useThumbnailWS";
import { ReportProps } from "@/interfaces/reportInterfaces";
import { image_type } from "@/properties/types";
import useNNTrustStore from "@/store/nnTrustStore";
import styles from "@/styles/JsonRepository.module.css"
import { Bug, Cpu, Database } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

interface ReportCardProps {
    report: ReportProps;

}

export default function ReportCard({ report }: ReportCardProps) {

    const setReport = useNNTrustStore((state) => state.setReport)
    const router = useRouter()

    const handleClick = () => {
        setReport(report as ReportProps)
        router.push("/pages/report/reportTITANN")

    }

    //////////////// da modificare il servizio che riporta l'immagine del prototipo //////////////
    
    
    return (
        <>
            <div className={styles.card} onClick={handleClick}>

                <div className={styles.networkName}>
                    <h3>{report.info.name}</h3>
                </div>


                <div className={styles.cardSides}>
                    <div className={styles.left}>
                        <div className={styles.networkImage}>
                            <img
                                src={`data:image/jpeg;base64,${report.prototype}`}
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
                                    <span className={styles.subtitlePanel}>Dataset:</span>
                                    {report.dataset}
                                </div>
                                <div>
                                    <span className={styles.subtitlePanel}>Classes:</span>
                                    {report.info.classes}
                                </div>

                                <div>
                                    <span className={styles.subtitlePanel}>Params:</span> {report.info.parameters}
                                </div>

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
                            {(report.metrics) ? (
                                Object.entries(report.metrics)
                                    .filter(([key]) => key !== "params" && key !== "confusion_matrix" && key !== "total benchmarks")
                                    .map(([key, value]) => (
                                        <div key={key}>
                                            <span className={styles.subtitlePanel}>{key}:</span> {value.toFixed(2)}
                                        </div>
                                    ))) : null
                            }
                        </div>
                    </div>


                    <div className={styles.panel}>
                        <div className={styles.panelHeader}>
                            <Bug />
                            <h4>Attacks</h4>
                        </div>
                        <div className={styles.panelBody}>
                            {report.attacks && Object.keys(report.attacks).map((attackKey) => (
                                <div key={attackKey}>
                                    <span className={styles.subtitlePanel}>{attackKey}</span>
                                </div>
                            ))}
                        </div>
                    </div>


                </div>

            </div>
        </>
    )
}