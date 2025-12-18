import { HardDrive, Trash2Icon } from "lucide-react";
import "./FileRepository.css"
import React from "react";
import { DatasetInfo} from "@/interfaces/NNInterfaces";
import { DQReportProps } from "@/interfaces/reportInterfaces";

export interface RepositoryCardProps {
    config: DatasetInfo,
    notShow?: string[],
    show?: Object,
    activeId?: string,
    handleClick: () => void,
    handleDelete: () => void,

}

// This component has the role to produce the cards for the reports' repositories.
// The TITANN and DQ report's abstract have the same structure
const RepositoryCard: React.FC<RepositoryCardProps> = ({
    config,
    activeId,
    notShow = ["image", "id", "name", "features", "edges", "prototype", "samples_per_class", "bboxes_areas", "bboxes_per_sample", "default_embedding_model"],
    handleClick,
    handleDelete
}) => {

    function reconstructReport(report: DQReportProps) {
        const output: Record<string, number | string> = {
            name: report.dataset.name
        };

        for (const metric of report.metrics) {
            const results = metric.results
            const key: string =
                results.name === "accuracy" ? results.mode! : results.name;

            output[key] = results.score.toFixed(2);
        }

        return output;
    }


    function normalizeConfig(config: unknown) {
        if ((config as any).tool === "dq") {
            return reconstructReport(config as DQReportProps);
        }
        return config;
    }

    const configToShow = normalizeConfig(config) as  DatasetInfo;

    return (
        <div
            className={`${activeId === configToShow.id ? "card active" : "card"}`}
            onClick={handleClick}>
            <div className="card-header">
                <div className="card-title">
                    {
                        configToShow.image ? <img src={configToShow.image} alt={configToShow.name} /> : <HardDrive size={"calc(var(--icon-size) /2)"} />
                    }
                    <p className="title">{configToShow.name}</p>
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
                {Object.entries(configToShow).map(([key, value]) => (
                    value && !notShow.includes(key) ?
                        <p key={key} className="card-element"><b>{key}</b>: {value}</p>
                        : null
                ))}
            </div>
        </div>
    )
}
export default RepositoryCard;