"use client";

import Config from "@/components/client/metrics/Config";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import classes from "../../datasets/page.module.css"
import { Box } from "@mantine/core";
import { ChartScatter } from "lucide-react";


export default function Duplicates() {
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
                    <ChartScatter className={classes.iconDatabase} />
                    <h1 className={classes.datasetTitle}>
                        Outliers Evaluation
                    </h1>
                </div>
                <div className={classes.datasetDivider}></div>

            </Box>
            <Config metricName="outliers" />
        </>
    )
}