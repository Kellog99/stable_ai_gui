"use client";

import Config from "@/components/client/metrics/Config";
import { Box } from "@mantine/core";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import classes from "../../datasets/page.module.css"
import { FileText } from "lucide-react";


export default function Completeness() {
    const searchParams = useSearchParams();
    const [datasetName, setDatasetName] = useState<string | null>("")
    useEffect(() => {
        if (searchParams.get("datasetName")) {
            setDatasetName(searchParams.get("datasetName"))
        }
    }, [searchParams])

    return (
        <>
            <Box
                className={classes.title}
                style={{ display: "flex", flexDirection: "column", gap: "0px" }}
            >
                <div className={classes.datasetHeader}>
                    <FileText  className={classes.iconDatabase} />
                    <h1 className={classes.datasetTitle}>
                        Completeness Evaluation
                    </h1>
                </div>
                <div className={classes.datasetDivider}></div>
            </Box>
            <Config metricName="completeness" />
        </>
    )
}