"use client";

import { usePathname } from "next/navigation";
import AppNavbarNNTrust from "./NavBars/NNTrust/AppNavBarNNTrust";
import AppNavbarDataQuality from "./NavBars/DataQuality/AppNavbarDataQuality";
import AppNavBarReport from "./NavBars/Report/AppNavBarReport";
import Navbar from "./Navbar";

export default function AppNavbar() {
    const pathName = usePathname();

    const isNNTrust = pathName.includes('/redteam');
    const isDQ = pathName.includes('/dataquality');
    



        
    return (
        <>
            {
                isNNTrust ?
                    <AppNavbarNNTrust />
                    : isDQ ?
                        <AppNavbarDataQuality />
                        : <AppNavBarReport />
            }
            <Navbar></Navbar>
        </>
    )
}