import { HardDrive } from "lucide-react";
import "./FileRepository.css"
import React from "react";

export interface CardProps {
    id: string,
    name: string,
    image?: string,
    task: string,
    handleClick?: (id: string) => void,
    [key: string]: any, // Allows any additional properties
}

// This component has the role to produce the cards for the reports' repositories.
// The TITANN and DQ report's abstract have the same structure
const RepositoryCard: React.FC<CardProps> = ({
    id,
    name,
    image,
    task,
    handleClick,
    ...args
}) => {
    return (
        <button
            className="card"
            onClick={() => { handleClick ? handleClick(id) : null }}>
            <div className="card-content">
                {
                    image ? <img src={image} alt={name} /> : <HardDrive size={"var(--icon-size)"} />
                }
                <h3>{name}</h3>
            </div>
            <div className="card-content">
                <p>task: {task}</p>
                {Object.entries(args).map(([key, value]) => (
                    <p key={key}>{key}: {value}</p>
                ))}
            </div>
        </button>
    )
}
export default RepositoryCard;