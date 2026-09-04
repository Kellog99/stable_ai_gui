"use client"

import React, {useEffect, useState} from 'react';
import {RegisterObjectProps} from '@/interfaces/NNInterfaces';
import TableWrapper from "@/components/client/benchamark/TableWrapper"
import {BrickWallFireIcon, ChevronRight, Info} from 'lucide-react';
import {Group, Modal} from '@mantine/core';
import HeaderPageTask from '@/components/client/utils/HeaderPageTask';
import useBackendVariablesStore from '@/store/globalStore';

import useNNTrustStore from '@/store/nnTrustStore';
import styles from '@/styles/Benchmark.module.css';
import {handleClick} from './handle_execution';


const Benchmark: React.FC = () => {
    // ######################## stored Variables ########################
    const {
        hostname,
        port,
    } = useBackendVariablesStore()

    const {
        model,
        dataset,
        attacks,
        metrics,
        setSelectedAttackList,
        setBenchmarkId
    } = useNNTrustStore()

    // ##################################################################

    const [selectedAttacks, setSelectedAttacks] = useState<{ [key: string]: RegisterObjectProps }>({})
    const [selectedMetrics, setSelectedMetrics] = useState<{ [key: string]: RegisterObjectProps }>({})

    const numClasses = model?.num_classes as number

    let modifiedSelectedElement = {...selectedMetrics};
    if (numClasses > 100 && "confusionmatrix" in modifiedSelectedElement) {
        delete modifiedSelectedElement.confusionmatrix;
    }
    const datasetName = dataset?.name
    const modelName = useNNTrustStore((state) => state.model)?.name


    // Handler for the element's
    const handleSelectionClick = (
        id: string,
        map: { [key: string]: RegisterObjectProps },
        setMap: (map: { [key: string]: RegisterObjectProps }) => void,
        completeList: { [key: string]: RegisterObjectProps },
        visibleList: { [key: string]: RegisterObjectProps } = completeList
    ) => {

        if (id === 'all') {
            setMap({...map, ...visibleList})
        } else if (id === 'none') {
            const visibleIds = new Set(Object.keys(visibleList));
            setMap(Object.fromEntries(Object.entries(map).filter(([visibleId]) => !visibleIds.has(visibleId))))
        } else {
            const copiedMap = {...map};

            if (id in copiedMap) {
                delete copiedMap[id]
            } else {
                copiedMap[id] = completeList[id]
            }
            setMap(copiedMap)
        }
    };

    // handler for changing the parameters
    const handleParametersChange = (
        id: string,
        parameters: number[],
        setMap: (map: { [key: string]: RegisterObjectProps }) => void,
        registeredObject: { [key: string]: RegisterObjectProps },
    ) => {

        const currentMap: { [key: string]: RegisterObjectProps } = {...registeredObject};
        const currentObject = currentMap[id];
        if (currentObject && currentObject.parameters) {
            currentObject.parameters.map((param, index) => {
                param.default = parameters[index]
            })

            currentMap[id] = currentObject;
            setMap(currentMap);
        }
    }


    // #################### Benchmark constraints ####################
    const [executeBenchmark, setExecuteBenchmark] = useState<boolean>(true)
    // Provides the context of why the Benchmarking is not executable
    const [description, setDescription] = useState<string>("")

    useEffect(() => {
        console.log(dataset)
        if (dataset == null) {
            setExecuteBenchmark(false)
            setDescription("A dataset is required to perform a benchmark.")
        } else if (Object.keys(attacks).length === 0) {
            setExecuteBenchmark(false)
            setDescription("No attacks are available for the execution.")
        } else {
            setExecuteBenchmark(Object.keys(selectedAttacks).length > 0)

            if (Object.keys(selectedAttacks).length === 0) {
                setDescription(`None of the ${Object.keys(attacks).length} attacks have been selected.`)
            } else {
                setDescription("Another Benchmarking is running. Please wait till the end.")
            }
        }

    }, [attacks, dataset, selectedAttacks])

    // Click Execution Attack Handle
    const [isClicked, setIsClicked] = useState<boolean>(false)
    const [isExecuting, setIsExecuting] = useState<boolean>(false)


    return (
        <div
            className={styles.page}>
            {/* Header */}
            <HeaderPageTask
                Icon={BrickWallFireIcon}
                title="Red Teaming"
                description="
                Select all the attacks and all the metrics needed for executing the benchmark.
                "
                button_props={{
                    description: "Execute Benchmark",
                    isDisabled: !executeBenchmark || isExecuting || dataset == null,
                    disabledDescription: description,
                    handleClick: () => handleClick({
                        url: `http://${hostname}:${port}/job/start_benchmark`,
                        model: modelName,
                        dataset: datasetName,
                        attacks: Object.values(selectedAttacks),
                        metrics: Object.values(modifiedSelectedElement),
                        isExecuting,
                        setIsExecuting,
                        setSelectedAttackList,
                        selectedAttacks,
                        setBenchmarkId,
                        setIsClicked,
                    })
                }}
            />
            <Modal
                opened={isClicked}
                className={styles.allert_message}
                onClose={() => setIsClicked(false)}
                withCloseButton={false}
                styles={{
                    title: {
                        color: "white",
                        fontWeight: "bold",
                        marginBottom: "15px"
                    },
                    content: {
                        backgroundColor: "var(--bg-light)",
                        borderRadius: "var(--border-radius)",
                        color: "white",
                        fontSize: "0.8rem"

                    }
                }}
                centered>
                <Modal.Title>
                    <Group>
                        <Info/> Information
                    </Group>
                </Modal.Title>

                A Benchmark containing {Object.keys(selectedAttacks).length} vulnerabilities has been scheduled.
                Visit the management page for checking the advancement of the experiments.

                <button
                    onClick={() => window.location.href = "/pages/tasks/redteam/management"}
                    className={styles.allert_button}
                >
                    Go to Management Table <ChevronRight size={"var(--icon-size)"}/>
                </button>
            </Modal>

            {/* Attacks Selection */}
            <TableWrapper
                title='Vulnearbility selection'
                elements={attacks}
                showAttackCategories
                selectedElement={selectedAttacks}
                handleSelection={(id: string, visibleElements) => handleSelectionClick(
                    id,
                    selectedAttacks,
                    setSelectedAttacks,
                    attacks,
                    visibleElements
                )}
                handleParametersChange={(id: string, parameters: number[]) => {
                    handleParametersChange(
                        id,
                        parameters,
                        setSelectedAttacks,
                        selectedAttacks
                    )
                }}
            />

            {/* Metrics Selection */}
            <TableWrapper
                title='Metric Selection'
                elements={metrics}
                selectedElement={selectedMetrics}
                handleSelection={(id: string, visibleElements) => handleSelectionClick(
                    id,
                    selectedMetrics,
                    setSelectedMetrics,
                    metrics,
                    visibleElements
                )}
                handleParametersChange={(id: string, parameters: number[]) => {
                    handleParametersChange(id,
                        parameters,
                        setSelectedMetrics,
                        selectedMetrics)
                }}/>
        </div>
    )
};

export default Benchmark;
