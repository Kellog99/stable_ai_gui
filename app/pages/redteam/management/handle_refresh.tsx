import {ATTACK_STATUSES} from '@/interfaces/NNInterfaces';
import type {AttackStatus, JobResult} from '@/interfaces/NNInterfaces';

interface HandleRefreshParams {
    benchmarkId: string | number;
    modelId?: string | number;
    datasetId?: string | number;
    attackIds?: string[];
    url: string;
    signal?: AbortSignal;
}

const isAttackStatus = (value: unknown): value is AttackStatus =>
    typeof value === 'string' && ATTACK_STATUSES.includes(value as AttackStatus);

function parseJobs(value: unknown): JobResult[] {
    if (!Array.isArray(value)) {
        throw new Error('The jobs endpoint returned an invalid response.');
    }

    return value.map((job, index) => {
        if (typeof job !== 'object' || job === null || !('id' in job)) {
            throw new Error(`The job at position ${index + 1} is invalid.`);
        }

        const rawJob = job as Record<string, unknown>;
        if (typeof rawJob.id !== 'string' && typeof rawJob.id !== 'number') {
            throw new Error(`The job at position ${index + 1} has an invalid ID.`);
        }

        const status = rawJob.status ?? 'pending';
        if (!isAttackStatus(status)) {
            throw new Error(`The job at position ${index + 1} has an unknown status.`);
        }

        return {
            ...rawJob,
            id: String(rawJob.id),
            status,
        } as JobResult;
    });
}

export async function handleRefresh({
    benchmarkId,
    modelId,
    datasetId,
    attackIds = [],
    url,
    signal,
}: HandleRefreshParams): Promise<JobResult[]> {
    const searchParams = new URLSearchParams({
        benchmark_id: String(benchmarkId),
    });

    if (modelId !== undefined) {
        searchParams.set('model_id', String(modelId));
    }

    if (datasetId !== undefined) {
        searchParams.set('dataset_id', String(datasetId));
    }

    if (attackIds.length > 0) {
        searchParams.set('attacks_id', attackIds.join(','));
    }

    const response = await fetch(`${url}?${searchParams.toString()}`, {
        method: 'GET',
        signal,
    });

    if (!response.ok) {
        throw new Error(`Failed to get benchmark jobs: HTTP ${response.status}`);
    }

    const receivedAttacks = parseJobs(await response.json());
    const jobsById = new Map(receivedAttacks.map((job) => [job.id, job]));

    // Results are created only when an attack starts, so keep scheduled attacks
    // visible while their result files do not exist yet.
    return attackIds.length > 0
        ? attackIds.map((attackId) => jobsById.get(attackId) ?? {
            id: attackId,
            status: 'pending',
        })
        : receivedAttacks;
}
