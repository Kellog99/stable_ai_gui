"use client"
import "@mantine/core/styles.css";
import { usePathname } from 'next/navigation'
import React from "react";
import Link from 'next/link'
import {
    Stack,
    Button,
    Box
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faHouse
} from '@fortawesome/free-solid-svg-icons';

function AppNavbarNNTrust() {
    const [opened, { toggle, close }] = useDisclosure(false)
    const pathName = usePathname();
    const isActive = (path: string) => pathName === path;
    
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
            </Stack>
        </Box>
    )
}

export default React.memo(AppNavbarNNTrust)