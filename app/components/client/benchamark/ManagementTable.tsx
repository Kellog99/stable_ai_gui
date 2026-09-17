import type {AttackStatus, JobResult} from '@/interfaces/NNInterfaces';
import {ATTACK_STATUSES} from '@/interfaces/NNInterfaces';
import {Progress} from '@mantine/core';
import {CircleArrowRight, Search} from 'lucide-react';
import React, {useEffect, useMemo, useState} from 'react';
import './ManagementTable.css';
import {getStatusColor, getStatusIcon, getStatusLabel} from '../management/utils';
import useBackendVariablesStore from "@/store/globalStore";
import useNNTrustStore from "@/store/nnTrustStore";
import {POLLING_INTERVAL_MS, Refresh} from "@/pages/redteam/benchmark/utils";
import type {ModelReportProps} from "@/interfaces/reportInterfaces";
import {useRouter} from "next/navigation";

const formatDuration = (seconds?: number | null): string => {
    if (seconds == null || !Number.isFinite(seconds)) return '—';
    if (seconds <= 0) return '0 s';
    if (seconds < 1) return `${Math.round(seconds * 1000)} ms`;
    if (seconds < 60) return `${seconds.toFixed(seconds < 10 ? 2 : 1)} s`;

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return [
        hours > 0 ? `${hours} h` : null,
        minutes > 0 ? `${minutes} min` : null,
        remainingSeconds > 0 || (hours === 0 && minutes === 0) ? `${remainingSeconds} s` : null,
    ].filter(Boolean).join(' ');
};

const getProgressPercentage = (job: JobResult): number => {
    if (!job.total || job.total <= 0 || !Number.isFinite(job.progress)) return 0;
    return Math.min(100, Math.max(0, ((job.progress ?? 0) / job.total) * 100));
};

const isBehindSchedule = (job: JobResult, progressPercentage: number): boolean => {
    if (
        progressPercentage <= 0 ||
        job.execution_time == null ||
        job.estimated_execution_time == null ||
        job.estimated_execution_time <= 0
    ) return false;

    const expectedElapsedTime = job.estimated_execution_time * (progressPercentage / 100);
    return job.execution_time > expectedElapsedTime * 1.1;
};

const getRemainingExecutionTime = (job: JobResult): number | null => {
    if (job.status === 'finished' || job.status === 'error') return 0;
    if (job.estimated_execution_time == null || !Number.isFinite(job.estimated_execution_time)) return null;

    const elapsedTime = job.execution_time ?? 0;
    return Math.max(0, job.estimated_execution_time - elapsedTime);
};

const ManagementTable = () => {

    const {hostname, port} = useBackendVariablesStore();
    const {model, dataset, benchmarkId, selectedAttacks, setModelReport} = useNNTrustStore();
    const router = useRouter();
    const [jobs, setJobs] = useState<JobResult[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setJobs([]);
        setError(null);

        if (benchmarkId === null || !dataset?.id || !model?.id) return;

        const modelId: string = model.id;
        const datasetId: string = dataset.id;
        const attackIds: string[] = Object.keys(selectedAttacks);

        setIsLoading(true);

        void Refresh({
            benchmarkId,
            modelId,
            datasetId,
            attackIds,
            url: `http://${hostname}:${port}/job/getJobs`,
            setJobs,
            setError,
        }).finally(() => {
            setIsLoading(false);
        });
    }, [benchmarkId, dataset, hostname, model, port, selectedAttacks]);

    const tableDescription: string = useMemo<string>(() => {
        if (isLoading) return 'Loading jobs…'
        if (error) return error
        if (jobs.length === 0) return 'No jobs have been executed'
        else return 'No jobs match the current filters'
    }, [isLoading, error, jobs])

    const attackState: Record<AttackStatus, number> = useMemo<Record<AttackStatus, number>>(() => {
        const counts: Record<AttackStatus, number> = {
            pending: 0,
            'in progress': 0,
            finished: 0,
            error: 0,
        };
        for (const job of jobs) counts[job.status] += 1;
        return counts;
    }, [jobs]);

    useEffect(() => {
        const hasRunningJobs = attackState.pending > 0 || attackState['in progress'] > 0;
        if (benchmarkId === null || !dataset?.id || !model?.id || !hasRunningJobs) return;

        const interval = setInterval(() => {
            void Refresh({
                benchmarkId,
                modelId: model.id,
                datasetId: dataset.id,
                attackIds: Object.keys(selectedAttacks),
                url: `http://${hostname}:${port}/job/getJobs`,
                setJobs,
                setError,
            });
        }, POLLING_INTERVAL_MS);

        return () => clearInterval(interval);
    }, [attackState, benchmarkId, dataset, hostname, model, port, selectedAttacks]);

    const [searchTerm, setSearchTerm] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<'All' | AttackStatus>('All');

    const filteredJobs: JobResult[] = useMemo<JobResult[]>(() => {
        const normalizedSearchTerm = searchTerm.trim().toLowerCase();

        return jobs.filter((job: JobResult) => {
            const attackName: string = selectedAttacks[job.id]?.name ?? '';
            const matchesSearch: boolean =
                job.id.toLowerCase().includes(normalizedSearchTerm)
                || attackName.toLowerCase().includes(normalizedSearchTerm);

            const matchesStatus: boolean =
                statusFilter === 'All'
                || job.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [selectedAttacks, jobs, searchTerm, statusFilter]);

    // Report settings
    const [isLoadingReport, setIsLoadingReport] = useState(false);
    const isReportDisabled: boolean = benchmarkId === null
        || !model?.id
        || !dataset?.id
        || jobs.length === 0
        || attackState.pending > 0
        || attackState['in progress'] > 0
        || attackState.error > 0
        || isLoading
        || isLoadingReport
        || error !== null;

    const onClick = async (): Promise<void> => {
        if (benchmarkId === null || !model?.id || !dataset?.id) return;

        const reportUrl: URL = new URL(`/job/getReport`, `http://${hostname}:${port}`);
        reportUrl.searchParams.set('benchmark_id', String(benchmarkId));
        reportUrl.searchParams.set('model_id', model.id);
        reportUrl.searchParams.set('dataset_id', dataset.id);

        setIsLoadingReport(true);

        try {
            const response = await fetch(reportUrl);
            if (!response.ok) {
                throw new Error(`Failed to load report (HTTP ${response.status})`);
            }

            const modelReport: ModelReportProps = await response.json();
            setModelReport(modelReport);
            router.push('/pages/report/reportTITANN');
        } catch (error) {
            console.error('Failed to load vulnerability report', error);
        } finally {
            setIsLoadingReport(false);
        }
    };

    return (
        <section className="job-monitoring" aria-labelledby="job-monitoring-title">
            <div className="job-monitoring-heading">
                <div>
                    <h2 id="job-monitoring-title">Execution details</h2>
                    <p className="job-monitoring-id">
                        Benchmark ID: <code>{benchmarkId === null ? 'Not available' : String(benchmarkId)}</code>
                    </p>
                </div>
                <div className="job-monitoring-cards">
                    {ATTACK_STATUSES.map((status) => (
                        <div key={status} className="job-monitoring-card">
                            {getStatusLabel(status)}: <b>{attackState[status]}</b>
                        </div>
                    ))}
                </div>
            </div>
            <div className='table-container'>
                <div>
                    <div className="management-filters">
                        <div className="management-search-wrapper">
                            <Search className="management-search-icon" aria-hidden="true"/>
                            <input
                                type="text"
                                id="searchInput"
                                placeholder="Search jobs..."
                                aria-label="Search vulnerability jobs"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className='management-filter'>
                            <label htmlFor="statusFilter">Filter by:</label>
                            <select
                                className='selectionButton'
                                id="statusFilter"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as 'All' | AttackStatus)}
                            >
                                <option value="All">All Statuses</option>
                                {ATTACK_STATUSES.map((status) => (
                                    <option key={status} value={status}>{getStatusLabel(status)}</option>
                                ))}
                            </select>
                        </div>
                        <button
                            type="button"
                            className="management-report-button"
                            onClick={() => void onClick()}
                            disabled={isReportDisabled}
                        >
                            {isLoadingReport ? 'Loading report…' : 'Vulnerability report'}
                            <CircleArrowRight size={18} aria-hidden="true"/>
                        </button>
                    </div>
                    <div className="management-table-wrapper">
                        <table>
                            <thead>
                            <tr>
                                <th>Attack Name</th>
                                <th>Status & Progress</th>
                                <th>Remaining time</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredJobs.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                                        <span role="status" aria-live="polite">
                                            {tableDescription}
                                        </span>
                                    </td>
                                </tr>
                            ) : (
                                filteredJobs.map((job) => {
                                    const progressPercentage = getProgressPercentage(job);
                                    const displayedProgress = Math.round(progressPercentage);
                                    const progressColor = isBehindSchedule(job, progressPercentage) ? 'orange' : 'green';

                                    return (
                                        <tr key={job.id}>
                                            <td style={{fontWeight: "bold"}}>
                                                {selectedAttacks[job.id]?.name ?? job.id}
                                            </td>
                                            <td>
                                                {job.status === 'in progress' ?
                                                    <div className="job-progress">
                                                        <Progress
                                                            className="job-progress-bar"
                                                            value={progressPercentage}
                                                            color={progressColor}
                                                            animated
                                                            aria-label={`${getStatusLabel(job.status)}: ${displayedProgress}%`}
                                                        />
                                                        <span className="job-progress-value" aria-hidden="true">
                                                            {displayedProgress}%
                                                        </span>
                                                    </div>
                                                    :
                                                    <div className={`status-badge ${getStatusColor(job.status)}`}>
                                                        {getStatusIcon(job.status)}
                                                        <span>{getStatusLabel(job.status)}</span>
                                                    </div>
                                                }
                                            </td>
                                            <td>
                                                <span className="job-remaining-time">
                                                    {formatDuration(getRemainingExecutionTime(job))}
                                                </span>
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
        </section>
    );
};

export default ManagementTable;
