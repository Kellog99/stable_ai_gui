"use client";

import Config from "@/components/client/metrics/Config";
import { Box } from "@mantine/core";
import classes from "../../datasets/page.module.css"
import { FileText } from "lucide-react";
import HeaderPageTask from "@/components/client/utils/HeaderPageTask";


export default function Completeness() {


    return (
        <>
        {/*
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
            */}
            <HeaderPageTask
                Icon={FileText}
                title="Completeness Evaluation"
                descrition="Here you can check the adherence of your dataset to some specific textual requirements."
            />
            <Config metricName="completeness" />
        </>
    )
}