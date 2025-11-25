"use client";
import React, { useEffect, useMemo, useRef, useState } from 'react'
import './TaskManagement.css'
import useNNTrustStore from '@/store/nnTrustStore'
import { AppWindowIcon, ArrowDownUp, CircleArrowRight, Search } from 'lucide-react';
import { HoverCard, Progress } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { BenchmarkDataProps, ReportProps } from '@/interfaces/reportInterfaces';
import useStore from '@/store/dsStore';
import { benchmarkFetch_get, getJobsProgress, reportFetch_get } from '@/properties/urlsNNTrust';
import HeaderPageTask from '@/components/client/utils/HeaderPageTask';
import ManagementTable from './ManagementTable';
import { statuses, getStatusIcon } from './utils';

const TaskManagement: React.FC = () => {
    const { setReport, setBenchmark, executedAttacks, setExecutedAttacks } = useNNTrustStore()
    const datasetName = useStore((state) => state.datasetUsed)?.name
    const [attackArray, setAttackArray] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [sortConfig, setSortConfig] = useState<{ key: string | null, direction: 'asc' | 'desc' }>({
        key: null,
        direction: 'asc'
    });

    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const benchmarkID = useNNTrustStore((state) => state.benchmarkID)
    console.log("id from management", benchmarkID)


    console.log("in benchmark ", executedAttacks)

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

    const handleSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const filteredAndSortedJobs = useMemo(() => {
        let filtered = attackArray.filter(job => {
            const jobName = typeof job === 'string' ? job : (job?.name || '');
            const jobStatus = typeof job === 'string' ? '' : (job?.status || '');
            const jobId = typeof job === 'string' ? job : (job?.id || '');

            const matchesSearch =
                jobName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                jobId.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
                jobStatus.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = statusFilter === 'All' || jobStatus === statusFilter;

            return matchesSearch && matchesStatus;
        });

        if (sortConfig.key) {
            filtered.sort((a, b) => {
                let aValue, bValue;

                if (typeof a === 'string' && typeof b === 'string') {
                    aValue = a;
                    bValue = b;
                } else {
                    aValue = a?.[sortConfig.key!] || '';
                    bValue = b?.[sortConfig.key!] || '';
                }

                if (sortConfig.key === 'id') {
                    const aNum = Number(aValue);
                    const bNum = Number(bValue);
                    if (!isNaN(aNum) && !isNaN(bNum)) {
                        return sortConfig.direction === 'asc' ? aNum - bNum : bNum - aNum;
                    }
                }

                if (aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }

        return filtered;
    }, [attackArray, searchTerm, statusFilter, sortConfig]);

    const [atkFinished, setAtkFinished] = useState<number>(0)
    useEffect(() => { setAtkFinished(executedAttacks.filter(job => job.status === "completed").length) }, [executedAttacks])

    console.log("atk finished =", atkFinished)

    const isDisabled = () => {
        return false
    }

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

        const reportFetch = await fetchResult<ReportProps>(`${reportFetch_get}?id=${encodeURIComponent(benchmarkID)}`);
        console.log("REPORT PROPS", reportFetch)
        if (reportFetch) {
            setReport(reportFetch);
        }

        const benchmarkFetch = await fetchResult<BenchmarkDataProps>(`${benchmarkFetch_get}?dataset=${datasetName}`);
        if (benchmarkFetch) {
            console.log("saving = ", benchmarkFetch)
            setBenchmark(benchmarkFetch);
        }
        router.push("/pages/report/reportTITANN")
    }



    const pollProgress = async () => {
        try {
            const url = `${getJobsProgress}?id=${encodeURIComponent(benchmarkID)}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Failed to fetch progress: ${response.statusText}`);
            }

            const data = await response.json();
            console.log("management ==", data);

            setExecutedAttacks(data);

        } catch (err: any) {
            console.error("ERROR:", err);
        }
    };

    const startPolling = () => {
        if (!intervalRef.current) {
            pollProgress(); 
            intervalRef.current = setInterval(pollProgress, 3000);
        }
    };

    useEffect(() => {
        if (!benchmarkID) return;
        startPolling();

    }, [benchmarkID]);


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