import React, { useState } from "react";
import { Info, Trash2 } from "lucide-react";
import "./FileRepository.css";
import { Modal, Table, TableData } from "@mantine/core";
import { DatasetInfo, ModelInfo } from "@/interfaces/homePageInterface";

interface RepositoryProps {
    activeId: string | undefined,
    elements: ModelInfo[] | DatasetInfo[];
    handleDelete: (elem: ModelInfo | DatasetInfo) => void;
    selectHandle: (element: ModelInfo | DatasetInfo) => void;
}

const Repository: React.FC<RepositoryProps> = ({
    activeId,
    elements,
    handleDelete,
    selectHandle,
}) => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [info, setInfo] = useState<ModelInfo | DatasetInfo | undefined>(undefined)

    const activeModal: TableData = {
        body: info ? Object.entries(info)
            .filter(([key, value]) => !["id", "name"].includes(key) && value)
            .map(([key, value]) => { return [key.replace("_", " "), value] }) : []
    }
    return (
        <div className="table-wrapper">
            <table className="repository-table">
                <thead className="table-header">
                    <tr>
                        <th>Name</th>
                        <th>Created</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {elements.map((elem: ModelInfo | DatasetInfo) => (
                        <tr
                            key={elem.id}
                            className={`table-row ${activeId && activeId === elem.id ? 'selected' : ''}`}
                            onClick={() => selectHandle(elem)}
                        >
                            <td>
                                <div className="name-container">
                                    <button
                                        className="table-btn info"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setInfo(elem);
                                            setIsOpen(true);
                                        }}
                                    >
                                        <Info size={18} />
                                    </button>
                                    {elem.name}
                                </div>
                            </td>
                            <td>{elem.date ? elem.date : "Not registered"}</td>
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
            <Modal
                opened={isOpen}
                onClose={() => setIsOpen(false)}
                centered
                size="auto"
                title="File Information"
                styles={{
                    title: {
                        color: 'black',
                        fontWeight: 'bold',
                        fontSize: "1.2rem"
                    }
                }}
            >
                {info ?
                    <>
                        <p style={{ marginBottom: "10px", fontSize: "0.9rem" }}>
                            Here below it is possible to read advance information for the file <b>{info?.name}</b>.
                        </p>
                        <Table
                            w={"500px"}
                            variant="vertical"
                            layout="fixed"
                            withTableBorder
                            data={activeModal}
                            className="info-table"
                        />
                    </> :
                    <p>"No more info to display"</p>}
            </Modal>
        </div>

    );
};

export default Repository;