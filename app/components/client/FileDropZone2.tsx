"use client"
import { LucideIcon } from 'lucide-react';
import React, { useState } from 'react';
import styles from '../../styles/FileDropZone.module.css';
import SelectionButton from './utils/SelectionButtons';

interface Section
{
    id: string,
    title: string,
    Icon: LucideIcon;
    child: React.FC;

}

interface FileDropZoneProps
{
    sections: Section[];
    defaultActiveSection?: string;
}

export function FileDropZone ( { sections, defaultActiveSection }: FileDropZoneProps )
{
    const [ activeSection, setActiveSection ] = useState<string>(
        defaultActiveSection || sections[ 0 ]?.id || "selection"
    );

    const sectionsWithHandlers = sections.map( section => ( {
        ...section,
        currentPage: activeSection,
        onClickHandle: () => setActiveSection( section.id )
    } ) );

    const currentSection = sectionsWithHandlers.find( s => s.id === activeSection );

    return (
        <div className={ styles.containerDropzone }>

            <div className={ styles.buttons }>
                { sectionsWithHandlers.map( ( sectionItem ) => (
                    <SelectionButton
                        key={ sectionItem.id }
                        id={ sectionItem.id }
                        name={ sectionItem.title }
                        Icon={ sectionItem.Icon }
                        currentPage={ sectionItem.currentPage }
                        onClickHandle={ sectionItem.onClickHandle }
                    />
                ) ) }
            </div>

            <div style={ {
                width:"30vw",
                minHeight:"40vh",
                border: "1px solid #ccc",
                borderRadius: "8px",
                background: "rgba(255, 255, 255, 0.4)",
                padding: "16px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            } }>
                { currentSection && <currentSection.child /> }
            </div>
        </div>
    );
}

export default FileDropZone;