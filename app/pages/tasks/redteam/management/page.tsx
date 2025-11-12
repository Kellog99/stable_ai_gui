"use client";
import React, { useEffect, useMemo, useState } from 'react'
import './TaskManagement.css'
import useNNTrustStore from '@/store/nnTrustStore'
import { ArrowDownUp, CircleArrowRight, GlassWater, RotateCw, Search } from 'lucide-react';
import { HoverCard, Progress } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { BenchmarkDataProps, ReportProps } from '@/interfaces/reportInterfaces';
import { AttackManagementProps } from '@/interfaces/NNInterfaces';

const TaskManagement: React.FC = () => {
    const { setReport, setBenchmark, executedAttacks, setExecutedAttacks } = useNNTrustStore()
    const [attackArray, setAttackArray] = useState<AttackManagementProps[]>([]);
    const [attackStates, setAttackStates] = useState<{ [key: string]: number }>({});
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [sortConfig, setSortConfig] = useState<{ key: keyof AttackManagementProps | null, direction: 'asc' | 'desc' }>({
        key: null,
        direction: 'asc'
    });
    console.log(executedAttacks)
    // Convert Set to Array whenever executedAttacks changes
    useEffect(() => {
        const attacksArray = Array.from(executedAttacks);
        setAttackArray(attacksArray);

        const statuses = ["Completed", "In Progress", "Pending", "Closed"] as const;
        setAttackStates(Object.fromEntries(
            statuses.map(status => [
                status,
                attackArray.filter(job => job.status === status).length
            ])
        ))

    }, [executedAttacks]);

    const handleSort = (key: keyof AttackManagementProps) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const filteredAndSortedJobs = useMemo(() => {
        const normalize = (value: any) => String(value ?? '').toLowerCase();

        const filtered = attackArray.filter(({ id, name, status }) => {
            const term = searchTerm.toLowerCase();
            const matchesSearch =
                normalize(id).includes(term) ||
                normalize(name).includes(term) ||
                normalize(status).includes(term);

            const matchesStatus = statusFilter === 'All' || status === statusFilter;
            return matchesSearch && matchesStatus;
        });

        if (!sortConfig.key) {
            return filtered;
        }
        else {
            const { key, direction } = sortConfig;
            const multiplier = direction === 'asc' ? 1 : -1;

            return [...filtered].sort((a, b) => {
                const aValue = a[key];
                const bValue = b[key];

                const aNum = Number(aValue);
                const bNum = Number(bValue);
                if (key === 'id' && !isNaN(aNum) && !isNaN(bNum)) {
                    return (aNum - bNum) * multiplier;
                }

                return normalize(aValue).localeCompare(normalize(bValue)) * multiplier;
            });
        }
    }, [attackArray, searchTerm, statusFilter, sortConfig]);

    const [atkFinished, setAtkFinished] = useState<number>(0)
    useEffect(() => {
        setAtkFinished(executedAttacks.filter(job => job.status === "Completed").length)
    }, [executedAttacks])
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


    const [isRotating, setIsRotating] = useState(false);

    const handleRefresh = async () => {
        // This handle is for getting, every time the user clicke the Circle Arrow Icon, 
        // the updates from the jobs that are running throught the backend
        setIsRotating(true);
        setTimeout(() => setIsRotating(false), 600); // Match animation duration

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

    return (
        <div className="container">
            <div className='management-header'>
                <div>
                    <h1>Job Status Management</h1>
                    <p style={{ color: "lightgray" }}>
                        Here it is possible to controll the advancement of all the vulnerabilities that have been executed in the <b>Benchmark</b> page.
                    </p>
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
                                Report <CircleArrowRight size={25} />
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
            {/* Status Summary Cards */}
            <div >
                <h3 style={{ color: 'white' }}>Summary</h3>
                <p style={{ color: 'lightgray' }}>This represent the <b>execution</b> summary of all the vulnearbilities that have been tested.</p>

                <div className="container-card">
                    {Object.entries(attackStates).map(([status, value]) => (
                        <div className="card-summary">
                            <GlassWater size={30} className="w-6 h-6 text-white" />
                            <div >
                                <div >{status}:</div>
                                {value}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* Table Management */}
            <div >
                <h3 style={{ color: 'white' }}>Info Vulnerabilities</h3>
                <p style={{ color: 'lightgray' }}>
                    Here below is shown the advancement status of all the the vulnerabilities that have been selected previously.
                </p>

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
        </div>
    );
}

export default TaskManagement