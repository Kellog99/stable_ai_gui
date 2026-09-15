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
    description?: string,
    button_props?: ButtonsProps
}
/**
 * Renders the title area shared by task pages, optionally with an action
 * button and a tooltip explaining why that action is unavailable.
 *
 * @param props - Component properties.
 * @param props.Icon - Lucide icon displayed beside the page title.
 * @param props.title - Main page title.
 * @param props.description - Optional text displayed below the title.
 * @param props.button_props - Optional configuration for the action button.
 */
const HeaderPageTask: React.FC<HeaderPageTaskProps> = ({
    Icon,
    title,
    description,
    button_props
}) => {

    return (
        <div className='container-header'>
            <div className='container-title'>
                <Icon className="page-task-icon" size={"calc(var(--icon-size) * 2)"} />
                <div>
                    <h1 className="page-task-title">{title}</h1>
                    {description && (<p className="page-task-description">{description}</p>)}
                </div>
            </div>
            {
                button_props ?
                    <HoverCard
                        width={170}
                        shadow="md"
                        disabled={!button_props.isDisabled}>
                        <HoverCard.Target>
                            <div>
                                <button
                                    disabled={button_props.isDisabled}
                                    onClick={button_props.handleClick}
                                    className={`header-button ${button_props.isDisabled ? 'disabled' : ''}`}>
                                    {button_props.description} {button_props.Icon ? <button_props.Icon size={25} /> : <CircleArrowRight size={25} />}
                                </button>
                            </div>
                        </HoverCard.Target>
                        <HoverCard.Dropdown>{button_props.disabledDescription}</HoverCard.Dropdown>
                    </HoverCard>
                    : null
            }
        </div>
    )
}

export default HeaderPageTask;
