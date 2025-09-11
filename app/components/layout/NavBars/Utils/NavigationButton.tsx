"use client";
import { Button, Text, Tooltip } from "@mantine/core";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { ReactNode, useEffect, useState } from 'react';
import RouterButton from "@/components/client/buttons/RouterButton";
import { useSearchParams } from "next/navigation";

interface NavigationButtonProps {
  href: string;
  icon?: IconDefinition;
  label: string;
  isActive: boolean;
  disabled?: boolean;
  tooltipLabel?: string;
  leftSection?: ReactNode;
  rightSection?: ReactNode;
  variant?: 'filled' | 'subtle';
}

const buttonStyles = {
  width: 'calc(100% + 32px)',
  marginLeft: '-16px',
  marginRight: '-16px',
  display: 'flex',
  justifyContent: 'flex-start', // left-align content
  alignItems: 'center',
  gap: '8px', // spacing between icon and text
};

const activeStyles = {
  backgroundColor: '#dddbdb',
  color: 'white',
};

const disabledStyles = {
  backgroundColor: '#f8f9fa',
  color: '#adb5bd',
  cursor: 'not-allowed',
  opacity: 0.6,
  pointerEvents: 'none' as const,
};

export default function NavigationButton({
  href,
  icon,
  label,
  isActive,
  disabled = false,
  tooltipLabel,
  leftSection,
  rightSection,
  variant = 'subtle'
}: NavigationButtonProps) {
  const searchParams = useSearchParams();
  const [datasetName, setDatasetName] = useState<string | null>("")

  useEffect(() => {
    if (searchParams.get("datasetName")) {
      setDatasetName(searchParams.get("datasetName"))
    }
  }, [searchParams])

  const getButtonStyles = () => {
    let styles = { ...buttonStyles };
    
    if (isActive && !disabled) {
      styles = { ...styles, ...activeStyles };
    } else if (disabled) {
      styles = { ...styles, ...disabledStyles };
    }
    
    return styles;
  };

  const buttonContent = (
    <Button
      fullWidth
      leftSection={leftSection ?? (icon ? <FontAwesomeIcon icon={icon} color="#475569" /> : undefined)}
      rightSection={rightSection}
      variant={isActive && !disabled ? "filled" : variant}
      disabled={disabled}
      style={getButtonStyles()}
    >
      <Text 
        size="sm" 
        fw={600} 
        c={disabled ? "dimmed" : isActive ? "#475569" : "dimmed"}
      >
        {label}
      </Text>
    </Button>
  );

  const content = disabled ? (
    <div style={{ position: 'relative' }}>
      {buttonContent}
      {tooltipLabel && (
        <Tooltip
          label={tooltipLabel}
          radius="md"
          withArrow
          position="top"
          multiline
          styles={{
            tooltip: {
              width: "200px",
              textAlign: 'center',
              lineHeight: 1.3,
            }
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              cursor: "not-allowed"
            }}
            aria-hidden="true"
          />
        </Tooltip>
      )}
    </div>
  ) : (
    <RouterButton name={datasetName} route={href}>
      {buttonContent}
    </RouterButton>
  );

  return content;
}