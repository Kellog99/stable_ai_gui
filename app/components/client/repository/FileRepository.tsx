import React, { useMemo, useState } from "react";
import { Trash2 } from "lucide-react";
import "./FileRepository.css";
import { DatasetInfo, ModelInfo } from "@/interfaces/homePageInterface";
import { TaskType } from "@/interfaces/NNInterfaces";
import InfoButton from "./InfoButton";

interface RepositoryProps {
    elements: ModelInfo[] | DatasetInfo[];
    handleDelete: (elem: ModelInfo | DatasetInfo) => void;
    handleSelection: (element: ModelInfo | DatasetInfo) => void;
}

const Repository: React.FC<RepositoryProps> = ({
    elements,
    handleDelete,
    handleSelection,
}) => {
    // This variable is for keeping, locally, track of the selected element
    const [selectedElement, setSelectedElement] = useState<string>("")

    const [searchQuery, setSearchQuery] = useState<string>('');
    const [taskFilter, setTaskFilter] = useState<TaskType | 'all'>('all');

    // Derive unique task options from the elements themselves
    const taskOptions = useMemo<Array<TaskType | 'all'>>(() => {
        const tasks = elements
            .map((e) => e.task)
            .filter((t): t is TaskType => Boolean(t));
        return ['all', ...Array.from(new Set(tasks))];
    }, [elements]);

    // Derive filtered list — no useEffect or redundant state needed
    const filteredElements = useMemo(() => {
        return elements.filter((elem) => {
            const matchesSearch = elem.name
                .toLowerCase()
                .includes(searchQuery.toLowerCase());

            const matchesTask =
                taskFilter === 'all' ||
                (elem.task ?? '').toLowerCase() === taskFilter.toLowerCase();

            return matchesSearch && matchesTask;
        });
    }, [elements, searchQuery, taskFilter]);



    return (
        <div className="file_repository_container">
            <div className="filters">
                <input
                    type="text"
                    className="search-input"
                    placeholder={`Search elements...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <select
                    className="task-select"
                    value={taskFilter}
                    onChange={(e) => setTaskFilter(e.target.value as TaskType | 'all')}
                >
                    {taskOptions.map((t) => (
                        <option key={t} value={t}>
                            {t === 'all'
                                ? 'All Tasks'
                                : t.charAt(0).toUpperCase() + t.slice(1)}
                        </option>
                    ))}
                </select>
            </div>
            <div className="table-wrapper">
                <table className="repository-table">
                    <thead className="table-header">
                        <tr>
                            <th>Info</th>
                            <th>Name</th>
                            <th>Task</th>
                            <th>Created</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredElements.map((elem: ModelInfo | DatasetInfo) => (
                            <tr
                                key={elem.id}
                                className={`table-row ${selectedElement === elem.id ? 'selected' : ''}`}
                                onClick={() => {
                                    handleSelection(elem)
                                    setSelectedElement(elem.id)
                                }}
                            >
                                <td>
                                    <InfoButton info={elem} />
                                </td>
                                <td>
                                    <div className="name-container">{elem.name}</div>
                                </td>
                                <td>
                                    <div className={`container_task ${elem.task ?? 'unknown'}`}>
                                        {elem.task ?? "Unknown"}
                                    </div>
                                </td>
                                <td>{elem.date ?? "Not registered"}</td>
                                <td>
                                    <button
                                        className="table-btn delete"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(elem);
                                        }}
                                    >
                                        <Trash2 size={18} color="red" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

    );
};

export default Repository;