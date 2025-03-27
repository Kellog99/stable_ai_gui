"use client"
import "@mantine/core/styles.css";
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useState } from "react";
import {
    Stack, Button
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faLocationArrow
} from '@fortawesome/free-solid-svg-icons'; //replace free solid with your desired icon set


function AppNavbar() {
    const [opened, { toggle, close }] = useDisclosure(false)
    const pathName = usePathname();
    const isActive = (path: string) => pathName === path;
    return (
        <>
            <Stack>
                <Link href="/">
                    <Button radius={50} variant={isActive("/") ? "filled" : "subtle"}><FontAwesomeIcon icon={faLocationArrow} /></Button>
                </Link>
                <Link href="/">
                    <Button radius={50} variant={isActive("/") ? "filled" : "subtle"}>Home</Button>
                </Link>
            </Stack>
        </>
    )

}


export default React.memo(AppNavbar);