"use client";
import React, { useEffect, useMemo, useRef, useState } from 'react'
import './TaskManagement.css'
import useNNTrustStore from '@/store/nnTrustStore'
import { ArrowDownUp, CircleArrowRight, Search } from 'lucide-react';
import { HoverCard, Progress } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { BenchmarkDataProps, ReportProps } from '@/interfaces/reportInterfaces';
import useStore from '@/store/nnTrustStore';
import { benchmarkFetch_get, getJobsProgress, reportFetch_get } from '@/properties/urlsNNTrust';
import OpenPdfButton from '@/components/client/PDFViewer';

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
        const attacksArray = Array.from(executedAttacks);
        setAttackArray(attacksArray);
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


    return (
        <div className="container">
            <div className='management-header'>
                <div>
                    <h1>Job Status Management</h1>
                    <p style={{ color: "lightgray" }}>Number of finished tested vulnearbilities {atkFinished}/{executedAttacks.length}</p>
                </div>

                <HoverCard
                    width={170}
                    shadow="md"
                    disabled={!isDisabled()}>
                    <div>
                    <OpenPdfButton
                        param1={benchmarkID}
                        param2={"True"}
                        />
                    </div>
                    <HoverCard.Dropdown>
                        <p style={{ fontSize: "0.7rem" }}>
                            This button is currently disabled. Because {executedAttacks.length === 0 ? "there are no vulnearbilities scheduled." : `${executedAttacks.length - atkFinished} vulnearbily(s) remains to be finished.`}
                        </p>
                    </HoverCard.Dropdown>
                </HoverCard>


            </div>
            <div className="filters">
                <div className="search-wrapper">
                    <Search className="search-icon" />
                    <input
                        type="text"
                        id="searchInput"
                        placeholder="Search jobs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className='filter'>
                    <div>Filter by:</div>
                    <select
                        className='selectionButton'
                        id="statusFilter"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="All">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>
            </div>
            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>
                                <button onClick={() => handleSort('id')}>
                                    ID <ArrowDownUp />
                                </button>
                            </th>
                            <th>
                                <button onClick={() => handleSort('name')}>
                                    Attack Name <ArrowDownUp />
                                </button>
                            </th>
                            <th>
                                <button onClick={() => handleSort('status')}>
                                    Status <ArrowDownUp />
                                </button>
                            </th>
                            <th>
                                Progress
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAndSortedJobs.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                                    No jobs found
                                </td>
                            </tr>
                        ) : (
                            filteredAndSortedJobs.map((job, index) => {
                                const jobId = typeof job === 'string' ? job : (job?.id || index);
                                const jobName = typeof job === 'string' ? job : (job?.name || 'N/A');
                                const jobStatus = typeof job === 'string' ? 'N/A' : (job?.status || 'N/A');

                                return (
                                    <tr key={`${jobId}-${index}`}>
                                        <td>
                                            {jobId}
                                        </td>
                                        <td style={{ fontWeight: "bold" }}>
                                            {jobName}
                                        </td>
                                        <td>
                                            <p>{jobStatus}</p>
                                        </td>
                                        <td>
                                            {(() => {
                                                if (job.progress === 100 && job.status === "completed") {
                                                    return <Progress value={job.progress} color="green" />;
                                                } else if (job.progress !== 100 && job.status !== "completed") {
                                                    return <Progress value={job.progress} color="blue" animated />;
                                                } else if (job.progress !== 100 && job.status === "completed") {
                                                    return <Progress value={job.progress} color="red" />;
                                                }
                                            })()}

                                        </td>

                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default TaskManagement