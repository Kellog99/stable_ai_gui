"use client";

import Config from "@/components/client/metrics/Config";
import classes from "../../datasets/page.module.css"
import { Box } from "@mantine/core";
import { ChartScatter } from "lucide-react";


export default function Duplicates() {

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