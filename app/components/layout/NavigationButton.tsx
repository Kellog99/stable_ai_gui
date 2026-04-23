"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { NavigationSection } from "./config";
import "./NavigationButton.css";
import { Tooltip } from "@mantine/core";

interface NavigationButtonProps extends NavigationSection {
    isClosed: boolean;   // Whether the NavBar is collapsed
    isDisabled?: boolean; // Whether the button is disabled
    isActive: (id: string) => boolean;   // Given the id, it tells whether this button is active or not
    handleClick: (href?: string, id?: string) => void; // Function to handle button click
}
/**
 * 
 * @param id: the id of the button, used to identify it and to tell whether it's active or not 
 * @param title: the title of the button
 * @param Icon: the icon of the button
 * @param href: the link to navigate to when the button is clicked, if it exists
 * @param items: the children of the button, if they exist
 * @param isActive: a function that given the id of the button, tells whether it's active or not
 * @param handleClick: a function that handle the click on the button, it receives the href and the id of the button
 * @param isClosed: a boolean that tells whether the lateral navbar is collapsed or not, used to decide whether to show the title of the button or not
 * @param isDisabled: a boolean that tells whether the button is disabled or not, used to disable the button when the user doesn't have the necessary permissions to access the page
 */
const NavigationButton: React.FC<NavigationButtonProps> = ({
    id,
    title,
    Icon,
    href,
    items,
    isActive,
    handleClick,
    isClosed,
    isDisabled = false,
}) => {

    const [expanded, setExpanded] = useState<boolean>(true); // all visible by default

    // This constant allow to tells whether a component has children
    const hasChildren = useMemo(
        () => !!items && items.length > 0
        , [items]);

    // Every time I explode the lateral navbar, the children are shown
    useEffect(() => {
        setExpanded(!isClosed)
    }, [isClosed])

    const wrapChild = (child: React.ReactNode, title: string) => {
        return (
            expanded ? child :
                <Tooltip label={title} withArrow>
                    {child}
                </Tooltip>
        )
    }
    return (
        <div className="nav-button-container">
            <button
                onClick={() => handleClick(href, id)}
                disabled={isDisabled}
                className={`nav-item ${isActive(id) ? "active" : ""}`}
            >
                <div className={`nav-item-content ${isClosed ? "collapsed" : ""}`}>

                    <Icon
                        size={18}
                        aria-hidden="true"
                    />
                    {!isClosed && <div className="button-name">{title}</div>}
                </div>


                {hasChildren && (
                    <button
                        onClick={() => setExpanded((prev) => !prev)}
                        className="expand-button"
                    >
                        {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                )}
            </button>

            {/* Sub-items */}
            {hasChildren && expanded && (
                <div className="sub-items" role="group">
                    {items!.map((item) => (
                        <NavigationButton
                            key={item.id}
                            id={item.id}
                            href={item.href}
                            Icon={item.Icon}
                            title={item.title}
                            isClosed={isClosed}
                            isDisabled={item.requiresEmbeddings === false}
                            handleClick={handleClick}
                            isActive={isActive}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default NavigationButton;
