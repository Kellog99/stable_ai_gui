"use client";
import React, { useEffect, useState } from 'react'
import './TaskManagement.css'
import useNNTrustStore from '@/store/nnTrustStore'
import { useRouter } from 'next/navigation';
import { BenchmarkDataProps, ReportProps } from '@/interfaces/reportInterfaces';
import { getStatusIcon, statuses } from './utils';
import ManagementTable from './ManagementTable';
import { AppWindowIcon } from 'lucide-react';
import HeaderPageTask from '@/components/client/utils/HeaderPageTask';


const TaskManagement: React.FC = () => {
    const { setReport, setBenchmark, executedAttacks } = useNNTrustStore()
    const [attackStates, setAttackStates] = useState<{ [key: string]: number }>({});
    const [isDisabled, setIsDisabled] = useState<boolean>(true)
    const [description, setdescription] = useState<string>("")

    // Convert Set to Array whenever executedAttacks changes
    useEffect(() => {
        const recap = Object.fromEntries(
            statuses.map(status => [
                status,
                executedAttacks.filter(job => job.status === status).length
            ])
        )
        setAttackStates(recap)
        let notFinished = 0
        if (executedAttacks.length > 0) {
            notFinished = recap["Pending"] + recap["In Progress"]
            if (notFinished > 0) {
                setdescription(`It remains ${notFinished} to be finished.`)
            }
        }
        else {
            setdescription("No jobs have been executed")
        }
        // the report button is disable if there are still jobs that are pending or in progress to be finished
        setIsDisabled((notFinished > 0 && executedAttacks.length > 0) || executedAttacks.length === 0)
        console.log("not finished = ", notFinished > 0 && executedAttacks.length > 0)
        console.log("is disable = ", (notFinished > 0 && executedAttacks.length > 0) || executedAttacks.length === 0)
    }, [executedAttacks]);

    const router = useRouter()
    // handle click for going to the Report page
    const handleClickReport = async () => {
        // If the button is clickable then all the attacks are done and the JSON has been produced
        async function fetchResult<T>(url: string): Promise<T | undefined> {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error for the report JSON! Status: ${response.status}`);
                }
                const json: T = await response.json();
                return json;
            } catch (err) {
                console.log(err instanceof Error ? err.message : "An error occurred");
                return undefined; // Explicitly return undefined on error
            }
        }

        const reportFetch = await fetchResult<ReportProps>('http://127.0.0.1:8000/report/getReport');
        const benchmarkFetch = await fetchResult<BenchmarkDataProps>('http://127.0.0.1:8000/report/getBenchmark');
        if (reportFetch) {
            setReport(reportFetch);
        }
        if (benchmarkFetch) {
            console.log("saving = ", benchmarkFetch)
            setBenchmark(benchmarkFetch);
        }
        router.push("/pages/report/reportTITANN")
    }


    // ############## Polling the Benchmark status ##############
    const { setExecutedAttacks } = useNNTrustStore()
    const handleRefresh = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/attacks/benchmarkStatus');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`); // Fixed: parentheses, not backtick
            }
            const data = await response.json(); // Parse the response
            console.log("management ==", data)
            setExecutedAttacks(data)
        } catch (error) {
            console.error('ERROR:', error);
            return []; // Return empty array on error
        }
    }

    useEffect(() => {
        const timer = setInterval(handleRefresh, 6000);
        return () => clearInterval(timer);
    }, []);
    // ##########################################################

    return (
        <div className="container-pages">
            {/* Header Part */}
            <HeaderPageTask
                Icon={AppWindowIcon}
                title="Job Status Management"
                descrition="Here it is possible to controll the advancement of all the vulnerabilities that have been executed in the Benchmark page."
                buttonprops={{
                    description: "Vulnerability Report",
                    isDisabled: false,//isDisabled,
                    disabledDescription: description,
                    handleClick: handleClickReport
                }}
            />

            {/* Status Summary Cards */}
            <>
                <h3 style={{ margin: 0, padding: 0, color: "white" }}>Overview Jobs:</h3>
                <div className="container-cards">
                    {Object.entries(attackStates).map(([status, value]) => (
                        <div className="card-summary">
                            {getStatusIcon(status)}
                            <div >
                                <div style={{ fontSize: "0.8rem" }}>{status}:</div>
                                <span style={{ fontSize: "1.4rem", fontWeight: 700 }}>{value}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </>
            {/* Table Management */}
            <div >
                <h3 style={{ color: 'white' }}>Info Vulnerabilities</h3>
                <ManagementTable
                    jobs={executedAttacks}
                />
            </div>
        </div>
    );
}

export default TaskManagement