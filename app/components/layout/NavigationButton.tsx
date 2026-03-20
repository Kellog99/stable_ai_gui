"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { NavigationSection } from "./config";
import { usePathname, useRouter } from "next/navigation";
import "./NavigationButton.css";

interface NavigationButtonProps extends NavigationSection {
    isClosed: boolean;   // Whether the NavBar is collapsed
    isDisabled?: boolean; // Whether the button is disabled
}

const NavigationButton: React.FC<NavigationButtonProps> = ({
    title,
    Icon,
    href,
    items,
    isClosed,
    isDisabled = false,
}) => {
    const pathname = usePathname();
    const router = useRouter();

    const [expanded, setExpanded] = useState<boolean>(true); // all visible by default

    // This constant allow to tells whethe a component has children
    const hasChildren = useMemo(
        () => !!items && items.length > 0,
        [items]
    );

    // Check if this route or any child route is active
    const isActive = useMemo(() => {
        if (pathname === href) return true;
        if (hasChildren && items) {
            return items.some(item => pathname === item.href);
        }
        return false;
    }, [pathname, href, hasChildren, items]);

    // Every time I explode the lateral navbar, the children are shown
    useEffect(() => {
        setExpanded(!isClosed)
    }, [isClosed])

    const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (isDisabled) return;

        // Toggle expansion if has children
        if (hasChildren) {
            setExpanded((prev) => !prev);
        }

        // Navigate if href exists
        if (href) {
            router.push(href);
        }
    }, [isDisabled, hasChildren, href, router]);

    const ChevronIcon = expanded ? ChevronUp : ChevronDown;
    return (
        <div className="nav-button-container">
            <button
                onClick={handleClick}
                disabled={isDisabled}
                className={`nav-item ${isActive ? "active" : ""}`}
            >
                <div className={`nav-item-content ${isClosed ? "collapsed" : ""}`}>

                    <Icon
                        size={22}
                        aria-hidden="true"
                    />
                    {!isClosed && <div className="button-name">{title}</div>}
                </div>

                {!isClosed && hasChildren && (
                    <ChevronIcon size={18} aria-label={expanded ? "Collapse" : "Expand"} />
                )}
            </button>

            {/* Sub-items */}
            {!isClosed && hasChildren && expanded && (
                <div className="sub-items" role="group">
                    {items!.map((item) => (
                        <NavigationButton
                            key={item.id}
                            {...item}
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
