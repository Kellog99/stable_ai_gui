import React, {useMemo, useState} from "react";
import {RefreshCw} from "lucide-react";
import "./FileRepository.css";
import {DatasetInfo, ModelInfo, ModelType} from "@/interfaces/homePageInterface";
import {TaskType} from "@/interfaces/NNInterfaces";
import InfoButton from "./InfoButton";

export type RepositoryType = "model" | "dataset";

export interface FileRepositoryProps<T extends ModelInfo | DatasetInfo> {
    elements: T[];
    handleSelection: (element: T | null) => void;
    handleRefresh?: () => void;
    repositoryType: RepositoryType;
}

const getModelType = (element: ModelInfo | DatasetInfo) =>
    "model_type" in element ? element.model_type ?? "Unknown" : "N/A";

const isModelInfo = (element: ModelInfo | DatasetInfo): element is ModelInfo =>
    "parameters" in element;

const Repository = <T extends ModelInfo | DatasetInfo>(
    {
        elements,
        handleSelection,
        handleRefresh,
        repositoryType,
    }: FileRepositoryProps<T>) => {
    // This variable is for keeping, locally, track of the selected element
    const [selectedElement, setSelectedElement] = useState<string>("")

    const [searchQuery, setSearchQuery] = useState<string>('');
    const [taskFilter, setTaskFilter] = useState<TaskType | 'all'>('all');
    const [modelTypeFilter, setModelTypeFilter] = useState<ModelType | 'all'>('all');
    const showModelType = repositoryType === "model";

    // Derive unique task options from the elements themselves
    const taskOptions = useMemo<Array<TaskType | 'all'>>(() => {
        const tasks = elements
            .map((e) => e.task)
            .filter((t): t is TaskType => Boolean(t));
        return ['all', ...Array.from(new Set(tasks))];
    }, [elements]);

    const modelTypeOptions = useMemo<Array<ModelType | 'all'>>(() => {
        const modelTypes = elements
            .map((element) => isModelInfo(element) ? element.model_type : undefined)
            .filter((modelType): modelType is ModelType => Boolean(modelType));
        return ['all', ...Array.from(new Set(modelTypes))];
    }, [elements]);

    // Derive the filtered and ordered list — no useEffect or redundant state needed
    const filteredElements = useMemo(() => {
        return elements
            .filter((elem) => {
                const matchesSearch = elem.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase());

                const matchesTask =
                    taskFilter === 'all' ||
                    (elem.task ?? '').toLowerCase() === taskFilter.toLowerCase();

                const matchesModelType =
                    !showModelType ||
                    modelTypeFilter === 'all' ||
                    (isModelInfo(elem) && elem.model_type === modelTypeFilter);

                return matchesSearch && matchesTask && matchesModelType;
            })
            .sort((first, second) =>
                getModelType(first).localeCompare(getModelType(second)) ||
                first.name.localeCompare(second.name)
            );
    }, [elements, searchQuery, taskFilter, modelTypeFilter, showModelType]);


    return (
        <div className="file_repository_container">
            <div className={`repository-filters ${showModelType ? 'has-model-type-filter' : ''}`}>
                <input
                    type="text"
                    className="search-input"
                    placeholder={`Search elements...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="task-filter-group">
                    <select
                        className="task-select"
                        value={taskFilter}
                        onChange={(e) => setTaskFilter(e.target.value as TaskType | 'all')}
                    >
                        {taskOptions.map((t) => (
                            <option key={t} value={t}>
                                {t === 'all'
                                    ? 'All'
                                    : t.charAt(0).toUpperCase() + t.slice(1)}
                            </option>
                        ))}
                    </select>
                    {showModelType && (
                        <select
                            className="model-type-select"
                            value={modelTypeFilter}
                            onChange={
                                (e) => setModelTypeFilter(e.target.value as ModelType | 'all')
                            }
                        >
                            {modelTypeOptions.map((modelType) => (
                                <option key={modelType} value={modelType}>
                                    {modelType === 'all' ? 'All' : modelType}
                                </option>
                            ))}
                        </select>
                    )}
                    {handleRefresh && (
                        <button
                            type="button"
                            className="refresh-repository-button"
                            onClick={(event) => {
                                // Keep the refresh action scoped to the repository controls.
                                // This also makes the optional callback safe for repositories
                                // that do not provide refresh support (for example reports).
                                event.stopPropagation();
                                setSelectedElement("");
                                handleRefresh?.();
                            }}
                            aria-label="Refresh repository"
                            data-tooltip="Update the repository list"
                        >
                            <RefreshCw size={16}/>
                        </button>
                    )}
                </div>
            </div>
            <div className="repository-table-wrapper">
                <table className="repository-table">
                    <colgroup>
                        <col className="info-table-column"/>
                        <col/>
                        <col className="task-table-column"/>
                        {showModelType && <col className="model-type-table-column"/>}
                    </colgroup>
                    <thead className="table-header">
                    <tr>
                        <th></th>
                        <th>Name</th>
                        <th className="task-column">Task</th>
                        {showModelType && <th className="model-type-column">Model Type</th>}
                    </tr>
                    </thead>
                    <tbody>
                    {filteredElements.map((elem: T) => (
                        <tr
                            key={elem.id}
                            className={`table-row ${selectedElement === elem.id ? 'selected' : ''}`}
                            onClick={() => {
                                if (elem.id !== selectedElement) {
                                    handleSelection(elem)
                                    setSelectedElement(elem.id)
                                } else {
                                    handleSelection(null)
                                    setSelectedElement("")
                                }
                            }}
                        >
                            <td>
                                <InfoButton info={elem}/>
                            </td>
                            <td>
                                <div className="name-container">{elem.name}</div>
                            </td>
                            <td className="task-column">
                                <div className={`container_task ${elem.task ?? 'unknown'}`}>
                                    {elem.task ?? "Unknown"}
                                </div>
                            </td>
                            {showModelType && <td className="model-type-column">{getModelType(elem)}</td>}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>

    );
};

export default Repository;
