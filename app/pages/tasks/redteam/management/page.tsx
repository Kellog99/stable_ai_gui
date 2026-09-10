"use client";
import React, {useEffect, useMemo, useState} from 'react'
import useNNTrustStore from '@/store/nnTrustStore'
import {AppWindowIcon} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {BenchmarkDataProps, ModelReportProps} from '@/interfaces/reportInterfaces';
import {benchmarkFetch_get, jobProgress_get, reportFetch_get} from '@/properties/urlsNNTrust';
import {AttackManagementProps} from '@/interfaces/NNInterfaces';
import {getStatusIcon} from '@/components/client/management/utils';
import HeaderPageTask from '@/components/client/utils/HeaderPageTask';
import ManagementTable from '@/components/client/management/ManagementTable';
import '@/components/client/management/ManagementTable.css';

const TaskManagement: React.FC = () => {
    const {
        setModelReport: setAttackReport,
        dataset,
        setBenchmark,
        benchmarkId
    } = useNNTrustStore()

    const [listExecutedAttacks, setListExecutedAttacks] = useState<AttackManagementProps[]>([]);
    const [description, setDescription] = useState<string>('');
    const datasetName = useMemo(() => {
        return dataset?.name
    }, [dataset])

    // getting the advancement status from the job, starting from the id
    const handleRefresh = async () => {
        if (!benchmarkId) {
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
            setListExecutedAttacks(listAttacks);
        } catch (error) {
            console.error("Error fetching job progress:", error);
        }
    };

    useEffect(() => {
        const timer = setInterval(handleRefresh, 1000);
        return () => clearInterval(timer);
    }, [benchmarkId]);

    const [attackStates, setAttackStates] = useState<{ [key: string]: number }>({})
    const [isDisabled, setIsDisabled] = useState<boolean>(false)


    useEffect(() => {
        const status = {
            "Completed": 0,
            "In Progress": 0,
            "Pending": 0,
            "Closed": 0
        };

        const statusMap: Record<string, keyof typeof status> = {
            "completed": "Completed",
            "in_progress": "In Progress",
            "pending": "Pending",
            "closed": "Closed",
        };

        listExecutedAttacks.forEach((job: AttackManagementProps) => {
            const normalized = job.status.toLowerCase();
            const key = statusMap[normalized];
            if (key) {
                status[key] += 1;
            }
        });

        setAttackStates(status);

        let notFinished = 0;
        if (listExecutedAttacks.length > 0) {
            notFinished = status["Pending"] + status["In Progress"];
            if (notFinished > 0) {
                setDescription(`${notFinished} attack${notFinished === 1 ? '' : 's'} remaining.`);
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
                console.error(err instanceof Error ? err.message : "An error occurred");
                return undefined; // Explicitly return undefined on error
            }
        }

        // fetching the report
        const reportFetch = await fetchResult<ModelReportProps>(`${reportFetch_get}?id=${encodeURIComponent(benchmarkId as string)}`);
        if (reportFetch) {
            setAttackReport(reportFetch);
        }

        // fetching the benchmark
        const benchmarkFetch = await fetchResult<BenchmarkDataProps>(`${benchmarkFetch_get}?dataset=${datasetName}`);
        if (benchmarkFetch) {
            setBenchmark({[benchmarkId!.toString()]: benchmarkFetch});
        }
        router.push("/pages/report/reportTITANN")
    }

    return (
        <div className="container-pages">
            {/* Header Part */}
            <HeaderPageTask
                Icon={AppWindowIcon}
                title="Job Status Management"
                description="Here it is possible to controll the advancement of all the vulnerabilities that have been executed in the Benchmark page."
                button_props={{
                    description: "Vulnerability Report",
                    isDisabled: isDisabled,
                    disabledDescription: description,
                    handleClick: handleClickReport
                }}
            />

            <section className="management-overview" aria-labelledby="job-overview-title">
                <div className="management-section-heading">
                    <div>
                        <span className="management-eyebrow">Live overview</span>
                        <h2 id="job-overview-title">Job progress</h2>
                    </div>
                    <p>{description}</p>
                </div>
                <div className="container-cards">
                    {Object.entries(attackStates).map(([status, value]) => (
                        <div key={status} className="card-summary">
                            <div className="summary-icon">{getStatusIcon(status)}</div>
                            <div className="summary-content">
                                <span>{status}</span>
                                <strong>{value}</strong>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            {/* Table Management */}
            <section className="management-table-section" aria-labelledby="job-details-title">
                <div className="management-section-heading">
                    <div>
                        <span className="management-eyebrow">Execution details</span>
                        <h2 id="job-details-title">Vulnerability jobs</h2>
                    </div>
                    <p>Search and filter the attacks included in this benchmark.</p>
                </div>
                <ManagementTable jobs={listExecutedAttacks}
                />
            </section>
        </div>
    );
}

export default TaskManagement
