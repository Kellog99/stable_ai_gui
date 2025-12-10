"use client";

import { usePathname } from "next/navigation";
import { NavigationSection, TitannSections } from "./config";
import Dataset from "@/interfaces/genericInterface";
import { useEffect, useState } from "react";
import React from "react";
import './Navbar.css'
import { Menu, X } from "lucide-react";
import NavigationButton from "./NavigationButton";
import useStore from "@/store/nnTrustStore";

import useNNTrustStore from "@/store/nnTrustStore";
import { getInfoAttacks, getInfoMetrics } from "@/properties/urlsNNTrust";
import { RegisterObjectProps } from "@/interfaces/NNInterfaces";

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
                const fetchattack = await fetchItem(getInfoAttacks);
                const fetchmetrics = await fetchItem(getInfoMetrics);
                if (fetchattack) {
                    const allowedIds = ["fgsm", "pgd", "deepfool", "banditprior", "signopt", "fuap"];

                    const filteredAttacks = Object.fromEntries(
                        (Object.entries(fetchattack) as [string, RegisterObjectProps][]).filter(
                            ([key, attack]) => allowedIds.includes(attack.id)
                        )
                    );

                    console.log("filtered", filteredAttacks)
                    console.log("attacks", fetchattack) 
                    setAttacks(filteredAttacks);
                    setSelectedAttacks(filteredAttacks);
                }
                if (fetchmetrics) {
                    setMetrics(fetchmetrics);
                    setSelectedMetrics(fetchmetrics);
                }
            };

            fetchData();
            setSections(TitannSections);
        }
    }, [isNNTrust, setAttacks, setSelectedAttacks, setMetrics, setSelectedMetrics]);




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
                    (sections.map((item, key) => (
                        <NavigationButton
                            key={item.id}
                            id={item.id}
                            title={item.title}
                            Icon={item.Icon}
                            href={item.href}
                            items={item.items}
                            activeLink={activeLink}
                            setActiveLink={setActiveLink}
                            isClosed={isClosed}
                            isActive={true}
                        />
                    )))}
            </ul>

        </div>
    )
}