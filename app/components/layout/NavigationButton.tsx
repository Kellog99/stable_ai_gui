"use client";
import { useRouter } from "next/navigation";
import { useState } from 'react';
import './NavigationButton.css';
import { ChevronDown, ChevronUp } from "lucide-react";
import { NavigationSection } from "./config";
import { Tooltip } from "@mantine/core";

interface NavigationButtonProps {
  section: NavigationSection
  isActive: (id: string) => boolean;
  collapsed?: boolean;
  level: number,
  handlekey: (id: string) => void;
}

const NavigationButton: React.FC<NavigationButtonProps> = ({
  section,
  isActive,
  level,
  collapsed = false,
  handlekey
}) => {
  const router = useRouter();
  const [datasetName, setDatasetName] = useState<string | null>("");

  const [seeAction, setSeeAction] = useState<boolean>(false);

  const handleChevronClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent parent button click
    setSeeAction(!seeAction);
  };


  const handleClick = () => {
    // if the button is clicked it set the global key to its
    handlekey(section.key)
    if (section.href) {
      router.push(section.href)
    }
  }
  return (
    <>
      <Tooltip
        label={section.title}
        disabled={!collapsed}>
        <button
          onClick={handleClick}
          className={`${isActive(section.key) ? "button active" : "button"}`}
        >
          <section.icon size={25 * (10 - level) / 10} />
          {!collapsed ? <p style={{ fontSize: `${(10 - level) / 10}rem` }}>{section.title}</p> : null}
          {section.items ? (
            <button
              className='action-button'
              onClick={handleChevronClick}
            >
              {!seeAction ? <ChevronDown /> : <ChevronUp />}
            </button>
          ) : null}
        </button>
      </Tooltip >
      {
        section.items && seeAction ? (
          <div className="subbuttons">
            {section.items.map((item, index) => (
              <NavigationButton
                section={item}
                isActive={isActive}
                collapsed={collapsed}
                handlekey={handlekey}
                level={level + 2}
              />
            ))}
          </div>
        ) : null
      }
    </>
  );
}

export default NavigationButton;