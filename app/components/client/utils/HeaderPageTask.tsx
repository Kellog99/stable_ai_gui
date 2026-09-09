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
* @param Icon: this is the icon to show as the representative
* @param title: title to show
* @param description: description of the page 
* @param buttonprops: these are all the attributes for the button 
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
                <Icon size={"calc(var(--icon-size) * 3)"} color='red' />
                <div>
                    <h1 style={{ margin: "0", fontSize: "2.1rem" }}>{title}</h1>
                    {description && (<p style={{ color: "lightgray", margin: 0, fontSize:"0.8rem" }}>{description}</p>)}
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