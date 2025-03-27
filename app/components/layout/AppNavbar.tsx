"use client"
import "@mantine/core/styles.css";
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useState } from "react";
import
{
    Stack, Button,
    Divider,
    NavLink, Text
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import
{
    faHouse
} from '@fortawesome/free-solid-svg-icons'; //replace free solid with your desired icon set


function AppNavbar ()
{
    const [ opened, { toggle, close } ] = useDisclosure( false )
    const pathName = usePathname();
    const isActive = ( path: string ) => pathName === path;
    return (
        <nav className="h-screen w-64 bg-gray-50 p-6 flex flex-col">
            <NavLink
                href="/"
                label="Home"
                leftSection={
                    <Button className="flex items-center gap-2 " radius={ 50 } variant={ isActive( "/" ) ? "filled" : "subtle" } >
                        <FontAwesomeIcon icon={ faHouse } />
                        Home
                    </Button> }
                variant={ isActive( '/' ) ? 'filled' : 'light' }
            />

            <Stack gap="lg" className="flex-1">
                <div>
                    <Text size="sm" fw={500} c="dimmed" className="px-3 mb-2">
                        Visualization
                    </Text>
                    <Stack gap="xs">
                        <NavLink
                            href="/pages/dataquality/embeddings"
                            label="Embeddings"
                            leftSection={
                                <Button radius={ 50 } variant={ isActive( "/pages/dataquality/embeddings" ) ? "filled" : "subtle" }>Embeddings</Button> }
                            variant={ isActive( "/pages/dataquality/embeddings" ) ? 'filled' : 'light' }
                        />
                    </Stack>
                </div>
            </Stack>

        </nav>
    )

}


export default React.memo( AppNavbar );