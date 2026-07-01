import React, { useState } from 'react'
import './AtkCard.css';
import { Info, Settings2 } from 'lucide-react';
import ParametersWindow from '@/components/client/redtool/Parameters';
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

    const handleSettingsClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        handleClick();
        setIsClicked(true);
    }
    return (
        <div
            key={id}
            role='button'
            onClick={handleClick}
            className={`atk-card ${isActive ? 'active' : ''}`}
        >
            <div
                className='title_container'
                style={{ justifyContent: `${knowledge ? "space-between" : "center"}` }}>
                {title}
                {knowledge && (<div className='knowledge_container'>{knowledge}</div>)}
            </div>
            <div className="icons_container">
                <Tooltip
                    multiline
                    key={id}
                    w={220}
                    withArrow
                    transitionProps={{ duration: 200 }}
                    label={description}
                    style={{
                        fontSize: "0.6rem",
                        backgroundColor: "darkgray",
                        borderRadius: "12px",
                        color: "black"
                    }}
                >
                    <Info size={20} className='info_icon' />
                </Tooltip>
                <button
                    className='card-settings-btn'
                    onClick={handleSettingsClick}
                >
                    <Settings2 size={20} />
                </button>
            </div>
            <ParametersWindow
                isOpen={isClicked}
                parameters={parameters}
                onClose={() => setIsClicked(false)}
                handleParametersChange={handleParametersChange}
            />
        </div >
    )
}

export default AttackCard