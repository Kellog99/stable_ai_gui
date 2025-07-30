"use client";

import { usePathname } from "next/navigation";
import { useNavigationState } from "../Utils/useNavigationState";
import { Box, Space, Stack } from "@mantine/core";
import { mainNavigation } from "./navigationConfig";
import React from "react";
import NavigationButton from "../Utils/NavigationButton";




function AppNavBarNNTrust() {
    const pathname = usePathname();


    const { visualVisible, metricVisible, actionVisible, toggleSection } = useNavigationState();

    const isActive = (path: string) => pathname === path;;

    return (
        <Box p="md" style={{ height: '100%' }}>
            <Stack h="100%" gap="md">

                <Box>
                    {mainNavigation.map((item) => (
                        <React.Fragment key={item.key}>
                            <NavigationButton
                                href={item.href}
                                icon={item.icon}
                                label={item.label}
                                isActive={isActive(item.href)}
                            />
                            {item.key === 'datasets' && <Space h="xs" />}
                        </React.Fragment>
                    ))}
                </Box>
            </Stack>
        </Box>
    );
}

export default React.memo(AppNavBarNNTrust);