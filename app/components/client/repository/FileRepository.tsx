import React, {ChangeEvent, MouseEvent, useEffect, useMemo, useState} from "react";
import {type LucideIcon, RefreshCw} from "lucide-react";
import "./FileRepository.css";
import {DatasetInfo, InfoUploader, ModelInfo, ModelType, Task} from "@/interfaces/homePageInterface";
import {ModelReportProps} from "@/interfaces/reportInterfaces";
import InfoButton from "./InfoButton";
import {InfoLoader} from "./InfoLoader";

export type RepositoryType = "model" | "dataset";
export type RepositoryElement = ModelInfo | DatasetInfo | ModelReportProps;

export interface FileRepositoryProps<T extends RepositoryElement> {
    title: string;
    description: string;
    elements: T[];
    Icon: LucideIcon;
    fileDropInformation: InfoUploader;
    handleSelection: (element: T | null) => void;
    handleRefresh?: () => void;
    repositoryType: RepositoryType;
}

type TaskFilter = Task | "all";
type ModelTypeFilter = ModelType | "all";

const getElementInfo = (element: RepositoryElement): ModelInfo | DatasetInfo =>
    "info" in element ? element.info : element;

const isModelInfo = (element: ModelInfo | DatasetInfo): element is ModelInfo =>
    "parameters" in element;

const getModelType = (element: RepositoryElement): ModelType | "N/A" => {
    const info = getElementInfo(element);
    return isModelInfo(info) ? info.model_type ?? "Unknown" as ModelType : "N/A";
};

const FileRepository = <T extends RepositoryElement, >(
    {
        title,
        description,
        elements,
        Icon,
        fileDropInformation,
        handleSelection,
        handleRefresh,
        repositoryType,
    }: FileRepositoryProps<T>) => {

    // NB: assumes `id` is unique within `elements`. If it is not, the fix
    // belongs upstream (data source), not in the selection key here.
    const [selectedId, setSelectedId] = useState<T["id"] | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [taskFilter, setTaskFilter] = useState<TaskFilter>("all");
    const [modelTypeFilter, setModelTypeFilter] = useState<ModelTypeFilter>("all");

    const showModelType: boolean = repositoryType === "model";

    // ####################################################################################################
    // these are all the options and model type that are taken from the registered objects
    const [taskOptions, setTaskOptions] = useState<TaskFilter[]>(["all"]);
    const [modelTypeOptions, setModelTypeOptions] = useState<ModelTypeFilter[]>(["all"]);

    useEffect(() => {
        const tasks: Task[] = elements
            .map((element: T): Task => getElementInfo(element).task)
            .filter((task: Task): task is Task => Boolean(task));
        const modelTypes: ModelType[] = elements
            .map((element: T) => {
                const info = getElementInfo(element);
                return isModelInfo(info) ? info.model_type : undefined;
            })
            .filter((modelType): modelType is ModelType => Boolean(modelType));

        setTaskOptions(["all", ...Array.from(new Set(tasks))]);
        setModelTypeOptions(["all", ...Array.from(new Set(modelTypes))]);
    }, [elements]);
    // ####################################################################################################

    const filteredElements: T[] = useMemo<T[]>(() => {
        const query: string = searchQuery.trim().toLowerCase();

        return elements
            .filter((elem: T): boolean => {
                const info = getElementInfo(elem);
                const matchesSearch = info.name.toLowerCase().includes(query);

                const matchesTask =
                    taskFilter === "all" ||
                    (info.task ?? "").toLowerCase() === taskFilter.toLowerCase();

                const matchesModelType =
                    !showModelType ||
                    modelTypeFilter === "all" ||
                    (isModelInfo(info) && info.model_type === modelTypeFilter);

                return matchesSearch && matchesTask && matchesModelType;
            })
            .sort((first: T, second: T): number =>
                showModelType
                    ? getModelType(first).localeCompare(getModelType(second)) ||
                    getElementInfo(first).name.localeCompare(getElementInfo(second).name)
                    : getElementInfo(first).name.localeCompare(getElementInfo(second).name)
            );
    }, [elements, searchQuery, taskFilter, modelTypeFilter, showModelType]);

    // Selection is derived state w.r.t. the current filter: if the selected
    // element is filtered out, both local and parent state are cleared.
    useEffect(() => {
        if (selectedId === null) return;
        const stillVisible = filteredElements.some((e: T) => e.id === selectedId);
        if (!stillVisible) {
            setSelectedId(null);
            handleSelection(null);
        }
    }, [filteredElements, selectedId, handleSelection]);
    const onRowClick = (elem: T): void => {
        if (elem.id !== selectedId) {
            handleSelection(elem);
            setSelectedId(elem.id);
        } else {
            handleSelection(null);
            setSelectedId(null);
        }
    };


    const onRefreshClick = (event: MouseEvent<HTMLButtonElement>): void => {
        event.stopPropagation();
        setSelectedId(null);
        handleSelection(null);
        handleRefresh?.();
    };

    return (
        <div className="repository-panel">
            <div className="repository-panel-header">
                <Icon size={42}/>
                <div>
                    <div className={"repository-panel-title"}>
                        <p>{title} Selection</p>
                        <InfoLoader config={fileDropInformation}/>
                    </div>
                    <p className="repository-panel-description">{description}</p>

                </div>

            </div>
            <div className="file_repository_container">
                <div className={`repository-filters ${showModelType ? "has-model-type-filter" : ""}`}>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search elements..."
                        value={searchQuery}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                    />
                    <div className="task-filter-group">
                        <select
                            className="task-select"
                            value={taskFilter}
                            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                                setTaskFilter(e.target.value as TaskFilter)
                            }
                        >
                            {taskOptions.map((t: TaskFilter) => (
                                <option key={t} value={t}>
                                    {t === "all" ? "All" : t.charAt(0).toUpperCase() + t.slice(1)}
                                </option>
                            ))}
                        </select>
                        {showModelType && (
                            <select
                                className="model-type-select"
                                value={modelTypeFilter}
                                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                                    setModelTypeFilter(e.target.value as ModelTypeFilter)
                                }
                            >
                                {modelTypeOptions.map((modelType: ModelTypeFilter) => (
                                    <option key={modelType} value={modelType}>
                                        {modelType === "all" ? "All" : modelType}
                                    </option>
                                ))}
                            </select>
                        )}
                        {handleRefresh && (
                            <button
                                type="button"
                                className="refresh-repository-button"
                                onClick={onRefreshClick}
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
                        {filteredElements.map((elem: T) => {
                            const isSelected = elem.id === selectedId;
                            const info = getElementInfo(elem);
                            return (
                                <tr
                                    key={`${repositoryType}-${elem.id}`}
                                    className={`table-row ${isSelected ? "selected" : ""}`}
                                    onClick={() => onRowClick(elem)}
                                >
                                    <td>
                                        <InfoButton info={info}/>
                                    </td>
                                    <td>
                                        <div className="name-container">{info.name}</div>
                                    </td>
                                    <td className="task-column">
                                        <div className={`container_task ${info.task ?? "unknown"}`}>
                                            {info.task ?? "Unknown"}
                                        </div>
                                    </td>
                                    {showModelType && (
                                        <td className="model-type-column">{getModelType(elem)}</td>
                                    )}
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default FileRepository;
