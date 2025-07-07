"use client"
import "@mantine/core/styles.css";
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, {useState} from "react";
import {
  Image, Text, Group, Burger, Button, Popover
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDatabase, faFloppyDisk} from "@fortawesome/free-solid-svg-icons";
import useStore from "@/store/dsStore";
import {Target} from "lucide-react";
import {save_get} from "@/properties/urls";

function AppHeader() {
  const pathName = usePathname();
  const isActive = (path: string) => pathName === path;
  const datasetUsed = useStore((state) => state.datasetUsed)?.name;
  const [opened, setOpened] = useState(false);
  const [saveMessage, setSaveMessage] = useState("Dataset saved");

  // Fixed: Function should not be called immediately in onClick
  const handleSave = async (datasetName: string) => {
    //setOpened((o) => !o);
    
    // Uncommented and fixed the actual save logic
    const baseUrl = save_get;
    const url = new URL(baseUrl);
    url.searchParams.append('datasetName', datasetName);
    
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        setSaveMessage("Error while saving Dataset");
      } else {
        setOpened((o) => !o);
        setSaveMessage("Dataset saved");
      }
    } catch (error) {
      setSaveMessage("Error while saving Dataset");
    }
    
    //setOpened((o) => !o);
  };

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
          <Button radius={50} variant={isNNTrust ? "subtle" : "filled"}>
            Data Quality
          </Button>
        </Link>
        <Link href="/pages/nntrust">
          <Button radius={50} variant={isNNTrust ? "filled" : "subtle"}>
            NN Trust
          </Button>
        </Link>
      </Group>
      
      <Group>
        {datasetUsed ? (
          <>
            <Popover opened={opened} onChange={setOpened}>
              <Popover.Target>
                <Button 
                  radius="lg" 
                  onClick={() => handleSave(datasetUsed)}
                >
                  <span><FontAwesomeIcon icon={faFloppyDisk}/></span>
                </Button>
              </Popover.Target>
              <Popover.Dropdown>{saveMessage}</Popover.Dropdown>
            </Popover>
            <Text>
              <span><FontAwesomeIcon icon={faDatabase}/></span> Dataset: {datasetUsed}
            </Text>
          </>
        ) : (
          <Text>
            <span><FontAwesomeIcon icon={faDatabase}/></span> No Dataset chosen
          </Text>
        )}
      </Group>
    </>
  );
}

export default React.memo(AppHeader);import {icon} from "@fortawesome/fontawesome-svg-core";
import {ok} from "assert";
import {includes} from "lodash";
import {memo} from "react";
