"use client";
import React, { useEffect, useMemo, useRef, useState } from 'react'
import './TaskManagement.css'
import useNNTrustStore from '@/store/nnTrustStore'
import { AppWindowIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { BenchmarkDataProps, ReportAttacksProps } from '@/interfaces/reportInterfaces';
import { benchmarkFetch_get, jobProgress_get, reportFetch_get } from '@/properties/urlsNNTrust';
import HeaderPageTask from '@/components/client/utils/HeaderPageTask';
import ManagementTable from './ManagementTable';
import { getStatusIcon } from './utils';
import { AttackManagementProps } from '@/interfaces/NNInterfaces';

const TaskManagement: React.FC = () => {
    const {
        setAttackReport: setReport,
        setBenchmark,
        benchmarkId,
    } = useNNTrustStore()

    const [listExecutedAttacks, setListExecutedAttacks] = useState<AttackManagementProps[]>([]);
    const [description, setDescription] = useState<string>('');

    // getting the advancement status from the job, starting from the id
    const handleRefresh = async () => {
        if (!benchmarkId) {
            console.log("No benchmark ID available");
            return;
        }

        try {
            const response = await fetch(`${jobProgress_get}?id=${encodeURIComponent(benchmarkId)}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to get jobs ids from the backend: ${response.status}`);
            }

            const listAttacks: AttackManagementProps[] = await response.json();
            console.log("Fetched attacks:", listAttacks);
            setListExecutedAttacks(listAttacks);
        } catch (error) {
            console.error("Error fetching job progress:", error);
        }
    };

    useEffect(() => {
        const timer = setInterval(handleRefresh, 3000);
        return () => clearInterval(timer);
    }, [benchmarkId]);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    const [attackStates, setAttackStates] = useState<{ [key: string]: number }>({})
    const [isDisabled, setIsDisabled] = useState<boolean>(false)

    useEffect(() => {
        const status = {
            "Completed": 0,
            "In Progress": 0,
            "Pending": 0,
            "Closed": 0
        };

        listExecutedAttacks.forEach((job: AttackManagementProps) => {
            status[job.status] = status[job.status] + 1;
        });

        setAttackStates(status);

        let notFinished = 0;
        if (listExecutedAttacks.length > 0) {
            notFinished = status["Pending"] + status["In Progress"];
            if (notFinished > 0) {
                setDescription(`It remains ${notFinished} to be finished.`);
            } else {
                setDescription("All jobs completed.");
            }
        } else {
            setDescription("No jobs have been executed");
        }

        // the report button is disabled if there are still jobs that are pending or in progress to be finished
        setIsDisabled((notFinished > 0 && listExecutedAttacks.length > 0) || listExecutedAttacks.length === 0);
    }, [listExecutedAttacks]);


    const router = useRouter()

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
        // fetching the report
        const reportFetch = await fetchResult<ReportAttacksProps>(`${reportFetch_get}?id=${encodeURIComponent(benchmarkId)}`);
        if (reportFetch) {
            setReport(reportFetch);
        }

        // fetching the benchmark
        const benchmarkFetch = await fetchResult<BenchmarkDataProps>(`${benchmarkFetch_get}?dataset=${benchmarkId}`);
        if (benchmarkFetch && benchmarkId) {
            setBenchmark({ [benchmarkId.toString()]: benchmarkFetch });
        }
        router.push("/pages/report/reportTITANN")
    }

    return (
        <div className="container-pages">
            {/* Header Part */}
            <HeaderPageTask
                Icon={AppWindowIcon}
                title="Job Status Management"
                descrition="Here it is possible to controll the advancement of all the vulnerabilities that have been executed in the Benchmark page."
                buttonprops={{
                    description: "Vulnerability Report",
                    isDisabled: isDisabled,
                    disabledDescription: description,
                    handleClick: handleClickReport
                }}
            />

            {/* Status Summary Cards */}
            <>
                <h3 style={{ margin: 0, padding: 0, color: "white" }}>Overview Jobs:</h3>
                <div className="container-cards">
                    {Object.entries(attackStates).map(([status, value]) => (
                        <div key={status} className="card-summary">
                            {getStatusIcon(status)}
                            <div>
                                <div style={{ fontSize: "0.8rem" }}>{status}:</div>
                                <span style={{ fontSize: "1.4rem", fontWeight: 700 }}>{value ? value : 0}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </>
            {/* Table Management */}
            <div>
                <h3 style={{ color: 'white' }}>Info Vulnerabilities</h3>
                <ManagementTable jobs={listExecutedAttacks}
                />
            </div>
        </div>
    );
}

export default TaskManagement