import { NavigationSection } from "./config";
import { useState } from "react";
import React from "react";
import './Navbar.css'
import { ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";


// Move NavigationButton outside to prevent recreation on every render
interface NavigationButtonProps extends NavigationSection {
    isActive: boolean
    activeLink: string;
    setActiveLink: (id: string) => void;
    isClosed: boolean;
}

const NavigationButton: React.FC<NavigationButtonProps> = ({
    id,
    title,
    Icon,
    href,
    items,
    isActive,
    activeLink,
    setActiveLink,
    isClosed
}) => {
    const [seeActions, setSeeActions] = useState<boolean>(false);
    return (
        <li>
            <Link
                onClick={(e) => {
                    if (!isActive) {
                        e.preventDefault();
                        return;
                    }
                    if (items && items.length > 0) {
                        e.preventDefault();
                        setSeeActions(!seeActions);
                    }
                    setActiveLink(id);
                }}
                href={href && isActive ? href : "#"}
                className={`${isActive ? activeLink === id ? 'nav-link active' : 'nav-link' : 'disabled'}`}
                aria-current={activeLink === id ? 'page' : undefined}
                aria-expanded={items && items.length > 0 ? seeActions : undefined}
            >
                <div className="nav-text"
                    style={{ gap: `${!isClosed ? '1vw' : '0px'}` }}>
                    <Icon size={25} aria-hidden="true" />
                    {!isClosed && (<span>{title}</span>)}
                </div>
                {items && items.length > 0 && (
                    seeActions ?
                        <ChevronUp aria-hidden="true" />
                        : <ChevronDown aria-hidden="true" />
                )}
            </Link>
            {items && items.length > 0 && seeActions && (
                <ul role="menu"
                    className="nav-links">
                    {items.map((item) => (
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
                            isActive={item.requiresEmbeddings ? item.requiresEmbeddings : false}
                        />
                    ))}
                </ul>
            )}
        </li>
    );
};

export default NavigationButton;