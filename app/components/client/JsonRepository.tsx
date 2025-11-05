import { DQReportProps} from "@/interfaces/reportInterfaces";
import useStore from "@/store/dsStore";
import useNNTrustStore from "@/store/nnTrustStore";
import styles from "@/styles/JsonRepository.module.css"


import React from "react";
import ReportCard from "./ReportCard";


type JsonRepositoryProps = {
    tool: string;
};

export const JsonRepository: React.FC<JsonRepositoryProps> = ({ tool }) => {

    const datasetUsed = useStore((state) => state.datasetUsed)
    const reportDQ = useStore((state) => state.report)
    const report = useNNTrustStore((state) => state.report)
    
    const modelProva = [{
        "tool": "nntrust",
        "image": "/home/roberta-stellino/Desktop/datasetRepo/animals/data/antelope/02f4b3be2d.jpg",
        "info": {
            "name": "ResNet50",
            "task": "classification",
            "dataset": "something",
            "parameters": 25557032,
            "classes": 10,
            "dimensionality": [224, 224, 3]
        },
        "metrics": {
            "params": 25557032,
            "accuracy": 0.9432,
            "precision": 0.9411,
            "f1score": 0.9420,
            "confusion_matrix": [
                [955, 2, 0, 1, 0, 0, 1, 0, 0, 1],
                [0, 1123, 1, 0, 0, 0, 1, 0, 0, 0],
                [2, 1, 1010, 2, 1, 0, 0, 3, 2, 1],
                [0, 0, 3, 994, 0, 3, 0, 1, 2, 1],
                [1, 1, 0, 0, 978, 0, 2, 0, 0, 0],
                [1, 0, 0, 4, 0, 880, 3, 0, 1, 0],
                [2, 2, 0, 0, 2, 3, 946, 0, 1, 0],
                [0, 1, 3, 0, 0, 0, 0, 1022, 1, 1],
                [1, 0, 1, 3, 2, 1, 0, 1, 950, 1],
                [1, 0, 1, 0, 0, 0, 0, 2, 1, 1004]
            ],
            "robustness": 0.812,
            "wobbliness": 0.034,
        },
        "attacks": {
            "FGSM": {
                "name": "Fast Gradient Sign Method",
                "risk": 0.65,
                "accuracy": 0.702,
                "precision": 0.698,
                "f1score": 0.701,
                "misclassification": 298,
                "power": 0.9,
                "num_queries": 1,
                "robustness": 0.74,
                "confusion_matrix": [
                    [895, 8, 12, 10, 3, 6, 9, 3, 1, 3],
                    [4, 1072, 7, 4, 2, 3, 6, 1, 1, 1],
                    [7, 5, 942, 10, 7, 4, 5, 11, 9, 5],
                    [3, 4, 11, 914, 6, 10, 2, 5, 13, 2],
                    [8, 2, 4, 4, 921, 3, 11, 2, 2, 3],
                    [9, 3, 5, 13, 6, 825, 11, 5, 8, 7],
                    [10, 8, 4, 2, 6, 7, 883, 2, 6, 2],
                    [3, 5, 13, 6, 2, 3, 1, 947, 9, 4],
                    [5, 3, 9, 7, 6, 6, 2, 9, 895, 8],
                    [4, 4, 6, 2, 4, 5, 2, 9, 7, 951]
                ]
            },
            "PGD": {
                "name": "Projected Gradient Descent",
                "risk": 0.85,
                "accuracy": 0.523,
                "precision": 0.518,
                "f1score": 0.520,
                "misclassification": 477,
                "power": 0.95,
                "num_queries": 40,
                "robustness": 0.56,
                "confusion_matrix": [
                    [802, 20, 35, 18, 6, 10, 24, 10, 7, 12],
                    [9, 978, 16, 11, 7, 5, 13, 3, 3, 2],
                    [22, 10, 861, 21, 15, 9, 10, 19, 16, 9],
                    [8, 11, 17, 874, 13, 12, 6, 10, 24, 9],
                    [11, 6, 9, 7, 874, 8, 14, 4, 5, 6],
                    [17, 8, 11, 21, 14, 768, 19, 12, 17, 9],
                    [21, 17, 9, 7, 15, 12, 856, 5, 11, 6],
                    [9, 8, 19, 9, 6, 6, 2, 901, 11, 7],
                    [13, 8, 15, 13, 12, 10, 7, 13, 842, 12],
                    [10, 6, 9, 8, 9, 6, 4, 11, 9, 890]
                ]
            }
        }
    },
    ]
    const datasetProva = [{
        "tool": "dq",
        "dataset": datasetUsed,
        "metrics": reportDQ

    },
    ]

    /////////QUA BISOGNA FARE LA CHIAMATA GETREPORT DAL BE E SETTARE I REPORT 


    console.log("datasetPROVA", datasetProva)
    console.log("REPORT FROM STORE", report)

    return (
        <>

            <div className={styles.cardsContainer}>
                {tool == "nntrust" ? (
                    <>
                        {modelProva.map((model, key) => (
                            <ReportCard key={key} reportNN={model} />
                        ))}
                    </>
                ) : (
                    <>
                        {datasetProva.map((dataset, key) => (
                            <ReportCard key={key} reportDQ={dataset as DQReportProps} />
                        ))}
                    </>
                )}

            </div>

        </>
    )
}