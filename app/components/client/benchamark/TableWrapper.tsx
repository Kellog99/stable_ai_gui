import React, { useMemo, useState } from 'react';
import './TableWrapper.css';
import { LucideIcon, Search } from 'lucide-react';
import { RegisterObjectProps } from '@/interfaces/NNInterfaces';
import AttackCard from '../utils/AtkCard';


interface TableWrapperProps {
    title: string,
    elements: { [key: string]: RegisterObjectProps };
    selectedElement: { [key: string]: RegisterObjectProps };
    handleSelection: (id: string) => void;
    handleParametersChange: (id: string, parameters: number[]) => void;
}

const TableWrapper: React.FC<TableWrapperProps> = ({
    title,
    elements,
    selectedElement,
    handleSelection,
    handleParametersChange,
}) => {
  
    const [query, setQuery] = useState("");
    const filteredItems = useMemo(() => {
        return Object.fromEntries(Object.entries(elements).filter(
            ([_, value]) =>
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
                    <Search
                        size={"calc(var(--icon-size) * 0.8)"}
                        className="search-icon" />
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
                <div className="card-grid">
                    {
                        Object.entries(filteredItems).map(([id, atk]: [string, RegisterObjectProps]) => (

                            <AttackCard
                                key={id}
                                id={id}
                                title={atk.name}
                                description={atk.description}
                                knowledge={atk.knowledge}
                                isActive={Object.keys(selectedElement).includes(id)}
                                parameters={atk.parameters ? atk.parameters : []}
                                handleClick={() => handleSelection(atk.id)}
                                handleParametersChange={(parameters: (number | string)[]) => { handleParametersChange(id, parameters as number[]) }}
                            />
                        ))
                    }
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