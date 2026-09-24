"use client";

import ManagementTable from '@/components/client/management/ManagementTable';
import {getStatusIcon, getStatusLabel} from '@/components/client/management/utils';
import HeaderPageTask from '@/components/client/utils/HeaderPageTask';
import type {AttackStatus, JobResult} from '@/interfaces/NNInterfaces';
import {ATTACK_STATUSES} from '@/interfaces/NNInterfaces';
import useBackendVariablesStore from '@/store/globalStore';
import useNNTrustStore from '@/store/nnTrustStore';
import {AppWindowIcon} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {useEffect, useMemo, useRef, useState} from 'react';
import '@/components/client/management/ManagementTable.css';
import {handleRefresh} from './handle_refresh';
import {handleClickReport} from "@/pages/redteam/management/handle_report";

const POLLING_INTERVAL_MS = 3000;

function getErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : 'An unexpected error occurred.';
}

function createBackendUrl(hostname: string, port: string, pathname: string): URL {
    return new URL(pathname, `http://${hostname}:${port}`);
}

async function fetchJson<T>(url: URL, signal?: AbortSignal): Promise<T> {
    const response = await fetch(url, {signal});
    if (!response.ok) {
        throw new Error(`Request failed with HTTP ${response.status}.`);
    }

    return response.json() as Promise<T>;
}

const TaskManagement = () => {
    const {
        model,
        dataset,
        benchmarkId,
        selectedAttacks,
        setModelReport,
    } = useNNTrustStore();
    const {hostname, port} = useBackendVariablesStore();
    const router = useRouter();

    const [jobs, setJobs] = useState<JobResult[]>([]);
    const [isLoadingJobs, setIsLoadingJobs] = useState(false);
    const [jobsError, setJobsError] = useState<string | null>(null);
    const [isLoadingReport, setIsLoadingReport] = useState(false);
    const [reportError, setReportError] = useState<string | null>(null);
    const reportRequestRef = useRef<AbortController | null>(null);

    const selectedAttackList = useMemo(() => Object.values(selectedAttacks), [selectedAttacks]);
    const attackIds = useMemo(() => selectedAttackList.map((attack) => attack.id), [selectedAttackList]);
    const attackNames = useMemo<Record<string, string>>(
        () => Object.fromEntries(selectedAttackList.map((attack) => [attack.id, attack.name])),
        [selectedAttackList],
    );

    useEffect(() => {
        setJobs([]);
        setJobsError(null);

        if (benchmarkId === null) {
            setIsLoadingJobs(false);
            return;
        }

        const controller = new AbortController();
        let timeout: ReturnType<typeof setTimeout> | undefined;
        let isActive = true;

        const refresh = async (): Promise<void> => {
            try {
                const refreshedJobs = await handleRefresh({
                    benchmarkId,
                    modelId: model?.id,
                    datasetId: dataset?.id,
                    attackIds,
                    url: createBackendUrl(hostname, port, '/job/getJobs').toString(),
                    signal: controller.signal,
                });

                if (isActive) {
                    setJobs(refreshedJobs);
                    setJobsError(null);
                }
            } catch (error) {
                if (isActive && !controller.signal.aborted) {
                    setJobsError(getErrorMessage(error));
                }
            } finally {
                if (isActive) {
                    setIsLoadingJobs(false);
                    timeout = setTimeout(() => void refresh(), POLLING_INTERVAL_MS);
                }
            }
        };

        setIsLoadingJobs(true);
        void refresh();

        return () => {
            isActive = false;
            controller.abort();
            if (timeout !== undefined) clearTimeout(timeout);
        };
    }, [attackIds, benchmarkId, dataset?.id, hostname, model?.id, port]);

    useEffect(() => {
        setReportError(null);
        setIsLoadingReport(false);

        return () => reportRequestRef.current?.abort();
    }, [benchmarkId, hostname, port]);

    const attackState = useMemo<Record<AttackStatus, number>>(() => {
        const counts: Record<AttackStatus, number> = {
            pending: 0,
            'in progress': 0,
            finished: 0,
            error: 0,
        };

        for (const job of jobs) counts[job.status] += 1;
        return counts;
    }, [jobs]);

    const unfinishedAttacks = attackState.pending + attackState['in progress'];
    const failedAttacks = attackState.error;
    const modelId: string | undefined = model?.id;
    const datasetId: string | undefined = dataset?.id;

    function getDescription(): string {
        if (benchmarkId === null) return 'No benchmark selected.';
        if (isLoadingJobs) return 'Loading jobs…';
        if (jobsError) return 'Job status is temporarily unavailable.';
        if (jobs.length === 0) return 'No jobs have been executed.';
        if (unfinishedAttacks > 0) {
            return `${unfinishedAttacks} attack${unfinishedAttacks === 1 ? '' : 's'} remaining.`;
        }
        if (failedAttacks > 0) {
            return `${failedAttacks} attack${failedAttacks === 1 ? '' : 's'} failed.`;
        }
        return 'All jobs completed.';
    }

    const description = getDescription();

    const canOpenReport: boolean = benchmarkId !== null
        && Boolean(modelId)
        && Boolean(datasetId)
        && jobs.length > 0
        && unfinishedAttacks === 0
        && failedAttacks === 0
        && !jobsError
        && !isLoadingJobs
        && !isLoadingReport;

    const disabledDescription = isLoadingReport
        ? 'Loading the vulnerability report…'
        : benchmarkId !== null && (!modelId || !datasetId)
            ? 'Model or dataset details are not available.'
            : description;

    return (
        <div className="container-pages">
            <HeaderPageTask
                Icon={AppWindowIcon}
                title="Job Status Management"
                description="Monitor the progress of every vulnerability test scheduled from the Benchmark page."
                button_props={{
                    description: isLoadingReport ? 'Loading Report…' : 'Vulnerability Report',
                    isDisabled: !canOpenReport,
                    disabledDescription,
                    handleClick: () => handleClickReport({
                        benchmarkId,
                        modelId: modelId ?? '',
                        datasetId: datasetId ?? '',
                        hostname,
                        port,
                        canOpenReport,
                        reportRequestRef,
                        setIsLoadingReport,
                        setReportError,
                        setModelReport,
                        router,
                        getErrorMessage,
                    }),
                }}
            />

            {reportError && <p className="management-message error" role="alert">{reportError}</p>}
            {jobsError && jobs.length > 0 && (
                <p className="management-message error" role="alert">
                    Unable to refresh job status: {jobsError}
                </p>
            )}

            <section className="management-overview" aria-labelledby="job-overview-title">
                <div className="management-section-heading">
                    <div>
                        <span className="management-eyebrow">Live overview</span>
                        <h2 id="job-overview-title">Job progress</h2>
                        <p className="management-benchmark-id">
                            Benchmark ID: <code>{benchmarkId === null ? 'Not available' : String(benchmarkId)}</code>
                        </p>
                    </div>
                    <p role="status" aria-live="polite">{description}</p>
                </div>
                <div className="container-cards">
                    {ATTACK_STATUSES.map((status) => (
                        <div key={status} className="card-summary">
                            <div className="summary-icon" aria-hidden="true">{getStatusIcon(status)}</div>
                            <div className="summary-content">
                                <span>{getStatusLabel(status)}</span>
                                <strong>{attackState[status]}</strong>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="management-table-section" aria-labelledby="job-details-title">
                <div className="management-section-heading">
                    <div>
                        <span className="management-eyebrow">Execution details</span>
                        <h2 id="job-details-title">Vulnerability jobs</h2>
                    </div>
                    <p>Search and filter the attacks included in this benchmark.</p>
                </div>
                <ManagementTable
                    jobs={jobs}
                    attackNames={attackNames}
                    isLoading={isLoadingJobs}
                    error={jobsError}
                />
            </section>
        </div>
    );
};

export default TaskManagement;
