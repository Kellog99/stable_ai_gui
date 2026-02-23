import { LucideIcon } from 'lucide-react'
import React from 'react'
import { HoverCard, Text } from '@mantine/core';
import './ModalButton.css';

export interface ModalButtonProps {
    disabled: boolean,
    background: string,
    Icon: LucideIcon,
    hoverDescription: string,
    handleClick: () => void,
}

const ModalButton: React.FC<ModalButtonProps> = ({
    disabled,
    background,
    Icon,
    handleClick,
    hoverDescription
}) => {
    return (
        <>
            {!disabled ? (
                <HoverCard width={280} shadow="md">
                    <HoverCard.Target>
                        <div>
                            <button
                                onClick={handleClick}
                                style={{ backgroundColor: background }}
                                className="button">
                                <Icon />
                            </button>
                        </div>
                    </HoverCard.Target>
                    <HoverCard.Dropdown>
                        <Text size="sm" c="black">
                            {hoverDescription}
                        </Text>
                    </HoverCard.Dropdown>
                </HoverCard>
            ) : (
                <div>
                    <button
                        onClick={handleClick}
                        style={{ backgroundColor: background }}
                        className="button inactive"
                        disabled={true}>
                        <Icon />
                    </button>
                </div>
            )}
        </>
    )
}

export default ModalButton