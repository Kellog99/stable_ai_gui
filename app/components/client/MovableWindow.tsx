"use client"

import { Box, Button, Flex, Textarea } from "@mantine/core";
import { ReactNode, useState } from "react";
import { Rnd } from "react-rnd";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import
{
    faMinus, faX
} from '@fortawesome/free-solid-svg-icons';
import useStore from "@/store/dsStore";

type MovableWindowProps = {
    children: ReactNode;
};

export function MovableWindow ( { children }: MovableWindowProps )
{

    const [ collapsed, setCollapsed ] = useState( false );
    const setSelectedIndexes = useStore((state) => state.setSelectedIndexes)

    return (
        <>

            <Rnd
                default={ {
                    x: 100,
                    y: 100,
                    width: 600,
                    height: collapsed ? 40 : 500,
                } }
                minWidth={ 280 }
                minHeight={ 200 }
                bounds="window"
                dragHandleClassName="drag-handle"
                style={ {
                    background: 'rgba(255, 255, 255, 0.85)',
                    backdropFilter: 'blur(8px)',
                    borderRadius: '10px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                    border: '1px solid rgba(209, 213, 219, 0.8)',
                    zIndex: 1000,
                    overflow: 'hidden',
                } }

            >
                <div
                    className="drag-handle"
                    style={ {
                        backgroundColor: '#f3f4f6', // Tailwind's gray-100
                        padding: '10px',
                        borderBottom: '1px solid rgba(209, 213, 219, 0.8)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'move'
                    } }>
                    <span style={ { fontWeight: 'bold' } }>Selected Images</span>
                    <Flex direction="row" justify="end" style={ { gap: 0 } }>
                        <Button
                            variant="transparent"
                            radius="xl"
                            size="xs"
                            onClick={ () => setCollapsed( !collapsed ) }
                            style={ {
                                transition: "background-color 0.2s ease",
                                marginRight: "0"
                            } }
                            onMouseEnter={ ( e ) => e.currentTarget.style.backgroundColor = "#9CA3AF" } // Lighter gray
                            onMouseLeave={ ( e ) => e.currentTarget.style.backgroundColor = "transparent" }
                        >
                            { collapsed ? "▼" : <FontAwesomeIcon icon={ faMinus } /> }
                        </Button>
                        <Button
                            variant="transparent"
                            radius="xl"
                            size="xs"
                            onClick={() => setSelectedIndexes([])}
                            style={ {
                                transition: "background-color 0.2s ease",
                            } }
                            onMouseEnter={ ( e ) => e.currentTarget.style.backgroundColor = "#FCA5A5" } // Lighter red
                            onMouseLeave={ ( e ) => e.currentTarget.style.backgroundColor = "transparent" }
                        >
                            <FontAwesomeIcon icon={ faX } />
                        </Button>
                    </Flex>
                </div>


                { !collapsed && (
                    <div style={ {
                        backdropFilter: 'blur(8px)',
                        padding: '10px',
                        flexGrow: 1,
                        overflow: 'auto',
                    } }>
                        { children }
                    </div>
                ) }

            </Rnd >

        </>
    )
}