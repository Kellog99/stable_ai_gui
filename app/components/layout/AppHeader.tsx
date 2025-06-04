"use client"
import "@mantine/core/styles.css";
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React  from "react";
import {
 Image, Text, Group, Burger, Button
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDatabase } from "@fortawesome/free-solid-svg-icons";
import useStore from "@/store/dsStore";


function AppHeader() {
    const [opened, { toggle, close }] = useDisclosure(false)
    const pathName = usePathname();
    const isActive = (path: string) => pathName === path;
    const datasetUsed = useStore( ( state ) => state.datasetUsed )?.name;
    

    const isNNTrust = pathName.includes('/nntrust');
    return (
        <>
            <Group>
                {/*<Burger opened={opened} onClick={toggle} hiddenFrom="sm" />*/}
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
                    <Button radius={50} variant={isNNTrust ? "subtle" : "filled"}>Data Quality</Button>
                </Link>
                
                <Link href="/pages/nntrust">
                    <Button radius={50} variant={isNNTrust ? "filled" : "subtle"}>NN Trust</Button>
                </Link>
            </Group>
            <Group>
            {datasetUsed ? (
                <Text><span><FontAwesomeIcon icon={ faDatabase }/></span> Dataset: {datasetUsed}</Text>
            ) : (<Text><span><FontAwesomeIcon icon={ faDatabase }/></span> No Dataset chosen</Text>)}
            </Group>
        </>
    )

}


export default React.memo(AppHeader);