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
    label?: string,
    opened?: boolean,
    onModalClose?: () => void,
}

const ModalButton: React.FC<ModalButtonProps> = ({
    disabled,
    Icon,
    children,
    modalTitle,
    handleClick,
    label,
    opened: externalOpened,
    onModalClose,
}) => {
    const [internalOpen, setInternalOpen] = useState<boolean>(false);
    const isOpen = externalOpened !== undefined ? externalOpened : internalOpen;

    const openModal = () => {
        if (handleClick) {
            handleClick();
            return;
        }
        if (externalOpened !== undefined) return;
        setInternalOpen(true);
    };

    const closeModal = () => {
        if (externalOpened !== undefined) {
            onModalClose?.();
        } else {
            setInternalOpen(false);
        }
    };


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
                        borderRadius: '8px',
                    }
                }}

            >
                <button
                    onClick={openModal}
                    disabled={disabled}
                    style={{
                        cursor: disabled ? 'not-allowed' : 'pointer'
                    }}
                    className={`modal_button ${label ? "with_label" : ""}`}
                >
                    <Icon />
                    {label && <span>{label}</span>}
                </button>

            </Tooltip>


            <Modal
                opened={isOpen}
                onClose={closeModal}
                title={modalTitle}
                size="auto"
                styles={{
                    content: {
                        backgroundColor: 'rgb(15, 23, 42)',
                        border: '1px solid rgba(148, 163, 184, 0.22)',
                        boxShadow: '0 24px 70px rgba(0, 0, 0, 0.45)',
                    },
                    header: {
                        backgroundColor: 'rgb(15, 23, 42)',
                        borderBottom: '1px solid rgba(148, 163, 184, 0.16)',
                    },
                    body: {
                        padding: '1rem',
                    },
                    title: {
                        color: 'white',
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