"use client";
import React, { useEffect, useMemo, useState } from 'react'
import './TaskManagement.css'
import useNNTrustStore from '@/store/nnTrustStore'
import { ArrowDownUp, CircleArrowRight, RotateCw, Search } from 'lucide-react';
import { HoverCard, Progress } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { BenchmarkDataProps, ReportProps } from '@/interfaces/reportInterfaces';

const TaskManagement: React.FC = () => {
    const { setReport, setBenchmark, executedAttacks, setExecutedAttacks } = useNNTrustStore()
    const [attackArray, setAttackArray] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [sortConfig, setSortConfig] = useState<{ key: string | null, direction: 'asc' | 'desc' }>({
        key: null,
        direction: 'asc'
    });

    const benchmarkID = useNNTrustStore((state) => state.benchmarkID)
    console.log("id from management", benchmarkID)
    
    
    console.log("in benchmark ", executedAttacks)


    // Convert Set to Array whenever executedAttacks changes
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
            // Handle both string and object cases
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

                // Handle numeric sorting for IDs
                if (sortConfig.key === 'id') {
                    const aNum = Number(aValue);
                    const bNum = Number(bValue);
                    if (!isNaN(aNum) && !isNaN(bNum)) {
                        return sortConfig.direction === 'asc' ? aNum - bNum : bNum - aNum;
                    }
                }

                // String comparison
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
    const isDisabled = () => {
        console.log(executedAttacks.length > 0 && (atkFinished === executedAttacks.length))
        return false
        // return executedAttacks.length === 0 || (atkFinished !== executedAttacks.length)
    }

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

        const reportFetch = await fetchResult<ReportProps>('http://localhost:8082/report/getReport');
        console.log("REPORT PROPS", reportFetch)
        if (reportFetch) {
            setReport(reportFetch);
        }

        const benchmarkFetch = await fetchResult<BenchmarkDataProps>('http://localhost:8082/report/getBenchmark');
        if (benchmarkFetch) {
            console.log("saving = ", benchmarkFetch)
            setBenchmark(benchmarkFetch);
        }
        router.push("/pages/report/reportTITANN")
    }
    const [isRotating, setIsRotating] = useState(false);

    const handleRefresh = async () => {
        // This handle is for getting, every time the user clicke the Circle Arrow Icon, 
        // the updates from the jobs that are running throught the backend
        setIsRotating(true);
        setTimeout(() => setIsRotating(false), 600); // Match animation duration

        try {
            const response = await fetch(`http://localhost:8082/job/getJobs?id=${encodeURIComponent(benchmarkID)}`); 
            
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
                    <HoverCard.Target>
                        <div>
                            <button
                                disabled={isDisabled()}
                                onClick={handleClickReport}
                                className={`header-button ${isDisabled() ? 'disabled' : ''}`}>
                                See Report <CircleArrowRight size={"3vw"} />
                            </button>
                        </div>
                    </HoverCard.Target>
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

                <button
                    className={`updateButton ${isRotating ? 'rotating' : ''}`}
                    onClick={handleRefresh}
                >
                    <RotateCw color='red' size={"2.3vw"} />
                </button>
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
                                            {job.progress === 100 ?
                                                <Progress value={job.progress} color='green' />
                                                : <Progress value={job.progress} color='blue' animated />}
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