import React from 'react';
import OptionCard from '@/components/client/redtool/OptionCard';
import './TableWrapper.css';
import { LucideIcon } from 'lucide-react';
import { RegisterObjectProps } from '@/interfaces/NNInterfaces';

interface TableWrapperProps {
    elements: RegisterObjectProps[];
    selectedElement: Set<string>;
    Icon: LucideIcon
    setSelectedElements: (ids: Set<string>) => void;
}

const TableWrapper: React.FC<TableWrapperProps> = ({
    elements,
    selectedElement,
    setSelectedElements,
    Icon
}) => {

    const handleSelection = (
        id: string,
    ) => {
        let newSelected = new Set(selectedElement)
        if (newSelected.has(id)) {
            newSelected.delete(id)
        }
        else {
            newSelected.add(id)
        }
        setSelectedElements(newSelected);
    };

    // Count of selected elements
    const selectedCount = selectedElement.size;

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
                        Selected: {selectedCount} / {elements.length}
                    </p>
                </div>
                <div className='buttons-container'>
                    <button
                        className="button"
                        onClick={() => {
                            // adding every element to the list
                            const newSelected = new Set<string>()
                            elements.forEach((element: RegisterObjectProps) => {
                                newSelected.add(element.id)
                            })
                            setSelectedElements(newSelected)
                            console.log(newSelected)
                        }}
                    > Select All </button>
                    <button
                        className="button"
                        onClick={() => {
                            // adding every element to the list
                            const newSelected = new Set<string>()
                            setSelectedElements(newSelected)
                            console.log(newSelected)
                        }}> Deselect All </button>
                </div>
            </div>

            <div className="scroll-container">
                <ul className='list'>
                    {elements.map((element) => (
                        <li key={element.id} className='list-item'>
                            <OptionCard
                                id={element.id}
                                name={element.name}
                                tags={getTags(element)}
                                description={element.description}
                                parameters={element.parameters}
                                isSelected={selectedElement.has(element.id)}
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