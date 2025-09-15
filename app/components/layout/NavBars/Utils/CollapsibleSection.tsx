"use client";

import useStore from '@/store/dsStore';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Button, Stack, Text, Tooltip } from "@mantine/core";
import { IconChevronDown, IconChevronRight } from '@tabler/icons-react';
import { ReactNode } from 'react';
import classes from './AppNavbar.module.css';

interface CollapsibleSectionProps
{
  title: string;
  icon: IconDefinition;
  isVisible: boolean;
  onToggle: () => void;
  children: ReactNode;
  collapsed?: boolean;
}

export default function CollapsibleSection ( {
  title,
  icon,
  isVisible,
  onToggle,
  children,
  collapsed = false,
}: CollapsibleSectionProps )
{
  const setCollapsed = useStore( ( state ) => state.setCollapsed );
  if ( collapsed ) {
    return (
      <Tooltip label={ title } position="right" withArrow>
        <Button
          fullWidth
          className={ classes.navbar }
          styles={ {
            root: {
              display: 'flex',
              justifyContent: collapsed ? 'center' : 'flex-start',
              alignItems: 'center',
              height: '48px',
              minHeight: '48px',
              padding: '0',
              width: collapsed ? 'calc(100% + 20px)' : 'calc(100% + 32px)',
              marginLeft: collapsed ? '-10px' : '-16px',
              marginRight: collapsed ? '-10px' : '-16px',
              transition: 'all 0.3s ease',
            },
            inner: {
              justifyContent: collapsed ? 'center' : 'flex-start',
            },
          } }
          onClick={ () => { setCollapsed( false ) } }
          mb="xs"
        >
          <FontAwesomeIcon
            icon={ icon }
            size="sm"
            style={ { opacity: 0.6 } }
          />
        </Button>
      </Tooltip>
    )
  }


  return (
    <Box>
      <Button
        fullWidth
        className={ classes.navbar }
        onClick={ onToggle }
        styles={ {
          root: {
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: '8px', 
            textAlign: 'left',
          },
          inner: {
            justifyContent: 'flex-start',
          },
        } }
        rightSection={
          isVisible ? (
            <IconChevronDown size={ 18 } stroke={ 1.5 } />
          ) : (
            <IconChevronRight size={ 18 } stroke={ 1.5 } />
          )
        }
        leftSection={
          <FontAwesomeIcon
            icon={ icon }
            size="sm"
            style={ { opacity: 0.6 } }
          />
        }
        mb="xs"
      >
        <Text size="sm" fw={ 600 } c="dimmed">
          { title }
        </Text>
      </Button>


      { isVisible && (
        <Stack mt="sm">
          <Box>
            { children }
          </Box>
        </Stack>
      ) }
    </Box>
  );
}