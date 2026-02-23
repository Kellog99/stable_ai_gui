import React, { useMemo, useState } from 'react';
import OptionCard from '@/components/redtool/OptionCard';
import './TableWrapper.css';
import { LucideIcon, Search } from 'lucide-react';
import { RegisterObjectProps } from '@/interfaces/NNInterfaces';


interface TableWrapperProps {
    title: string,
    elements: { [key: string]: RegisterObjectProps };
    selectedElement: { [key: string]: RegisterObjectProps };
    Icon: LucideIcon
    handleSelection: (id: string) => void;
    handleParametersChange: (id: string, parameters: number[]) => void;
}

const TableWrapper: React.FC<TableWrapperProps> = ({
    title,
    elements,
    selectedElement,
    handleSelection,
    handleParametersChange,
    Icon
}) => {
    console.log("elements = ", elements)
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
    const [query, setQuery] = useState("");
    const filteredItems = useMemo(() => {
        return Object.fromEntries(Object.entries(elements).filter(
            ([key, value]) =>
                query === "" ||
                value.name.toLowerCase().includes(query.toLowerCase()) ||
                value.description.toLowerCase().includes(query.toLowerCase())
        ));
    }, [query, elements]);

    return (
        <div className="wrapper">
            <div className="header">
                <h2 className="table-title">{title}</h2>
                <p className="subtitle">
                    Selected: {selectedElement ? Object.keys(selectedElement).length : 0} / {Object.keys(elements).length}
                </p>
            </div>
            <div className='scroll-header'>
                {/* Search bar */}
                <div className="search-container">
                    <Search size={"calc(var(--icon-size) * 0.8)"} color='gray' className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search"
                        onChange={(e) => setQuery(e.target.value)}
                        className="search-input"
                    />
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
            {Object.entries(filteredItems).length > 0 ?
                <div className="scroll-container">
                    <div className="card-grid">
                        {Object.entries(filteredItems).map(([id, element]) => (
                            <OptionCard
                                key={id}
                                name={element.name}
                                tags={getTags(element) || []}
                                description={element.description}
                                parameters={element.parameters}
                                isSelected={id in selectedElement}
                                onSelect={() => handleSelection(element.id)}
                                Icon={Icon}
                                handleParametersChange={(parameters: number[]) => { handleParametersChange(id, parameters) }} />
                        ))}
                    </div>
                </div>
                : <div className='scroll-text'>
                    {
                        Object.entries(filteredItems).length > 0 ?
                            <p>
                                No element with <b>{query}</b> inside.
                            </p> :
                            <p>
                                No elements have been passed.
                            </p>
                    }
                </div>
            }
        </div>
    );
}

export default TableWrapper;