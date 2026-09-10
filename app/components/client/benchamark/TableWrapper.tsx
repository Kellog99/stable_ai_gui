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
    handleParametersChange: (id: string, parameters: (number | string)[]) => void;
    showAttackCategories?: boolean;
}

const formatCategory = (category: string) =>
    category
        .replace(/[_-]+/g, ' ')
        .replace(/\b\w/g, (letter) => letter.toUpperCase());

/** Resolve the attack objective from its explicit backend field or metadata. */
const getAttackObjective = (attack: RegisterObjectProps) => {
    if (attack.objective) return formatCategory(attack.objective);

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

const matchesKnowledge = (attack: RegisterObjectProps, knowledge: string) =>
    knowledge === 'all' || attack.knowledge?.toLowerCase().includes(knowledge);

const TableWrapper: React.FC<TableWrapperProps> = (
    {
        title,
        elements,
        selectedElement,
        handleSelection,
        handleParametersChange,
        showAttackCategories = false,
    }
) => {

    const [query, setQuery] = useState("");
    const [objective, setObjective] = useState("all");
    const [knowledge, setKnowledge] = useState("all");
    const objectives = useMemo(() => Array.from(new Set(
        showAttackCategories ? Object.values(elements).map(getAttackObjective) : []
    )).sort(), [elements, showAttackCategories]);

    const filteredItems = useMemo(() => {
        return Object.fromEntries(Object.entries(elements).filter(
            ([_, value]) =>
                query === "" ||
                value.name.toLowerCase().includes(query.toLowerCase()) ||
                value.description.toLowerCase().includes(query.toLowerCase()) ||
                (showAttackCategories && getAttackObjective(value).toLowerCase().includes(query.toLowerCase())) ||
                value.knowledge?.toLowerCase().includes(query.toLowerCase())
        ).filter(([_id, value]) =>
            !showAttackCategories || objective === "all" || getAttackObjective(value) === objective
        ).filter(([_id, value]) =>
            !showAttackCategories || matchesKnowledge(value, knowledge)
        ));
    }, [query, objective, knowledge, elements, showAttackCategories]);

    return (
        <div className="wrapper">
            <div className="benchmark-section-header">
                <h2 className="table-title">{title}</h2>
                <p className="subtitle">
                    {selectedElement ? Object.keys(selectedElement).length : 0} / {Object.keys(elements).length} selected
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
                    <span>Objective</span>
                    <select value={objective} onChange={(e) => setObjective(e.target.value)}>
                        <option value="all">All</option>
                        {objectives.map((item) => <option key={item} value={item}>{item}</option>)}
                    </select>
                </label>}
                {showAttackCategories && <label className="category-filter">
                    <SlidersHorizontal size={"calc(var(--icon-size) * 0.8)"}/>
                    <span>Knowledge</span>
                    <select value={knowledge} onChange={(e) => setKnowledge(e.target.value)}>
                        <option value="all">All</option>
                        <option value="white">White</option>
                        <option value="black">Black</option>
                    </select>
                </label>}
                <div className='buttons-container'>
                    <button
                        className="button"
                        onClick={() => {
                            handleSelection("all", filteredItems)
                        }}
                    > Select all
                    </button>
                    <button
                        className="button"
                        onClick={() => {
                            handleSelection("none", filteredItems)
                        }}> Clear
                    </button>
                </div>
            </div>
            {Object.entries(filteredItems).length > 0 ?
                <div className="card-grid">
                    {
                        Object.entries(filteredItems).map(([id, atk]: [string, RegisterObjectProps]) => {
                            const selectedAttack = selectedElement[id];

                            return <AttackCard
                                key={id}
                                id={id}
                                title={atk.name}
                                description={atk.description}
                                knowledge={atk.knowledge}
                                category={showAttackCategories ? getAttackObjective(atk) : undefined}
                                isActive={selectedAttack?.id === atk.id}
                                parameters={selectedAttack?.parameters ?? atk.parameters ?? []}
                                handleClick={() => handleSelection(atk.id)}
                                handleParametersChange={(parameters) => handleParametersChange(id, parameters)}
                            />
                        })
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
