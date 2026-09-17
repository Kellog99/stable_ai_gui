import {ATTACK_STATUSES} from '@/interfaces/NNInterfaces';
import type {AttackStatus, JobResult} from '@/interfaces/NNInterfaces';
import {Progress} from '@mantine/core';
import {CircleArrowRight, Search} from 'lucide-react';
import React, {useEffect, useMemo, useState} from 'react';
import './TaskManagement.css';
import {getStatusColor, getStatusIcon, getStatusLabel} from './utils';
import useBackendVariablesStore from "@/store/globalStore";
import useNNTrustStore from "@/store/nnTrustStore";
import {Refresh} from "@/pages/redteam/benchmark/utils";

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

interface ManagementTableProps {
    attacksId: string[],
    isLoading?: boolean;
    error?: string | null;
    reportAction?: {
        label: string;
        onClick: () => void;
        isDisabled?: boolean;
        disabledDescription?: string;
    };
}

const ManagementTable: React.FC<ManagementTableProps> = (
    {
        error = null,
        reportAction,
    }
) => {

    const {
        hostname,
        port
    } = useBackendVariablesStore()
    const {
        model,
        dataset,
        benchmarkId
    } = useNNTrustStore()

    const [jobs, setJobs] = useState<JobResult[]>([])

    useEffect(() => {
        setJobs([]);

        if (benchmarkId === null) return

        const controller = new AbortController();

        void Refresh({
            isActive: true,
            benchmarkId,
            modelId: model?.id,
            datasetId: dataset?.id,
            attackIds: attacksId,
            url: new URL('/job/getJobs', `http://${hostname}:${port}`).toString(),
            signal: controller.signal,
            setJobs,
            setError,
        });

        return () => {
            refreshParams.isActive = false;
            controller.abort();
            if (refreshParams.timeout !== undefined) clearTimeout(refreshParams.timeout);
        };
    }, [attackIds, benchmarkId, dataset?.id, hostname, model?.id, port]);

    useEffect(() => {
        setIsLoadingReport(false);
        return () => reportRequestRef.current?.abort();
    }, [benchmarkId, hostname, port]);


    const [searchTerm, setSearchTerm] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<'All' | AttackStatus>('All');

    const canOpenReport = benchmarkId !== null
        && model?.id != null
        && dataset?.id != null
        && jobs.length > 0
        && unfinishedAttacks === 0
        && failedAttacks === 0
        && !error
        && !isLoading
        && !isLoadingReport;
    const filteredJobs: JobResult[] = useMemo<JobResult[]>(() => {
        const normalizedSearchTerm: string = searchTerm.trim().toLowerCase();

        return jobs.filter((job) => {
            const attackName = attackNames[job.id] ?? job.id;
            const matchesSearch =
                attackName.toLowerCase().includes(normalizedSearchTerm) ||
                job.id.toLowerCase().includes(normalizedSearchTerm) ||
                getStatusLabel(job.status).toLowerCase().includes(normalizedSearchTerm);

            const matchesStatus = statusFilter === 'All' || job.status === statusFilter;

            return matchesSearch && matchesStatus;
        });

    }, [attackNames, jobs, searchTerm, statusFilter]);


    return (
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
                    {reportAction && (
                        <button
                            type="button"
                            className="management-report-button"
                            onClick={reportAction.onClick}
                            disabled={reportAction.isDisabled}
                            title={reportAction.isDisabled ? reportAction.disabledDescription : undefined}
                        >
                            {reportAction.label}
                            <CircleArrowRight size={18} aria-hidden="true"/>
                        </button>
                    )}
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
                                        {isLoading
                                            ? 'Loading jobs…'
                                            : error
                                                ? error
                                                : jobs.length === 0
                                                    ? 'No jobs have been executed'
                                                    : 'No jobs match the current filters'}
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
                                            {attackNames[job.id] ?? job.id}
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
                                                <div
                                                    className={`status-badge ${getStatusColor(job.status)}`}>
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
    )
}

export default ManagementTable
