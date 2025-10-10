"use client";

import { usePathname } from "next/navigation";
import { DQsections, NavigationSection, TitannSections } from "./config";
import { useEffect, useState } from "react";
import { Burger } from "@mantine/core";
import React from "react";
import NavigationButton from "./NavigationButton";
import './Navbar.css'

export default function Navbar() {
    const pathName = usePathname();
    const isNNTrust = pathName.includes('/redteam');
    const [sections, setSections] = useState<NavigationSection[]>([])
    const [isClosed, setIsClosed] = useState<boolean>(true)
    const [key, setKey] = useState<string>("")
    // selecting the relative Navbar
    useEffect(() => {
        setSections(isNNTrust ? TitannSections : DQsections)
    }, [isNNTrust])

    // updating the starting section every time the "sections" variable is changed
    useEffect(() => {
        if (sections.length > 0) {
            setKey(sections[0].key)
        }
    }, [sections])


    const getTooltipLabel = (requiresDataset?: boolean, requiresEmbeddings?: boolean) => {
        if (requiresDataset) return "Requires dataset";
        if (requiresEmbeddings) return "Requires embeddings";
        return "";
    }
    const isActive = (id: string) => {
        return id === key
    }
    return (
        <div className="navbar-container">

            <Burger
                opened={!isClosed}
                onClick={() => setIsClosed(!isClosed)}
                aria-label="Toggle navigation"
                lineSize={4}
            />

            {sections.map((item, index) => (
                <NavigationButton
                    key={index}
                    section={item}
                    isActive={isActive}
                    collapsed={isClosed}
                    handlekey={setKey}
                    level={0}
                />
            ))}

        </div>
    )
}