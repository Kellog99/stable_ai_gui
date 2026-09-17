import type {JobResult, RegisterObjectProps} from "@/interfaces/NNInterfaces";
import type {DatasetInfo} from "@/interfaces/homePageInterface";
import {GetAttackStatus} from './handle_refresh';

export const POLLING_INTERVAL_MS = 3000;

export interface RefreshControl {
    isActive: boolean;
    timeout?: ReturnType<typeof setTimeout>;
}

export interface RefreshParams extends RefreshControl {
    benchmarkId: string | number;
    modelId?: string | number | null;
    datasetId?: string | number | null;
    attackIds: string[];
    url: string;
    signal: AbortSignal;
    setJobs: (jobs: JobResult[]) => void;
    setError: (error: string | null) => void;
}

export async function Refresh(
    {
        benchmarkId,
        modelId,
        datasetId,
        attackIds,
        url,
        signal,
        setJobs,
        setError,
    }: RefreshParams): Promise<void> {
    
    let shouldPollAgain = true;
    try {
        const refreshedJobs = await GetAttackStatus({
            benchmarkId: benchmarkId,
            modelId: modelId ?? undefined,
            datasetId: datasetId ?? undefined,
            attackIds: attackIds,
            url: url,
            signal: signal,
        });

        if (isActive) {
            const normalizedJobs = refreshedJobs.map(normalizeCompletedJob);
            setJobs(normalizedJobs);
            setError(null);

            shouldPollAgain = normalizedJobs.length === 0 || normalizedJobs.some(
                ({status}) => status === 'pending' || status === 'in progress',
            );
        }
    } catch (refreshError) {
        if (isActive && !signal.aborted) {
            setError(getErrorMessage(refreshError));
        }
    } finally {
        if (isActive) {
            if (!shouldPollAgain) {
                timeout = undefined;
                return
            }

            timeout = setTimeout(
                () => void Refresh(params),
                POLLING_INTERVAL_MS,
            );
        }
    }
}

export function getJobStatusDescription(
    benchmarkId: string | number | null,
    isLoading: boolean,
    error: unknown,
    jobs: JobResult[],
    unfinishedAttacks: number,
    failedAttacks: number,
): string {
    if (benchmarkId === null) return 'No benchmark has been run yet.';
    if (isLoading) return 'Loading jobs…';
    if (error) return 'Job status is temporarily unavailable.';
    if (jobs.length === 0) return 'No jobs have been executed.';
    if (unfinishedAttacks > 0)
        return `${unfinishedAttacks} attack${unfinishedAttacks === 1 ? '' : 's'} remaining.`;
    if (failedAttacks > 0)
        return `${failedAttacks} attack${failedAttacks === 1 ? '' : 's'} failed.`;
    return 'All jobs completed.';
}

export function getDisabledDescription(
    dataset: DatasetInfo | null,
    selectedAttacks: { [key: string]: RegisterObjectProps },
    selectedMetrics: { [key: string]: RegisterObjectProps },
    isExecuting: boolean,
): string {
    if (dataset === null) return 'A dataset is required to perform a benchmark.';
    if (Object.keys(selectedAttacks).length === 0)
        return `You have to select at least one attack.`;
    if (Object.keys(selectedMetrics).length === 0)
        return 'At least one benchmark metric must be selected.';
    if (isExecuting) return 'The benchmark is being scheduled.';
    return '';
}

export function getReportDisabledDescription(
    isLoadingReport: boolean,
    benchmarkId: string | number | null,
    model: { id: string | null } | null,
    dataset: { id: string | null } | null,
    description: string
): string {
    if (isLoadingReport) {
        return 'Loading the vulnerability report…';
    }
    if (benchmarkId !== null && (model?.id == null || dataset?.id == null)) {
        return 'Model or dataset details are not available.';
    }
    return description;
}

export const getErrorMessage = (error: unknown) =>
    error instanceof Error ? error.message : 'An unexpected error occurred.';

export const normalizeCompletedJob = (job: JobResult): JobResult => {
    const hasCompletedProgress =
        job.status === 'in progress' &&
        job.total != null &&
        job.total > 0 &&
        job.progress != null &&
        job.progress >= job.total;

    return hasCompletedProgress ? {...job, status: 'finished'} : job;
};
