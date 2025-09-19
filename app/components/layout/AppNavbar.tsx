"use client";

import { usePathname } from "next/navigation";
import AppNavbarNNTrust from "./NavBars/NNTrust/AppNavBarNNTrust";
import AppNavbarDataQuality from "./NavBars/DataQuality/AppNavbarDataQuality";
import { useDisclosure } from "@mantine/hooks";
import AppNavBarReport from "./NavBars/Report/AppNavBarReport";


export default function AppNavbar() {
    const pathName = usePathname();

    const isNNTrust = pathName.includes('/nntrust');
    const isDQ = pathName.includes('/dataquality');
    const [opened, { toggle }] = useDisclosure(false)

    return (
        <>
            {
                isNNTrust ?
                    <AppNavbarNNTrust />
                    : isDQ ?
                        <AppNavbarDataQuality />
                        : <AppNavBarReport />
            }
        </>
    )
}