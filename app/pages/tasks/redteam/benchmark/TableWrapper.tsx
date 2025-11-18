import React, { useMemo, useState } from 'react';
import OptionCard from '@/components/client/redtool/OptionCard';
import './TableWrapper.css';
import { LucideIcon, Search } from 'lucide-react';
import { RegisterObjectProps } from '@/interfaces/NNInterfaces';
import useNNStore from '@/store/nnTrustStore';

interface TableWrapperProps {
    elements: { [key: string]: RegisterObjectProps };
    selectedElement: { [key: string]: RegisterObjectProps };
    Icon: LucideIcon
    handleSelection: (id: string) => void;
    handleParametersChange: (id: string, parameters: number[]) => void;
}

const TableWrapper: React.FC<TableWrapperProps> = ({
    elements,
    selectedElement,
    handleSelection,
    handleParametersChange,
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
    const [query, setQuery] = useState("");
    const filteredItems = useMemo(() => {
        return Object.fromEntries(Object.entries(elements).filter(
            ([key, value]) =>
                query === "" ||
                value.name.toLowerCase().includes(query.toLowerCase()) ||
                value.description.toLowerCase().includes(query.toLowerCase())
        ));
    }, [query, elements]);



    const model = useNNStore((state) => state.models);
    const numClasses = model?.filter((m) => m.name === useNNStore((state) => state.modelName))[0].num_classes as number

    let isCM = false;
    let modifiedSelectedElement = { ...selectedElement };

    if (numClasses > 100 && "confusionmatrix" in modifiedSelectedElement) {
        isCM = true;
        delete modifiedSelectedElement.confusionmatrix;
    }

    console.log("modifiedSelectedElement", modifiedSelectedElement);
    console.log("original elements", elements);
    console.log("isCM in table wrapper?", isCM)

    return (
        <div className="wrapper">

            <div className="header">
                <div>
                    <h2 className="table-title">Elements</h2>
                    <p className="subtitle">
                        Selected: {Object.keys(modifiedSelectedElement).length} / {Object.keys(elements).length}
                    </p>
                </div>
                <div className='scroll-header'>
                    {/* Search bar */}
                    <div className="search-container">
                        <Search size={34} className="search-icon" />
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
            </div>

            <div className="scroll-container">
                <div className="card-grid">
                    {Object.entries(filteredItems).map(([id, element]) => (
                        <OptionCard
                            key={id}
                            name={element.name}
                            tags={getTags(element)}
                            description={element.description}
                            parameters={element.parameters}
                            isSelected={id in selectedElement}
                            onSelect={() => handleSelection(element.id)}
                            Icon={Icon}
                            handleParametersChange={(parameters: number[]) => { handleParametersChange(id, parameters) }} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default TableWrapper;