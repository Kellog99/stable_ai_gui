import React, { useState } from 'react'
import './AtkCard.css';
import { Circle, InfoIcon, Settings } from 'lucide-react';
import ParametersWindow from '@/components/redtool/Parameters';
import { ParametersProps } from '@/interfaces/NNInterfaces';
import { Tooltip } from '@mantine/core';

/**
 * Processes a user's subscription.
 * @param id - attack's id
 * @param title - it represent the attack's name
 * @param parameters - attack's parameters
 * @param handleClick - it handles the selection of a specific AtkCard
 * @param handleParametersChange - It handles the change of the attack's parameters
*/

export interface AttackCardProps {
    id: string,
    title: string,
    description: string,
    knowledge?: string,
    isActive: boolean,
    parameters: ParametersProps[],
    handleClick: () => void;
    handleParametersChange: (parameters: (number | string)[]) => void;
}

const AttackCard: React.FC<AttackCardProps> = ({
    id,
    title,
    isActive,
    description,
    knowledge,
    parameters,
    handleClick,
    handleParametersChange
}) => {
    const [isClicked, setIsClicked] = useState<boolean>(false)
    const [showDescription, setShowDescription] = useState<boolean>(false)

    const handleInfoClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowDescription(!showDescription);
    }

    const handleSettingsClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        handleClick();
        setIsClicked(true);
    }
    return (
        <div
            key={id}
            onClick={handleClick}
            className={`atk-card ${isActive ? 'active' : ''} ${showDescription ? 'expanded' : ''}`}
        >
            <div className="card-header">
                <div className='header-name'>
                    <button
                        className='card-settings-btn'
                        onClick={handleSettingsClick}
                    >
                        <Settings size={20} />
                    </button>
                    {knowledge && (
                        <Circle
                            size={12}
                            color={"transparent"}
                            fill={knowledge}
                        />
                    )}
                    <div className='title-scroll'>
                        {title}
                    </div>

                </div>
                <Tooltip
                    multiline
                    w={220}
                    withArrow
                    style={{ fontSize: "0.6rem" }}
                    label={description}
                >
                    <InfoIcon size={20} color="#e8fa42ce" />
                </Tooltip>
            </div>

            {showDescription && (
                <div className="card-description">{description}</div>
            )}

            <ParametersWindow
                isOpen={isClicked}
                parameters={parameters}
                onClose={() => setIsClicked(false)}
                handleParametersChange={handleParametersChange}
            />
        </div>
    )
}

export default AttackCard