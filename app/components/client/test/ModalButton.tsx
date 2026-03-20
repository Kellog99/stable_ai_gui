import { LucideIcon } from 'lucide-react'
import React, { useState } from 'react'
import { HoverCard, Text, Modal } from '@mantine/core';
import './ModalButton.css';

export interface ModalButtonProps {
    disabled: boolean,
    background: string,
    Icon: LucideIcon,
    hoverDescription: string,
    children?: React.ReactNode,
    modalTitle?: string,
    handleClick?: () => void,
}

const ModalButton: React.FC<ModalButtonProps> = ({
    disabled,
    background,
    Icon,
    hoverDescription,
    children,
    modalTitle,
    handleClick,
}) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);


    return (
        <>
            <HoverCard width={280} shadow="md">
                <HoverCard.Target>
                    <div>
                        <button
                            onClick={handleClick ? handleClick : () => setIsOpen(true)}
                            disabled={disabled}
                            style={{
                                background: background,
                                cursor: disabled ? 'not-allowed' : 'pointer'
                            }}
                            className="modal_button"
                        >
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

            <Modal
                opened={isOpen}
                onClose={() => setIsOpen(false)}
                title={modalTitle}
                size="auto"
                styles={{
                    title: {
                        color: 'black',
                        fontWeight: "bold",
                    }
                }}
                centered
            >
                {children}
            </Modal>
        </>
    )
}

export default ModalButton