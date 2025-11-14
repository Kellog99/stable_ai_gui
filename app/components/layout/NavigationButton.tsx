"use client";

import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { NavigationSection } from "./config";
import { usePathname, useRouter } from "next/navigation";
import "./Navbar.css";

interface NavigationButtonProps extends NavigationSection {
    setActiveLink: (id: string) => void;
    isClosed: boolean;   // Whether the NavBar is collapsed
    isDisabled?: boolean; // Whether the button is disabled
}

const NavigationButton: React.FC<NavigationButtonProps> = ({
    id,
    title,
    Icon,
    href,
    items,
    setActiveLink,
    isClosed,
    isDisabled = false,
}) => {
    const pathname = usePathname();
    const router = useRouter();

    const [expanded, setExpanded] = useState<boolean>(true); // all visible by default
    const [isActive, setIsActive] = useState<boolean>(pathname === href);

    useEffect(() => {
        setIsActive(pathname === href);
    }, [pathname, href]);

    const hasChildren = !!items && items.length > 0;
    // Every time I explode the lateral navbar, the children are shown
    useEffect(() => {
        setExpanded(!isClosed)
    }, [isClosed])
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (isDisabled) return; // safeguard
        if (hasChildren) setExpanded((prev) => !prev)
        if (href) {
            router.push(href);
            setActiveLink(id);
        }
    };

    return (
        <div className="flex flex-col w-full">
            <button
                onClick={handleClick}
                disabled={isDisabled}
                className={`nav-item flex items-center justify-between w-full py-2 px-3 rounded-md transition-all
          ${isActive ? "active" : ""}
          ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
                <div
                    className="nav-item-content flex items-center"
                    style={{ gap: isClosed ? "0px" : "1vw" }}
                >
                    <Icon size={22} aria-hidden="true" />
                    {!isClosed && <span>{title}</span>}
                </div>

                {!isClosed && hasChildren && (
                    isClosed ? (
                        <ChevronUp size={18} />
                    ) : (
                        <ChevronDown size={18} />
                    )
                )}
            </button>

            {/* Sub-items */}
            {!isClosed && hasChildren && expanded && (
                <div className="sub-items">
                    {items!.map((item) => (
                        <NavigationButton
                            key={item.id}
                            {...item}
                            setActiveLink={setActiveLink}
                            isClosed={isClosed}
                            isDisabled={item.requiresEmbeddings === false}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default NavigationButton;
