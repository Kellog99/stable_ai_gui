"use client";

import { usePathname } from "next/navigation";
import AppNavbarNNTrust from "./NavBars/AppNavbarNNTrust";
import AppNavbarDataQuality from "./NavBars/AppNavbarDataQuality";
import { useDisclosure } from "@mantine/hooks";
import { Burger } from "@mantine/core";


export default function AppNavbar() {
    const pathName = usePathname();

    const isNNTrust = pathName.includes('/nntrust');
    const [opened, { toggle }] = useDisclosure(false)
    
    return (
        <>
        <Burger opened={opened} onClick={toggle}/>
        {isNNTrust ? <AppNavbarNNTrust /> : <AppNavbarDataQuality/>}
        </>
    )
}