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
};

const activeStyles = {
  backgroundColor: '#dddbdb',
  color: 'white',
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


  const buttonContent = (
    
      <Button
        fullWidth
        leftSection={leftSection ?? (icon ? <FontAwesomeIcon icon={icon} /> : undefined)}
        rightSection={rightSection}
        variant={isActive ? "filled" : variant}
        disabled={disabled}
        style={{
          ...buttonStyles,
          ...(isActive && activeStyles)
        }}
      >
        <Text size="sm" fw={600} c="dimmed">
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

