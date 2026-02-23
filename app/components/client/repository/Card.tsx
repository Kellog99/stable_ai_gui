import { HardDrive, Trash, Trash2Icon } from "lucide-react";
import "./FileRepository.css"
import React from "react";
import { DatasetInfo, ModelInfo } from "@/interfaces/NNInterfaces";

export interface RepositoryCardProps {
    config: ModelInfo | DatasetInfo,
    notShow?: string[],
    activeId?: string,
    handleClick: () => void,
    handleDelete: () => void,

}

// This component has the role to produce the cards for the reports' repositories.
// The TITANN and DQ report's abstract have the same structure
const RepositoryCard: React.FC<RepositoryCardProps> = ({
    config,
    activeId,
    notShow = ["image", "id", "name"],
    handleClick,
    handleDelete
}) => {
    console.log(config)
    return (
        <div
            className={`${activeId === config.id ? "card active" : "card"}`}
            onClick={handleClick}>
            <div className="card-header">
                <div className="card-title">
                    {
                        config.image ? <img src={config.image} alt={config.name} /> : <HardDrive size={"calc(var(--icon-size) /2)"} />
                    }
                    <p className="title">{config.name}</p>
                </div>
                <button
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent event from bubbling to parent
                        handleDelete();
                    }}
                    className="card-btn-delete">
                    <Trash2Icon size={"calc(var(--icon-size) / 1.6)"} color="red" />
                </button>
            </div>
            <div className="card-content">
                {Object.entries(config).map(([key, value]) => (
                    value && !notShow.includes(key) ?
                        <p key={key} className="card-element"><b>{key}</b>: {value}</p>
                        : null
                ))}
            </div>
        </div>
    )
}
export default RepositoryCard;