"use client"
import './Navbar.css';
import { NavigationSection, sections } from './config';
import NavigationButton from './NavigationButton';
import { Burger } from '@mantine/core';
import Profile from './Profile';
import { useMemo, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface FlatNavItem {
    id: string;
    href?: string;
    parentId?: string;
}

export default function Navbar() {
    const [isOpen, setIsOpen] = useState<boolean>(true);
    const pathname = usePathname();

    const router = useRouter();

    // this function handle the click on the button
    const handleClick = (href?: string, id?: string) => {
        // Navigate if href exists
        if (href && id) {
            router.push(href);
        }
    };

    // This function is for flattening the Section component
    // In this way it is possible to save in a dictionary all the buttons
    function flattenSections(
        items: NavigationSection[],
        parentId?: string
    ): FlatNavItem[] {
        return items.flatMap((item) => {
            const flat: FlatNavItem = {
                id: item.id,
                href: item.href,
                parentId
            };
            return item.items && item.items.length > 0
                ? [flat, ...flattenSections(item.items, item.id)]
                : [flat];
        });
    }
    // Since the section is a static constant then it is possible to create this element
    // by just invoking the function once.
    const itemsById = useMemo(() => {
        const map: { [key: string]: FlatNavItem } = {};
        for (const item of flattenSections(Object.values(sections).flat())) {
            map[item.id] = item;
        }
        return map;
    }, []);

    // Check whether a certain element is active or not
    const isActive = (id: string): boolean => {
        const item = itemsById[id];
        if (!item) return false;
        if (item.href === pathname) return true;
        // check if any child of this node matches the current pathname
        for (const candidate of Object.values(itemsById)) {
            if (candidate.parentId === id && candidate.href === pathname) {
                return true;
            }
        }
        return false;
    };

    return (
        <div className='container-nav'>
            <div className='nav-header'>
                <Burger
                    size={20}
                    color='white'
                    opened={isOpen}
                    onClick={() => { setIsOpen(!isOpen) }}
                />
                {isOpen ? "Menu" : null}
            </div>
            <div className="nav-section">
                {Object.entries(sections).map(
                    ([sectionName, elements]: [string, NavigationSection[]]) => (
                        <div key={sectionName}>
                            <h3 className="section-title">{sectionName}</h3>
                            <div className="nav-items">
                                {elements.map((element) => (
                                    <NavigationButton
                                        key={`${element.id}_button`}
                                        id={element.id}
                                        title={element.title}
                                        href={element.href}
                                        Icon={element.Icon}
                                        items={element.items}
                                        requiresEmbeddings={false}
                                        handleClick={handleClick}
                                        isActive={isActive}
                                        isDisabled={false}
                                        isClosed={!isOpen}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
            </div>
            <Profile isOpen={isOpen} />
        </div>
    );
}
