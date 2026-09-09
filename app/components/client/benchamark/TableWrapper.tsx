import React, {useMemo, useState} from 'react';
import './TableWrapper.css';
import {Search, SlidersHorizontal} from 'lucide-react';
import {RegisterObjectProps} from '@/interfaces/NNInterfaces';
import AttackCard from '../utils/AtkCard';


interface TableWrapperProps {
    title: string,
    elements: { [key: string]: RegisterObjectProps };
    selectedElement: { [key: string]: RegisterObjectProps };
    handleSelection: (id: string, visibleElements?: { [key: string]: RegisterObjectProps }) => void;
    handleParametersChange: (id: string, parameters: number[]) => void;
    showAttackCategories?: boolean;
}

const formatCategory = (category: string) =>
    category
        .replace(/[_-]+/g, ' ')
        .replace(/\b\w/g, (letter) => letter.toUpperCase());

/** Resolve the attack family from an explicit backend field or its metadata. */
const getAttackCategory = (attack: RegisterObjectProps) => {
    const explicitCategory = attack.category || attack.nature || attack.attack_type || attack.type;
    if (explicitCategory) return formatCategory(explicitCategory);
    if (attack.privacy_type) return 'Privacy';

    const searchableText = [attack.id, attack.name, attack.description, attack.objective]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

    if (searchableText.includes('privacy')) return 'Privacy';
    if (searchableText.includes('evasion')) return 'Evasion';
    if (searchableText.includes('jailbreak')) return 'Jailbreaking';
    if (searchableText.includes('prompt injection')) return 'Prompt Injection';
    return 'Other';
};

const TableWrapper: React.FC<TableWrapperProps> = ({
                                                       title,
                                                       elements,
                                                       selectedElement,
                                                       handleSelection,
                                                       handleParametersChange,
                                                       showAttackCategories = false,
                                                   }) => {

    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("all");
    const categories = useMemo(() => Array.from(new Set(
        showAttackCategories ? Object.values(elements).map(getAttackCategory) : []
    )).sort(), [elements, showAttackCategories]);

    const filteredItems = useMemo(() => {
        return Object.fromEntries(Object.entries(elements).filter(
            ([_, value]) =>
                query === "" ||
                value.name.toLowerCase().includes(query.toLowerCase()) ||
                value.description.toLowerCase().includes(query.toLowerCase()) ||
                (showAttackCategories && getAttackCategory(value).toLowerCase().includes(query.toLowerCase()))
        ).filter(([_id, value]) =>
            !showAttackCategories || category === "all" || getAttackCategory(value) === category
        ));
    }, [query, category, elements, showAttackCategories]);

    return (
        <div className="wrapper">
            <div className="header">
                <h2 className="table-title">{title}</h2>
                <p className="subtitle">
                    Selected: {selectedElement ? Object.keys(selectedElement).length : 0} / {Object.keys(elements).length}
                </p>
            </div>
            <div className={`scroll-header ${showAttackCategories ? 'has-category-filter' : ''}`}>
                {/* Search bar */}
                <div className="search-container">
                    <Search
                        size={"calc(var(--icon-size) * 0.8)"}
                        className="search-icon"/>
                    <input
                        type="text"
                        placeholder="Search"
                        onChange={(e) => setQuery(e.target.value)}
                        className="search-input"
                    />
                </div>
                {showAttackCategories && <label className="category-filter">
                    <SlidersHorizontal size={"calc(var(--icon-size) * 0.8)"}/>
                    <span>Nature</span>
                    <select value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="all">All</option>
                        {categories.map((item) => <option key={item} value={item}>{item}</option>)}
                    </select>
                </label>}
                <div className='buttons-container'>
                    <button
                        className="button"
                        onClick={() => {
                            handleSelection("all", filteredItems)
                        }}
                    > Select All
                    </button>
                    <button
                        className="button"
                        onClick={() => {
                            handleSelection("none", filteredItems)
                        }}> Deselect All
                    </button>
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
                                category={showAttackCategories ? getAttackCategory(atk) : undefined}
                                isActive={Object.keys(selectedElement).includes(id)}
                                parameters={atk.parameters ? atk.parameters : []}
                                handleClick={() => handleSelection(atk.id)}
                                handleParametersChange={(parameters: (number | string)[]) => {
                                    handleParametersChange(id, parameters as number[])
                                }}
                            />
                        ))
                    }
                </div>
                : <div className='scroll-text'>
                    {Object.keys(elements).length > 0
                        ? <p>No elements match the current filters.</p>
                        : <p>No elements have been passed.</p>}
                </div>
            }
        </div>
    );
}

export default TableWrapper;
