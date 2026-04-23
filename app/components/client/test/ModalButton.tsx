import { LucideIcon } from 'lucide-react'
import React, { useState } from 'react'
import { Modal } from '@mantine/core';
import './ModalButton.css';
import { Tooltip } from '@mantine/core';

export interface ModalButtonProps {
    disabled: boolean,
    Icon: LucideIcon,
    children?: React.ReactNode,
    modalTitle?: string,
    handleClick?: () => void,
}

const ModalButton: React.FC<ModalButtonProps> = ({
    disabled,
    Icon,
    children,
    modalTitle,
    handleClick,
}) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);


    return (
        <>
            <Tooltip
                multiline
                w={180}
                label={"Click this button to see further results' information."}
                withArrow
                position="top"
                color="dark"
                styles={{
                    tooltip: {
                        fontSize: '0.55rem',
                        borderRadius: '8px', // or '12px', '0.7rem', etc.
                    }
                }}

            >
                <button
                    onClick={handleClick ? handleClick : () => setIsOpen(true)}
                    disabled={disabled}
                    style={{
                        cursor: disabled ? 'not-allowed' : 'pointer'
                    }}
                    className="modal_button"
                >
                    <Icon />
                </button>

            </Tooltip>


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