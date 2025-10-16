"use client";

import { usePathname } from "next/navigation";
import { DQsections, NavigationSection, TitannSections } from "./config";
import Dataset from "@/interfaces/genericInterface";
import { useEffect, useState } from "react";
import React from "react";
import './Navbar.css'
import { Menu, X } from "lucide-react";
import NavigationButton from "./NavigationButton";
import useStore from "@/store/dsStore";
import { IsFeaturePresent } from "@/functionalities/Utils";
import { embedding_type } from "@/properties/types";

function setEmbeddings(items: NavigationSection[], areEmbeddings: boolean, isNNTrust: boolean) {
    items.map((item) => {
        if (isNNTrust) {
            // is nntrust
            item.requiresEmbeddings = true
        }
        else if (item.requiresEmbeddings) {
            item.requiresEmbeddings = areEmbeddings ? true : false
        } else {
            // is not NNtrust and it does not require an embedding
            item.requiresEmbeddings = true
        }
        if (item.items && item.items.length > 0) {
            setEmbeddings(item.items, areEmbeddings, isNNTrust)
        }
    })

}

export default function Navbar() {
    const pathName = usePathname();
    const isNNTrust = pathName.includes('/redteam');
    const [sections, setSections] = useState<NavigationSection[]>([])
    const [isClosed, setIsClosed] = useState<boolean>(true)
    const [activeLink, setActiveLink] = useState<string>('');
    const datasetUsed = useStore((state) => state.datasetUsed);

    // selecting the relative Navbar
    useEffect(() => {
        setSections(isNNTrust ? TitannSections : DQsections)
    }, [isNNTrust])

    // updating the starting section every time the "sections" variable is changed
    useEffect(() => {
        const areEmbeddings: boolean = datasetUsed ? IsFeaturePresent(datasetUsed as Dataset, embedding_type) : false;
        setEmbeddings(sections, areEmbeddings, isNNTrust)
        if (sections.length > 0) {
            sections.map((section) => {
                if (section.href && section.href === pathName) {
                    setActiveLink(section.id)
                }
            })
        }

    }, [sections, datasetUsed])

    return (
        <div className="navbar-container">

            <button
                className="burger-button"
                onClick={() => setIsClosed(!isClosed)}
                aria-label="Toggle navigation"
            >
                {
                    isClosed ?
                        <Menu size={24} />
                        : <X size={24} />
                }
            </button>
            <ul className="nav-links"
                style={{ padding: '0', marginTop: '0' }}>
                {sections.length > 0 &&
                    (sections.map((item) => (
                        <NavigationButton
                            id={item.id}
                            title={item.title}
                            Icon={item.Icon}
                            href={item.href}
                            items={item.items}
                            activeLink={activeLink}
                            setActiveLink={setActiveLink}
                            isClosed={isClosed}
                            isActive={item.requiresEmbeddings ? item.requiresEmbeddings : false}
                        />
                    )))}
            </ul>

        </div>
    )
}