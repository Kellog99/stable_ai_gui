import React from 'react';
import OptionCard from '@/components/client/redtool/OptionCard';
import './TableWrapper.css';
import { LucideIcon } from 'lucide-react';
import { RegisterObjectProps } from '@/interfaces/NNInterfaces';

interface TableWrapperProps {
    elements: Map<string, RegisterObjectProps>;
    selectedElement: Map<string, RegisterObjectProps>;
    Icon: LucideIcon
    handleSelection: (id: string) => void;
}

const TableWrapper: React.FC<TableWrapperProps> = ({
    elements,
    selectedElement,
    handleSelection,
    Icon
}) => {
    // Type guard to check if element is AttackProps
    const getTags = (element: RegisterObjectProps) => {
        const tags = []
        if (typeof element.task !== 'undefined') {
            tags.push(element.task)
        }
        if (typeof element.knowledge !== 'undefined') {
            tags.push(element.knowledge)
        }
        return tags.length > 0 ? tags : undefined
    };

    return (
        <div className="wrapper">
            <div className="header">
                <div>
                    <h2 className="table-title">Elements</h2>
                    <p className="subtitle">
                        Selected: {Object.keys(selectedElement).length} / {Object.keys(elements).length}
                    </p>
                </div>
                <div className='buttons-container'>
                    <button
                        className="button"
                        onClick={() => { handleSelection("all") }}
                    > Select All </button>
                    <button
                        className="button"
                        onClick={() => { handleSelection("none") }}> Deselect All </button>
                </div>
            </div>

            <div className="scroll-container">
                <ul className='list'>
                    {Object.entries(elements).map(([id, element]) => (
                        <li key={id} className='list-item'>
                            <OptionCard
                                id={id}
                                name={element.name}
                                tags={getTags(element)}
                                description={element.description}
                                parameters={element.parameters}
                                isSelected={id in selectedElement}
                                onSelect={() => handleSelection(element.id)}
                                Icon={Icon}
                            />
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default TableWrapper;