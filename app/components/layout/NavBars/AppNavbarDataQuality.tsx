"use client"
import "@mantine/core/styles.css";
import { usePathname, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from "react";
import Link from 'next/link'
import {
    Stack,
    Button,
    Text,
    Box,
    Space, Group,
    Menu
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faHouse, faImage, faChartLine, faBolt
} from '@fortawesome/free-solid-svg-icons';
import {
    IconChevronDown
  } from '@tabler/icons-react';
  import classes from './AppNavbarDataQuality.module.css';
import RouterButton from "@/components/client/buttons/RouterButton";


function AppNavbarDataQuality() {
    const [opened, { toggle, close }] = useDisclosure(false)
    const pathName = usePathname();
    const isActive = (path: string) => pathName === path;
    
    const isHomePage = pathName.endsWith('/');

    const [visible, setVisible] = useState(false);

    const searchParams = useSearchParams();
    const [ datasetName, setDatasetName ] = useState<string | null>( "" )
    
        useEffect( () =>
          {
            if ( searchParams.get( "name" ) ) {
              setDatasetName( searchParams.get( "name" ) )
            }
          }, [ searchParams ] )
    
    return (
        <Box p="md" style={{ height: '100%' }}>
            <Stack h="100%" gap="md">
                <Box>
                    <Link href="/" style={{ textDecoration: 'none' }}>
                        <Button 
                            leftSection={<FontAwesomeIcon icon={faHouse}/>}
                            radius="xl"
                            variant={isActive("/") ? "filled" : "subtle"}
                        >
                            Home
                        </Button>
                    </Link>
                </Box>

                <Space h="xs" />
                {/*
                <Box>
                <Group gap="xs" mb="xs">
                    <FontAwesomeIcon icon={faImage} size="sm" style={{ opacity: 0.6 }} />
                    <Text size="sm" fw={500} c="dimmed">
                        Visualization
                    </Text>
                </Group>
                    <Stack gap="xs">
                        <Link href="/pages/dataquality/embeddings">
                            <Button 
                                radius="xl"
                                variant={isActive("/pages/dataquality/embeddings") ? "filled" : "subtle"}
                            >
                                Embeddings
                            </Button>
                        </Link>
                    </Stack>
                </Box>
                */}
                <Box>
                <Group gap="xs" mb="xs" mr="xs">
                <Button
                className={classes.navbar}
                onClick={() => setVisible((prev) => !prev)}
                rightSection={<IconChevronDown size={18} stroke={1.5} />} pr={12}
                leftSection={<FontAwesomeIcon icon={faImage} size="sm" style={{ opacity: 0.6 }} />}>
                    <Text size="sm" fw={600} c="dimmed">
                        Visualization
                    </Text>
                </Button>
                </Group>

                {visible && (
                    <Stack mt="sm">
                        <Box >
                        {/*<Link href="/pages/dataquality/embeddings">*/}
                        <RouterButton name={datasetName} route={"/pages/dataquality/embeddings"}>
                                <Button 
                                    radius="xl"
                                    variant={isActive("/pages/dataquality/embeddings") ? "filled" : "subtle"}
                                    disabled={isHomePage}
                                >
                                    <Text size="sm" fw={600} c="dimmed">
                                        Embeddings
                                    </Text>
                                </Button>
                            </RouterButton>
                            {/*</Link>*/}
                            <Link href="/">
                                <Button 
                                    radius="xl"
                                    variant={isActive("/") ? "filled" : "subtle"}
                                    disabled
                                >
                                    <Text size="sm" fw={600} c="dimmed">
                                        Prototypes
                                    </Text>
                                </Button>
                        </Link>
                        </Box>
                    </Stack>
                )}
                </Box>

                <Box>
                    <Group gap="xs" mb="xs">
                        <FontAwesomeIcon icon={faChartLine} size="sm" style={{ opacity: 0.6 }} />
                        <Text size="sm" fw={500} c="dimmed">
                            Metrics
                        </Text>
                    </Group>
                    <Stack gap="xs">
                        <Box>
                            <Link href="/">
                                <Button 
                                    radius="xl"
                                    variant={isActive("/") ? "filled" : "subtle"}
                                    disabled
                                >
                                    Duplicates
                                </Button>
                            </Link>
                            <Link href="/">
                                <Button 
                                    radius="xl"
                                    variant={isActive("/") ? "filled" : "subtle"}
                                    disabled
                                >
                                    Outliers
                                </Button>
                            </Link>
                        </Box>
                    </Stack>
                </Box>

                <Box>
                    <Group gap="xs" mb="xs">
                        <FontAwesomeIcon icon={faBolt} size="sm" style={{ opacity: 0.6 }} />
                        <Text size="sm" fw={500} c="dimmed">
                            Action
                        </Text>
                    </Group>
                    <Stack gap="xs">
                        <Link href="/">
                            <Button 
                                radius="xl"
                                variant={isActive("/") ? "filled" : "subtle"}
                                disabled
                            >
                                Embeddings
                            </Button>
                        </Link>
                    </Stack>
                </Box>
            </Stack>
        </Box>
    )
}

export default React.memo(AppNavbarDataQuality)