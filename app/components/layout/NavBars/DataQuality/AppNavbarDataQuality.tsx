"use client";

import { IsFeaturePresent } from "@/functionalities/Utils";
import Dataset from "@/interfaces/genericInterface";
import { embedding_type } from "@/properties/types";
import useStore from "@/store/dsStore";
import { Box, Burger, Divider, Space, Stack, Text } from "@mantine/core";
import "@mantine/core/styles.css";
import { usePathname, useSearchParams } from 'next/navigation';
import React, { useEffect, useMemo, useState } from "react";
import CollapsibleSection from "../Utils/CollapsibleSection";
import NavigationButton from "../Utils/NavigationButton";
import { useNavigationState } from "../Utils/useNavigationState";
import { mainNavigation, sections } from "./navigationConfig";


function AppNavbarDataQuality ()
{
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const datasetUsed = useStore( ( state ) => state.datasetUsed );

  const [ datasetName, setDatasetName ] = useState<string | null>( "" );
  //const [collapsed, setCollapsed] = useState(false);

  const collapsed = useStore( ( state ) => state.collapsed );
  const setCollapsed = useStore( ( state ) => state.setCollapsed );

  const { visualVisible, metricVisible, actionVisible, toggleSection } = useNavigationState();

  const isActive = ( path: string ) => pathname === path;

  const toggleCollapsed = () =>
  {
    setCollapsed( !collapsed );
  };

  const computedState = useMemo( () =>
  {
    const isDatasetUndefined = datasetUsed == undefined;
    const areEmbeddings = datasetUsed ? IsFeaturePresent( datasetUsed as Dataset, embedding_type ) : false;
    const isUQDataset = datasetUsed?.name === "military" || datasetUsed?.name === "ships";

    return {
      isDatasetUndefined,
      areEmbeddings,
      isUQDataset
    };
  }, [ datasetUsed ] );

  useEffect( () =>
  {
    const name = searchParams.get( "datasetName" );
    if ( name ) {
      setDatasetName( name );
    }
  }, [ searchParams ] );

  const getTooltipLabel = ( requiresDataset?: boolean, requiresEmbeddings?: boolean ) =>
  {
    if ( requiresDataset && requiresEmbeddings ) {
      return "Choose a dataset or provide the embeddings";
    }
    if ( requiresDataset ) {
      return "Choose a dataset";
    }
    return undefined;
  };

  const isItemDisabled = ( item: any ) =>
  {
    const { isDatasetUndefined, areEmbeddings, isUQDataset } = computedState;

    if ( item.requiresDataset && isDatasetUndefined ) return true;
    if ( item.requiresEmbeddings && !areEmbeddings ) return true;
    if ( item.excludeForUQDataset && isUQDataset ) return true;

    return false;
  };

  return (
    <Box
      style={ {
        height: '100%',
        width: collapsed ? '50px' : '250px',
        transition: 'width 0.3s ease',

      } }
    >
      <Box
        p="sm"
        style={ {
          
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between'
        } }
      >
        
        <Burger
          opened={ collapsed }
          onClick={ toggleCollapsed }
          aria-label="Toggle navigation"
          size="sm"
          color="white"
        />
      </Box>
      
      <Box p={ collapsed ? "xs" : "md" }>
        { !collapsed && <Divider /> }
        <Stack h="100%" gap="md" mt="md">
          <Box>
            { mainNavigation.map( ( item ) => (
              <React.Fragment key={ item.key }>
                <NavigationButton
                  href={ item.href }
                  icon={ item.icon }
                  label={ item.label }
                  isActive={ isActive( item.href ) }
                  disabled={ isItemDisabled( item ) }
                  tooltipLabel={ getTooltipLabel( item.requiresDataset, item.requiresEmbeddings ) }
                  collapsed={ collapsed }
                />
                { item.key === 'datasets' && <Space h="xs" /> }
              </React.Fragment>
            ) ) }
          </Box>

          { !collapsed && <Divider /> }


          { sections.map( ( section ) => (
            <CollapsibleSection
              key={ section.key }
              title={ section.title }
              icon={ section.icon }
              isVisible={
                section.key === 'visualization' ? visualVisible :
                  section.key === 'metrics' ? metricVisible :
                    section.key === 'actions' ? actionVisible : false
              }
              onToggle={ () => toggleSection(
                section.key === 'visualization' ? 'visualVisible' :
                  section.key === 'metrics' ? 'metricVisible' : 'actionVisible'
              ) }
              collapsed={ collapsed }
            >
              { section.items.map( ( item ) => (
                <NavigationButton
                  key={ item.key }
                  href={ item.href }
                  icon={ item.icon }
                  label={ item.label }
                  isActive={ isActive( item.href ) }
                  disabled={ isItemDisabled( item ) }
                  tooltipLabel={ getTooltipLabel( item.requiresDataset, item.requiresEmbeddings ) }
                  collapsed={ collapsed }
                />
              ) ) }
            </CollapsibleSection>
          ) ) }

        {/*}
          <Box>
            <NavigationButton
              href={ helpNavigation.href }
              icon={ helpNavigation.icon }
              label={ helpNavigation.label }
              isActive={ isActive( helpNavigation.href ) }
              collapsed={ collapsed }
            />
          </Box>
          */}
        </Stack>
      </Box>
    </Box>
  );
}

export default React.memo( AppNavbarDataQuality );