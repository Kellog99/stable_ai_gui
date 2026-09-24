import React from "react";
import type {ModelReportProps} from '@/interfaces/reportInterfaces';

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

interface HandleClickReportParams {
    benchmarkId: string | number | null;
    modelId: string;
    datasetId: string;
    hostname: string;
    port: string;
    canOpenReport: boolean;
    reportRequestRef: React.MutableRefObject<AbortController | null>;
    setIsLoadingReport: (loading: boolean) => void;
    setReportError: (error: string | null) => void;
    setModelReport: (report: ModelReportProps) => void;
    router: { push: (path: string) => void };
    getErrorMessage: (error: unknown) => string;
}

export async function handleClickReport(
    {
        benchmarkId,
        modelId,
        datasetId,
        hostname,
        port,
        canOpenReport,
        reportRequestRef,
        setIsLoadingReport,
        setReportError,
        setModelReport,
        router,
        getErrorMessage,
    }: HandleClickReportParams
): Promise<void> {
    if (!canOpenReport || benchmarkId === null || !modelId || !datasetId) return;

    const controller = new AbortController();
    reportRequestRef.current = controller;
    setIsLoadingReport(true);
    setReportError(null);

    const reportUrl = createBackendUrl(hostname, port, '/job/getReport');
    reportUrl.searchParams.set('benchmark_id', String(benchmarkId));
    reportUrl.searchParams.set('model_id', modelId);
    reportUrl.searchParams.set('dataset_id', datasetId);

    try {
        const modelReport = await fetchJson<ModelReportProps>(
            reportUrl,
            controller.signal,
        );

        setModelReport(modelReport);
        router.push('/pages/report/reportTITANN');
    } catch (error) {
        if (!controller.signal.aborted) setReportError(getErrorMessage(error));
    } finally {
        if (reportRequestRef.current === controller) {
            reportRequestRef.current = null;
            setIsLoadingReport(false);
        }
    }
}
