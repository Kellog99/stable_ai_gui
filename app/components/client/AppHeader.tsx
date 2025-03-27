"use client"
import "@mantine/core/styles.css";
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useState } from "react";
import {
    MantineProvider,
    ColorSchemeScript,
    mantineHtmlProps,
    AppShell, AppShellHeader, AppShellNavbar, AppShellMain, Image, Title, Flex, Group, Burger, Button
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

function AppHeader() {
    const [opened, { toggle, close }] = useDisclosure(false)
    const pathName = usePathname();
    const isActive = (path: string) => pathName === path;
    return (
        <>
            <Group>
                <Burger opened={opened} onClick={toggle} hiddenFrom="sm" />
                <Link href="/">
                    <Image
                        src="/logo_leonardo.png"
                        alt="logo"
                        h={25}
                    />
                </Link>
            </Group>

            <Group>
                <Link href="/">
                    <Button radius={50} variant={isActive("/") ? "filled" : "subtle"}>Home</Button>
                </Link>
                <Link href="/pages/embeddings">
                    <Button radius={50} variant={isActive("/pages/embeddings") ? "filled" : "subtle"}>Embeddings</Button>
                </Link>
            </Group>
            <Group>
                {/*Icona utente cliccabile*/}
            </Group>
        </>
    )

}


export default React.memo(AppHeader);