import type {JobResult, RegisterObjectProps} from "@/interfaces/NNInterfaces";
import type {DatasetInfo} from "@/interfaces/homePageInterface";
import {GetAttackStatus} from './handle_refresh';

export const POLLING_INTERVAL_MS = 3000;

export interface RefreshParams {
    benchmarkId: string | number;
    modelId?: string | number | null;
    datasetId?: string | number | null;
    attackIds: string[];
    url: string;
    setJobs: (jobs: JobResult[]) => void;
    setError: (error: string | null) => void;
}

export async function Refresh(params: RefreshParams): Promise<void> {
    const {
        benchmarkId,
        modelId,
        datasetId,
        attackIds,
        url,
        setJobs,
        setError,
    } = params;

    try {
        const refreshedJobs: JobResult[] = await GetAttackStatus({
            benchmarkId: benchmarkId,
            modelId: modelId ?? undefined,
            datasetId: datasetId ?? undefined,
            attackIds,
            url: url,
        });

        setJobs(refreshedJobs);
        setError(null);
    } catch (refreshError) {
        setError(getErrorMessage(refreshError));
    }
}


export const getErrorMessage = (error: unknown) =>
    error instanceof Error ? error.message : 'An unexpected error occurred.';
