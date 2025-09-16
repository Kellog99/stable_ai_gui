"use client";

import { usePathname } from "next/navigation";
import AppNavbarNNTrust from "./NavBars/NNTrust/AppNavBarNNTrust";
import AppNavbarDataQuality from "./NavBars/DataQuality/AppNavbarDataQuality";
import { useDisclosure } from "@mantine/hooks";


export default function AppNavbar() {
    const pathName = usePathname();

    const isNNTrust = pathName.includes('/nntrust');
    const [opened, { toggle }] = useDisclosure(false)
    
    return (
        <>
        {/*<Burger opened={opened} onClick={toggle}/>*/}
        {isNNTrust ? <AppNavbarNNTrust /> : <AppNavbarDataQuality/>}
        </>
    )
}