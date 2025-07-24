"use client";

import { IsFeaturePresent } from "@/functionalities/Utils";
import Dataset from "@/interfaces/genericInterface";
import { embedding_type } from "@/properties/types";
import useStore from "@/store/dsStore";
import { Box, Divider, Space, Stack } from "@mantine/core";
import "@mantine/core/styles.css";
import { usePathname, useSearchParams } from 'next/navigation';
import React, { useEffect, useMemo, useState } from "react";
import { useNavigationState } from "./useNavigationState";
import { helpNavigation, mainNavigation, sections } from "./navigationConfig";
import NavigationButton from "./NavigationButton";
import CollapsibleSection from "./CollapsibleSection";


function AppNavbarDataQuality() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const datasetUsed = useStore((state) => state.datasetUsed);
  
  const [datasetName, setDatasetName] = useState<string | null>("");
  
  const { visualVisible, metricVisible, actionVisible, toggleSection } = useNavigationState();

  const isActive = (path: string) => pathname === path;
  
  const computedState = useMemo(() => {
    const isDatasetUndefined = datasetUsed == undefined;
    const areEmbeddings = datasetUsed ? IsFeaturePresent(datasetUsed as Dataset, embedding_type) : false;
    const isUQDataset = datasetUsed?.name === "military" || datasetUsed?.name === "ships";
    
    return {
      isDatasetUndefined,
      areEmbeddings,
      isUQDataset
    };
  }, [datasetUsed]);

  useEffect(() => {
    const name = searchParams.get("datasetName");
    if (name) {
      setDatasetName(name);
    }
  }, [searchParams]);

  const getTooltipLabel = (requiresDataset?: boolean, requiresEmbeddings?: boolean) => {
    if (requiresDataset && requiresEmbeddings) {
      return "Choose a dataset or provide the embeddings";
    }
    if (requiresDataset) {
      return "Choose a dataset";
    }
    return undefined;
  };

  const isItemDisabled = (item: any) => {
    const { isDatasetUndefined, areEmbeddings, isUQDataset } = computedState;
    
    if (item.requiresDataset && isDatasetUndefined) return true;
    if (item.requiresEmbeddings && !areEmbeddings) return true;
    if (item.excludeForUQDataset && isUQDataset) return true;
    
    return false;
  };

  return (
    <Box p="md" style={{ height: '100%' }}>
      <Stack h="100%" gap="md">
        {/* Main Navigation */}
        <Box>
          {mainNavigation.map((item) => (
            <React.Fragment key={item.key}>
              <NavigationButton
                href={item.href}
                icon={item.icon}
                label={item.label}
                isActive={isActive(item.href)}
                disabled={isItemDisabled(item)}
                tooltipLabel={getTooltipLabel(item.requiresDataset, item.requiresEmbeddings)}
              />
              {item.key === 'datasets' && <Space h="xs" />}
            </React.Fragment>
          ))}
        </Box>

        <Divider />

        {/* Collapsible Sections */}
        {sections.map((section) => (
          <CollapsibleSection
            key={section.key}
            title={section.title}
            icon={section.icon}
            isVisible={
              section.key === 'visualization' ? visualVisible :
              section.key === 'metrics' ? metricVisible :
              section.key === 'actions' ? actionVisible : false
            }
            onToggle={() => toggleSection(
              section.key === 'visualization' ? 'visualVisible' :
              section.key === 'metrics' ? 'metricVisible' : 'actionVisible'
            )}
          >
            {section.items.map((item) => (
              <NavigationButton
                key={item.key}
                href={item.href}
                
                label={item.label}
                isActive={isActive(item.href)}
                disabled={isItemDisabled(item)}
                tooltipLabel={getTooltipLabel(item.requiresDataset, item.requiresEmbeddings)}
              />
            ))}
          </CollapsibleSection>
        ))}

        {/* Help Section */}
        <Box>
          <NavigationButton
            href={helpNavigation.href}
            icon={helpNavigation.icon}
            label={helpNavigation.label}
            isActive={isActive(helpNavigation.href)}
          />
        </Box>
      </Stack>
    </Box>
  );
}

export default React.memo(AppNavbarDataQuality);