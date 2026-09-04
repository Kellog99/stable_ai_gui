import {RegisterObjectProps} from '@/interfaces/NNInterfaces';

interface HandleBenchmarkRequestParams {
    url: string;
    model: string | undefined;
    dataset: string | undefined;
    attacks: RegisterObjectProps[];
    metrics: RegisterObjectProps[];
    isExecuting: boolean;
    setIsExecuting: (isExecuting: boolean) => void;
    setSelectedAttackList: (attacks: { [key: string]: RegisterObjectProps }) => void;
    selectedAttacks: { [key: string]: RegisterObjectProps };
    setBenchmarkId: (benchmarkId: string | number) => void;
    setIsClicked: (isClicked: boolean) => void;
}

function getErrorMessage(body: string, status: number): string {
    if (!body) return `HTTP error! status: ${status}`;

    try {
        const parsed = JSON.parse(body);
        const detail = parsed?.detail ?? parsed?.message ?? parsed?.error;
        return `HTTP error! status: ${status}: ${typeof detail === 'string' ? detail : body}`;
    } catch {
        return `HTTP error! status: ${status}: ${body}`;
    }
}

function getBenchmarkId(responseBody: unknown): string | number | undefined {
    if (typeof responseBody === 'string' || typeof responseBody === 'number') {
        return responseBody;
    }

    if (responseBody && typeof responseBody === 'object') {
        const body = responseBody as Record<string, unknown>;
        const id = body.id ?? body.benchmark_id ?? body.job_id;
        if (typeof id === 'string' || typeof id === 'number') return id;
    }

    return undefined;
}

export function saveBodyToJson(
    body: unknown,
    filename = 'benchmark-request.json'
): void {
    const blob = new Blob([JSON.stringify(body, null, 2)], {type: 'application/json'});
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(downloadUrl);
}

export async function handleClick(
    {
        url,
        model,
        dataset,
        attacks,
        metrics,
        isExecuting,
        setIsExecuting,
        setSelectedAttackList,
        selectedAttacks,
        setBenchmarkId,
        setIsClicked,
    }: HandleBenchmarkRequestParams) {
    if (isExecuting || !model || !dataset || attacks.length === 0) return;

    setIsExecuting(true);
    try {
        const requestBody = {model, dataset, attacks, metrics};
        saveBodyToJson(requestBody);

        const response = await fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(requestBody),
        });

        const responseBody = await response.text();
        if (!response.ok) {
            throw new Error(getErrorMessage(responseBody, response.status));
        }

        let parsedBody: unknown;
        try {
            parsedBody = responseBody ? JSON.parse(responseBody) : undefined;
        } catch {
            throw new Error('The benchmark service returned an invalid JSON response.');
        }

        const benchmarkId = getBenchmarkId(parsedBody);
        if (benchmarkId === undefined) {
            throw new Error('The benchmark service response did not contain a benchmark ID.');
        }

        setSelectedAttackList(selectedAttacks);
        setBenchmarkId(benchmarkId);
        setIsClicked(true);
    } catch (error) {
        console.error('Error starting benchmark:', error);
    } finally {
        setIsExecuting(false);
    }
}
