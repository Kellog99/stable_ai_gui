import React, { ReactNode, useState, useRef, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import { Minus, X } from 'lucide-react';
import { Button, Flex } from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleUp, faMinus, faX } from '@fortawesome/free-solid-svg-icons';
import useStore from '@/store/dsStore';

type MovableWindowProps = {
    children: ReactNode;
    title?: string;
    
};

const MovableWindow: React.FC<MovableWindowProps> = ( {
    children,
    title = "Selected Samples",
} ) =>
{
    const [ collapsed, setCollapsed ] = useState( false );
    const [ position, setPosition ] = useState( { x: 100, y: 100 } );
    //const [ size, setSize ] = useState( { width: 600, height: 500 } );
    const size = useStore((state) => state.size)
    const setSize = useStore((state) => state.setSize)
    const [ expandedPosition, setExpandedPosition ] = useState( { x: 100, y: 100 } );
    const [isDragging, setIsDragging] = useState(false)
    const [isResizing, setIsResizing] = useState(false)
    const rndRef = useRef<Rnd>( null );
    const setSelectedIndexes = useStore((state) => state.setSelectedIndexes)


    const [ viewportSize, setViewportSize ] = useState( {
        width: window.innerWidth,
        height: window.innerHeight
    } );
    


    useEffect( () =>
    {
        const handleResize = () =>
        {
            setViewportSize( {
                width: window.innerWidth,
                height: window.innerHeight
            } );

            
            if ( collapsed && rndRef.current ) {
                const newPos = getCollapsedPosition();
                rndRef.current.updatePosition( newPos );
            }
        };

        window.addEventListener( 'resize', handleResize );
        return () => window.removeEventListener( 'resize', handleResize );
    }, [ collapsed ] );


    const getCollapsedPosition = () => {
        if (typeof window !== 'undefined') {
          
          return { 
            x: position.x, 
            y: viewportSize.height - 190 // 40px is the header height
          };
        }
        return { x: position.x, y: viewportSize.height - 190 };
      };

    const toggleCollapse = () =>
    {
        if ( !collapsed ) {
            // Save current position before collapsing
            setExpandedPosition( { x: position.x, y: position.y } );
            setCollapsed( true );
        } else {
            // Restore to saved position when expanding
            setCollapsed( false );
        }
    };

    // Effect to update position when collapsed state changes
    useEffect( () =>
    {
        if ( collapsed && rndRef.current ) {
            const newPos = getCollapsedPosition();
            rndRef.current.updatePosition( newPos );
        } else if ( !collapsed && rndRef.current ) {
            rndRef.current.updatePosition( expandedPosition );
        }
    }, [ collapsed] );

    
    
    return (
        <Rnd
            ref={ rndRef }
            default={ {
                x: position.x,
                y: position.y,
                width: size.width,
                height: collapsed ? 40 : size.height,
            } }
            size={ {
                width: size.width,
                height: collapsed ? 40 : size.height
            } }
            position={ collapsed ? getCollapsedPosition() : expandedPosition }
            minWidth={ 280 }
            minHeight={ collapsed ? 40 : 200 }
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
                ...(!isDragging && !isResizing && {
                  transition: 'height 0.3s ease, transform 0.3s ease',
                }),
            } }
            onDragStart={() => setIsDragging(true)}
            onDragStop={(e, d) => {
                const newPos = { x: d.x, y: d.y };
                setPosition(newPos);
                setIsDragging(false)
            
                if (collapsed) {
                    // Update only the x coordinate of expandedPosition
                    setExpandedPosition(prev => ({ ...prev, x: newPos.x }));
                } else {
                    // Fully update expandedPosition
                    setExpandedPosition(newPos);
                }
            }}
            onResizeStart={() => setIsResizing(true)}
            onResizeStop={ ( e, direction, ref, delta, position ) =>
            {
                setIsResizing(false)
                setSize( {
                    width: parseInt( ref.style.width ),
                    height: parseInt( ref.style.height ),
                } );
                setPosition( position );
                if ( !collapsed ) {
                    setExpandedPosition( position );
                }
            } }
            
            dragAxis = {collapsed ? "x" : "both"}
            enableResizing={collapsed ? false : true}
            
        >
            <div
                className="drag-handle"
                style={ {
                    backgroundColor: '#f3f4f6',
                    padding: '10px',
                    borderBottom: collapsed ? 'none' : '1px solid rgba(209, 213, 219, 0.8)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: collapsed ? 'pointer' : 'move',
                    height: '40px',
                    boxSizing: 'border-box',
                } }
                
            >
                <span style={ { fontWeight: 'bold' } }>{ title }</span>
                <Flex direction="row" justify="end" style={ { gap: 0 } }>
                        <Button
                            variant="transparent"
                            radius="xl"
                            size="xs"
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleCollapse();
                              }}
                            style={ {
                                transition: "background-color 0.2s ease",
                                marginRight: "0"
                            } }
                            onMouseEnter={ ( e ) => e.currentTarget.style.backgroundColor = "#9CA3AF" } // Lighter gray
                            onMouseLeave={ ( e ) => e.currentTarget.style.backgroundColor = "transparent" }
                        >
                            { collapsed ? <FontAwesomeIcon icon={ faAngleUp } />  : <FontAwesomeIcon icon={ faMinus } /> }
                        </Button>
                        <Button
                            variant="transparent"
                            radius="xl"
                            size="xs"
                            onMouseDown={(e) => e.stopPropagation()}
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
                <div
                    style={ {
                        padding: '10px',
                        height: 'calc(100% - 40px)',
                        overflow: 'auto',
                        boxSizing: 'border-box',
                    } }
                >
                    { children }
                </div>
            ) }
        </Rnd>
    );
};

export default MovableWindow;