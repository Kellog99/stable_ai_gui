"use client"
import { LucideIcon } from 'lucide-react';
import React, { useState } from 'react';
import styles from '@/styles/FileDropZone.module.css';
import SelectionButton from './utils/SelectionButtons';

interface Section {
    id: string,
    title: string,
    Icon: LucideIcon;
    child: React.FC;

}

interface FileDropZoneProps {
    sections: Section[];
    defaultActiveSection?: string;
}

const FileDropZone: React.FC<FileDropZoneProps> = ({
    sections,
    defaultActiveSection
}) => {
    const [activeSection, setActiveSection] = useState<string>(
        defaultActiveSection || sections[0]?.id || "selection"
    );

    const sectionsWithHandlers = sections.map(section => ({
        ...section,
        currentPage: activeSection,
        onClickHandle: () => setActiveSection(section.id)
    }));

    const currentSection = sectionsWithHandlers.find(s => s.id === activeSection);

    return (
        <div className={styles.containerDropzone}>

            <div className={styles.buttons}>
                {sectionsWithHandlers.map((sectionItem) => (
                    <SelectionButton
                        key={sectionItem.id}
                        id={sectionItem.id}
                        name={sectionItem.title}
                        Icon={sectionItem.Icon}
                        currentPage={sectionItem.currentPage}
                        onClickHandle={sectionItem.onClickHandle}
                    />
                ))}
            </div>

            <div className={styles.containerChild}>
                {currentSection && <currentSection.child />}
            </div>
        </div>
    );
}

export default FileDropZone;