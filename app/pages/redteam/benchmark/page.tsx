"use client";

import BenchmarkActions from '@/components/client/benchamark/BenchmarkActions';
import VulnerabilitySelection from '@/components/client/utils/VulnerabilitySelection';
import ManagementTable from '@/components/client/benchamark/ManagementTable';
import HeaderPageTask from '@/components/client/utils/HeaderPageTask';
import type {RegisterObjectProps} from '@/interfaces/NNInterfaces';
import {supportsTask} from '@/interfaces/NNInterfaces';
import {updateParameterDefaults, updateSelectedObjects} from '@/lib/utils';
import useBackendVariablesStore from '@/store/globalStore';
import useNNTrustStore from '@/store/nnTrustStore';
import {BrickWallFireIcon} from 'lucide-react';
import React, {useMemo, useState} from 'react';
import {handleClick} from './handle_execution';
import styles from '@/styles/benchmark.module.css';

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


    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <HeaderPageTask
                    Icon={BrickWallFireIcon}
                    title="Testing Vulnerabilities"
                    description="Select the vulnerabilities and metrics to run, then monitor every attack from this page."
                />
            </div>

            <div className={styles.vulnerabilities}>
                <VulnerabilitySelection
                    attacks={compatibleAttacks}
                    showAttackCategories
                    selectedAttacks={selectedAttacks}
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
                    handleChange={(parameters, id) => handleParametersChange(id, parameters)}
                />
            </div>


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

            <ManagementTable/>
        </div>
    );
};

export default Benchmark;
