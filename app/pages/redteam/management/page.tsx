"use client";
import React, {useEffect, useMemo, useState} from 'react'
import useNNTrustStore from '@/store/nnTrustStore'
import {AppWindowIcon} from 'lucide-react';
import {useRouter} from 'next/navigation';
import type {BenchmarkDataProps, ModelReportProps} from '@/interfaces/reportInterfaces';
import {benchmarkFetch_get, reportFetch_get} from '@/properties/urlsNNTrust';
import type {JobResult} from '@/interfaces/NNInterfaces';
import type {AttackStatusLabel} from '@/components/client/management/utils';
import {getStatusIcon, getStatusLabel, statuses,} from '@/components/client/management/utils';
import HeaderPageTask from '@/components/client/utils/HeaderPageTask';
import ManagementTable from '@/components/client/management/ManagementTable';
import {handleRefresh} from './handle_refresh';
import '@/components/client/management/ManagementTable.css';
import useBackendVariablesStore from "@/store/globalStore";

const TaskManagement: React.FC = () => {
    const {
        setModelReport: setAttackReport,
        dataset,
        setBenchmark,
        benchmarkId,
        selectedAttacks,
    } = useNNTrustStore()

    const {hostname, port} = useBackendVariablesStore()
    const [listExecutedAttacks, setListExecutedAttacks] = useState<JobResult[]>([]);
    const datasetName: string | undefined = dataset?.name;

    useEffect(() => {
        if (benchmarkId === null) {
            setListExecutedAttacks([]);
            return;
        }

        // Do not keep showing jobs from the previous benchmark while the newly
        // selected benchmark is being fetched.
        setListExecutedAttacks([]);

        const refresh = (): void => {
            void handleRefresh({
                benchmarkId,
                attackIds: Object.keys(selectedAttacks),
                url: `http://${hostname}:${port}/job/getJobs`,
                setListExecutedAttacks,
            });
        };

        refresh();
        const interval = setInterval(refresh, 3000);
        return () => clearInterval(interval);
    }, [benchmarkId, hostname, port, selectedAttacks]);

    const attackNames = useMemo<Record<string, string>>(() => Object.fromEntries(
        Object.values(selectedAttacks).map((attack) => [attack.id, attack.name])
    ), [selectedAttacks]);

    const attackStates = useMemo<Record<AttackStatusLabel, number>>(() => {
        const counts = Object.fromEntries(
            statuses.map((status): [AttackStatusLabel, number] => [status, 0])
        ) as Record<AttackStatusLabel, number>;

        listExecutedAttacks.forEach((job) => {
            counts[getStatusLabel(job.status ?? 'pending')] += 1;
        });

        return counts;
    }, [listExecutedAttacks]);

    const unfinishedAttacks: number = attackStates.Pending + attackStates['In Progress'];
    const failedAttacks: number = attackStates.Error;
    const description: string = listExecutedAttacks.length === 0
        ? 'No jobs have been executed.'
        : unfinishedAttacks > 0
            ? `${unfinishedAttacks} attack${unfinishedAttacks === 1 ? '' : 's'} remaining.`
            : failedAttacks > 0
                ? `${failedAttacks} attack${failedAttacks === 1 ? '' : 's'} failed.`
                : 'All jobs completed.';
    const isDisabled: boolean = listExecutedAttacks.length === 0 || unfinishedAttacks > 0 || failedAttacks > 0;

    const router = useRouter()

    const handleClickReport = async (): Promise<void> => {
        if (benchmarkId === null || !datasetName) return;

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
        const reportFetch = await fetchResult<ModelReportProps>(`${reportFetch_get}?id=${encodeURIComponent(String(benchmarkId))}`);
        if (reportFetch) {
            setAttackReport(reportFetch);
        }

        // fetching the benchmark
        const benchmarkFetch = await fetchResult<BenchmarkDataProps>(`${benchmarkFetch_get}?dataset=${datasetName}`);
        if (benchmarkFetch) {
            setBenchmark({[String(benchmarkId)]: benchmarkFetch});
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
                        <p className="management-benchmark-id">
                            Benchmark ID: <code>{benchmarkId === null ? 'Not available' : String(benchmarkId)}</code>
                        </p>
                    </div>
                    <p>{description}</p>
                </div>
                <div className="container-cards">
                    {statuses.map((status) => (
                        <div key={status} className="card-summary">
                            <div className="summary-icon">{getStatusIcon(status)}</div>
                            <div className="summary-content">
                                <span>{status}</span>
                                <strong>{attackStates[status]}</strong>
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
                <ManagementTable jobs={listExecutedAttacks} attackNames={attackNames}
                />
            </section>
        </div>
    );
}

export default TaskManagement
