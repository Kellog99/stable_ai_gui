import type {JobResult} from '@/interfaces/NNInterfaces';
import type {Dispatch, SetStateAction} from 'react';

interface HandleRefreshParams {
    benchmarkId: string | number;
    attackIds?: string[];
    url: string;
    setListExecutedAttacks: Dispatch<SetStateAction<JobResult[]>>;
}

export async function handleRefresh(
    {
        benchmarkId,
        attackIds = [],
        url,
        setListExecutedAttacks,
    }: HandleRefreshParams): Promise<void> {
    try {
        const response = await fetch(`${url}?benchmark_id=${benchmarkId}&attacks_id=${attackIds}`,
            {
                method: 'GET',
            });

        if (!response.ok) {
            throw new Error(`Failed to get benchmark jobs: ${response.status}`);
        }

        const receivedAttacks: JobResult[] = await response.json();
        console.log(receivedAttacks.map(atk => atk.status));
        const jobsById = new Map(receivedAttacks.map((job) => [job.id, job]));
        // The executor creates each result file only when that attack starts.
        // Keep not-yet-created attacks visible as pending in the meantime.
        const listAttacks = attackIds.length > 0
            ? attackIds.map((attackId) => jobsById.get(attackId) ?? {
                id: attackId,
                status: 'pending' as const,
            })
            : receivedAttacks;
        setListExecutedAttacks(listAttacks);
    } catch (error) {
        console.error('Error fetching job progress:', error);
    }
}
