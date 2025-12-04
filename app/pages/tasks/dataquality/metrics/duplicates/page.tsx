"use client";

import Config from "@/components/client/metrics/Config";
import { Copy } from "lucide-react";
import classes from "../../datasets/page.module.css"
import HeaderPageTask from "@/components/client/utils/HeaderPageTask";

export default function Duplicates() {
    return (
        <>
            {/*
            <div
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

            </div>
            */}
            <HeaderPageTask
                Icon={Copy}
                title="Duplicates Evaluation"
                descrition="Here you can check the amount of duplicate samples in your dataset."
            />

            <Config metricName="duplicates" />
        </>
    )
}