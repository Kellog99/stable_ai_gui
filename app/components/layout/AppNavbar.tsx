"use client";

import { usePathname } from "next/navigation";
import AppNavbarNNTrust from "./NavBars/NNTrust/AppNavBarNNTrust";
import AppNavbarDataQuality from "./NavBars/DataQuality/AppNavbarDataQuality";
import { useDisclosure } from "@mantine/hooks";
import { Burger } from "@mantine/core";
import AppNavBarReport from "./NavBars/Report/AppNavBarReport";


export default function AppNavbar() {
    const pathName = usePathname();

    const isNNTrust = pathName.includes('/nntrust');
    const isDQ = pathName.includes('/dataquality');
    const [opened, { toggle }] = useDisclosure(false)
    
    return (
        <>
        {/*<Burger opened={opened} onClick={toggle}/>*/}
        {isNNTrust ? <AppNavbarNNTrust /> : isDQ ? <AppNavbarDataQuality/> : <AppNavBarReport/>}
        </>
    )
}