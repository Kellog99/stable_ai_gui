import React from 'react';
import './HeaderPageTask.css';
import { HoverCard } from '@mantine/core';
import { CircleArrowRight, LucideIcon } from 'lucide-react';

export interface ButtonsProps {
    description: string,
    isDisabled?: boolean,
    handleClick?: () => void,
    disabledDescription?: string,
    Icon?: LucideIcon
}

export interface HeaderPageTaskProps {
    Icon: LucideIcon,
    title: string,
    descrition?: string,
    buttonprops?: ButtonsProps
}

const HeaderPageTask: React.FC<HeaderPageTaskProps> = ({
    Icon,
    title,
    descrition,
    buttonprops
}) => {

    return (
        <div className='container-header'>
            <div className='container-title'>
                <Icon size={"calc(var(--icon-size) * 5)"} color='red' />
                <div>
                    <h1 style={{ margin: "0", fontSize: "2.5rem" }}>{title}</h1>
                    {descrition && (<p style={{ color: "lightgray", margin: 0 }}>{descrition}</p>)}
                </div>
            </div>
            {
                buttonprops ?
                    <HoverCard
                        width={170}
                        shadow="md"
                        disabled={!buttonprops.isDisabled}>
                        <HoverCard.Target>
                            <div>
                                <button
                                    disabled={buttonprops.isDisabled}
                                    onClick={buttonprops.handleClick}
                                    className={`header-button ${buttonprops.isDisabled ? 'disabled' : ''}`}>
                                    {buttonprops.description} {buttonprops.Icon ? <buttonprops.Icon size={25} /> : <CircleArrowRight size={25} />}
                                </button>
                            </div>
                        </HoverCard.Target>
                        <HoverCard.Dropdown>{buttonprops.disabledDescription}</HoverCard.Dropdown>
                    </HoverCard>
                    : null
            }
        </div>
    )
}

export default HeaderPageTask;