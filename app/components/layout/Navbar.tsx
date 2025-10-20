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
import useNNTrustStore from "@/store/nnTrustStore";

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

// Generic fetch function for fetching the metrics or the attacks
async function fetchItem(url: string) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error for the attack List! Status: ${response.status}`);
        }
        const json = await response.json();
        return json;
    } catch (err) {
        console.log(err instanceof Error ? err.message : "An error occurred");
        return undefined; // Explicitly return undefined on error
    }
}

export default function Navbar() {
    const pathName = usePathname();
    const isNNTrust = pathName.includes('/redteam');
    const [sections, setSections] = useState<NavigationSection[]>([]);
    const [isClosed, setIsClosed] = useState<boolean>(true);
    const [activeLink, setActiveLink] = useState<string>('');
    const datasetUsed = useStore((state) => state.datasetUsed);
    const { setAttacks, setMetrics, setSelectedAttacks, setSelectedMetrics } = useNNTrustStore();

    // selecting the relative Navbar
    useEffect(() => {
        if (isNNTrust) {
            // Make the useEffect async by creating an async function inside
            const fetchData = async () => {
                const fetchattack = await fetchItem('http://127.0.0.1:8000/attacks/getInfo');
                const fetchmetrics = await fetchItem('http://127.0.0.1:8000/metrics/getInfo');

                if (fetchattack) {
                    setAttacks(fetchattack);
                    setSelectedAttacks(fetchattack);
                }
                if (fetchmetrics) {
                    setMetrics(fetchmetrics);
                    setSelectedMetrics(fetchmetrics);
                }
            };

            fetchData();
            setSections(TitannSections);
        } else {
            setSections(DQsections);
        }
    }, [isNNTrust, setAttacks, setSelectedAttacks, setMetrics, setSelectedMetrics]);


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