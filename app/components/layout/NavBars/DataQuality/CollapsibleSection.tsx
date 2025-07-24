"use client";

import { Box, Button, Group, Stack, Text } from "@mantine/core";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { IconChevronDown, IconChevronRight } from '@tabler/icons-react';
import { ReactNode } from 'react';
import classes from './AppNavbarDataQuality.module.css';

interface CollapsibleSectionProps {
  title: string;
  icon: IconDefinition;
  isVisible: boolean;
  onToggle: () => void;
  children: ReactNode;
}

export default function CollapsibleSection({
  title,
  icon,
  isVisible,
  onToggle,
  children
}: CollapsibleSectionProps) {
  return (
    <Box>
      <Button
        fullWidth
        className={classes.navbar}
        onClick={onToggle}
        rightSection={
          isVisible ? (
            <IconChevronDown size={18} stroke={1.5} />
          ) : (
            <IconChevronRight size={18} stroke={1.5} />
          )
        }
        leftSection={
          <FontAwesomeIcon
            icon={icon}
            size="sm"
            style={{ opacity: 0.6 }}
          />
        }
        style={{
          width: 'calc(100% + 32px)',
          marginLeft: '-16px',
          marginRight: '-16px',
        }}
        mb="xs"
      >
        <Text size="sm" fw={600} c="dimmed">
          {title}
        </Text>
      </Button>

      {isVisible && (
        <Stack mt="sm">
          <Box>
            {children}
          </Box>
        </Stack>
      )}
    </Box>
  );
}