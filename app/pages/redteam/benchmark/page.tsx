"use client";

import BenchmarkActions from '@/components/client/benchamark/BenchmarkActions';
import {handleClickReport} from '@/components/client/benchamark/handle_report';
import TableWrapper from '@/components/client/benchamark/TableWrapper';
import ManagementTable from '@/components/client/management/ManagementTable';
import {getStatusLabel} from '@/components/client/management/utils';
import HeaderPageTask from '@/components/client/utils/HeaderPageTask';
import type {AttackStatus, RegisterObjectProps} from '@/interfaces/NNInterfaces';
import {ATTACK_STATUSES, supportsTask} from '@/interfaces/NNInterfaces';
import {updateParameterDefaults, updateSelectedObjects} from '@/lib/utils';
import useBackendVariablesStore from '@/store/globalStore';
import useNNTrustStore from '@/store/nnTrustStore';
import {BrickWallFireIcon} from 'lucide-react';
import type {AppRouterInstance} from 'next/dist/shared/lib/app-router-context.shared-runtime';
import {useRouter} from 'next/navigation';
import React, {useMemo, useRef, useState} from 'react';
import {handleClick} from './handle_execution';
import styles from './page.module.css';
import '@/components/client/management/ManagementTable.css';
import {getErrorMessage, getJobStatusDescription, getReportDisabledDescription,} from "@/pages/redteam/benchmark/utils";

const Benchmark: React.FC = () => {
    const {
        hostname,
        port
    } = useBackendVariablesStore();
    const {
        model,
        dataset,
        attacks,
        setSelectedAttackList,
        setBenchmarkId,
        setModelReport,
    } = useNNTrustStore();


    const [selectedAttacks, setSelectedAttacks] = useState<{ [k: string]: RegisterObjectProps }>({});
    const [isExecuting, setIsExecuting] = useState(false);

    // Filtering the list of all possible attacks through the model's task
    const compatibleAttacks: { [k: string]: RegisterObjectProps } = useMemo(
        () => Object.fromEntries(
            Object.entries(attacks).filter(([, attack]: [string, RegisterObjectProps]) =>
                Boolean(model?.task && attack.task) &&
                supportsTask(attack, model!.task!),
            ),
        ),
        [attacks, model],
    );


    const handleParametersChange = (id: string, parameters: (number | string)[]) => {
        const currentAttack = selectedAttacks[id];
        if (!currentAttack?.parameters) return;
        setSelectedAttacks({
            ...selectedAttacks,
            [id]: {
                ...currentAttack,
                parameters: updateParameterDefaults(currentAttack.parameters, parameters)
            },
        });
    };

    const router: AppRouterInstance = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoadingReport, setIsLoadingReport] = useState(false);
    const reportRequestRef = useRef<AbortController | null>(null);

    const selectedAttackList = useMemo(() => Object.values(selectedAttacks), [selectedAttacks]);
    const attackIds = useMemo(() => selectedAttackList.map((a) => a.id), [selectedAttackList]);
    const attackNames = useMemo(
        () => Object.fromEntries(selectedAttackList.map((a) => [a.id, a.name])),
        [selectedAttackList],
    );


    const attackState = useMemo<Record<AttackStatus, number>>(() => {
        const counts: Record<AttackStatus, number> = {pending: 0, 'in progress': 0, finished: 0, error: 0};
        for (const job of jobs) counts[job.status] += 1;
        return counts;
    }, [jobs]);

    const unfinishedAttacks = attackState.pending + attackState['in progress'];
    const failedAttacks = attackState.error;
    const canOpenReport = benchmarkId !== null
        && model?.id != null
        && dataset?.id != null
        && jobs.length > 0
        && unfinishedAttacks === 0
        && failedAttacks === 0
        && !error
        && !isLoading
        && !isLoadingReport;

    const description: string = useMemo(
        () => getJobStatusDescription(
            benchmarkId,
            isLoading,
            error, jobs,
            unfinishedAttacks,
            failedAttacks
        ),
        [benchmarkId, isLoading, error, jobs, unfinishedAttacks, failedAttacks],
    );

    const reportDisabledDescription: string = useMemo(
        () => getReportDisabledDescription(
            isLoadingReport,
            benchmarkId,
            model,
            dataset,
            description
        ), [isLoadingReport, benchmarkId, model, dataset, description]);

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <HeaderPageTask
                    Icon={BrickWallFireIcon}
                    title="Testing Vulnerabilities"
                    description="Select the vulnerabilities and metrics to run, then monitor every attack from this page."
                />
            </div>

            <TableWrapper
                showAttackCategories
                selectedElement={selectedAttacks}
                handleSelection={
                    (
                        id: string,
                        visibleElements: { [k: string]: RegisterObjectProps } | undefined
                    ) =>
                        setSelectedAttacks(
                            updateSelectedObjects(
                                id,
                                selectedAttacks,
                                compatibleAttacks,
                                visibleElements
                            ),
                        )}
                handleParametersChange={handleParametersChange}
            />


            <BenchmarkActions
                selectedAttacks={selectedAttacks}
                onReset={() => {
                    setBenchmarkId(null);
                    setSelectedAttackList({});
                    setSelectedAttacks({});
                }}
                onRun={(
                    metrics: RegisterObjectProps[],
                ) => void handleClick({
                    url: `http://${hostname}:${port}/job/start_benchmark`,
                    model,
                    dataset,
                    attacks: Object.values(selectedAttacks),
                    metrics,
                    isExecuting,
                    setIsExecuting,
                    setSelectedAttackList,
                    selectedAttacks,
                    setBenchmarkId,
                })}
                isExecuting={isExecuting}
            />

            <section className={styles.jobMonitoring} aria-labelledby="job-monitoring-title">
                <div className={styles.jobMonitoringHeading}>
                    <div>
                        <h2 id="job-monitoring-title">Execution details</h2>
                        <p className={styles.jobMonitoringId}>
                            Benchmark
                            ID: <code>{benchmarkId === null ? 'Not available' : String(benchmarkId)}</code>
                        </p>
                    </div>
                    <div className={styles.jobMonitoringCards}>
                        {ATTACK_STATUSES.map((status) => (
                            <div key={status} className={styles.jobMonitoringCard}>
                                {getStatusLabel(status)}: <b>{attackState[status]}</b>
                            </div>
                        ))}
                    </div>
                </div>
                <ManagementTable
                    isLoading={isLoading}
                    error={error}
                    reportAction={{
                        label: isLoadingReport ? 'Loading report…' : 'Vulnerability report',
                        disabledDescription: reportDisabledDescription,
                        onClick: () => void handleClickReport({
                            benchmarkId,
                            modelId: model?.id == null ? '' : String(model.id),
                            datasetId: dataset?.id == null ? '' : String(dataset.id),
                            hostname,
                            port,
                            canOpenReport,
                            reportRequestRef,
                            setIsLoadingReport,
                            setModelReport,
                            router,
                            getErrorMessage,
                        }),
                    }}
                />
            </section>
        </div>
    );
};

export default Benchmark;
