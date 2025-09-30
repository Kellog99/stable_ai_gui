import React, { useState } from 'react'
import { Box, Burger, Divider, Space, Stack, Text } from "@mantine/core";

interface NavbarProps {

}


const Navbar: React.FC<NavbarProps> = () => {
    // handle the burger button
    const [collapsed, setCollapsed] = useState<boolean>(true)

    return (
        <Box
            style={{
                height: '100%',
                width: collapsed ? '50px' : '250px',
                transition: 'width 0.3s ease',

            }}
        >
            <Box
                p="sm"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: collapsed ? 'center' : 'space-between'
                }}
            >

                <Burger
                    opened={collapsed}
                    // onClick={toggleCollapsed}
                    aria-label="Toggle navigation"
                    size="sm"
                    color="white"
                />
            </Box>

            {/* <Box p={collapsed ? "xs" : "md"}>
                {!collapsed && <Divider />}
                <Stack h="100%" gap="md" mt="md">
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
                                    collapsed={collapsed}
                                />
                                {item.key === 'datasets' && <Space h="xs" />}
                            </React.Fragment>
                        ))}
                    </Box>

                    {!collapsed && <Divider />}


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
                            collapsed={collapsed}
                        >
                            {section.items.map((item) => (
                                <NavigationButton
                                    key={item.key}
                                    href={item.href}
                                    icon={item.icon}
                                    label={item.label}
                                    isActive={isActive(item.href)}
                                    disabled={isItemDisabled(item)}
                                    tooltipLabel={getTooltipLabel(item.requiresDataset, item.requiresEmbeddings)}
                                    collapsed={collapsed}
                                />
                            ))}
                        </CollapsibleSection>
                    ))}

                </Stack>
            </Box> */}
        </Box>
    )
}

export default Navbar