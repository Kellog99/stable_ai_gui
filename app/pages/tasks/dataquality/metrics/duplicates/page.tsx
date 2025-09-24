"use client";

import Config from "@/components/client/metrics/Config";
import { Box, Title } from "@mantine/core";
import { Copy } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import classes from "../../datasets/page.module.css"


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
                    <Copy className={classes.iconDatabase} />
                    <h1 className={classes.datasetTitle}>
                        Duplicates Evaluation
                    </h1>
                </div>
                <div className={classes.datasetDivider}></div>

            </Box>

            <Config metricName="duplicates" />
        </>
    )
}