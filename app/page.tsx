// Usage in a page or layout
// Page.js (or App.js)
//import HomePage from "./pages/home/HomePage";

"use client";
import classes from './page.module.css';
import DatasetBT from '../app/components/server/DatasetBT';
import SearchBar from '../app/components/client/SearchBar';
import DatasetsLoader from './functionalities/DatasetsLoader';
import { Box, Button, Center, Divider, Flex, Loader, Modal, Text } from "@mantine/core";
import { useEffect, useState } from 'react';
import { InfoCircle, UploadArrowTray } from "@vectopus/atlas-icons-react";
import useStore from './store/dsStore';
import UploadModal from './components/client/UploadModal';
import { useDisclosure } from '@mantine/hooks';

/*
export const metadata = {
  title: "Data Quality Framework",
  description: "",
};
*/

/*
export default async function HomePage ( props: { searchParams: Promise<{ query: string }> } )
{
  const { searchParams } = props;

  const { query } = await searchParams;
  const datasets = await DatasetsLoader()

  console.log( "Server Response:", datasets )

  return (
    <>
      <SearchBar />
      <DatasetBT query={ query } datasets={ datasets } />
    </>
  );
}
*/

export default function HomePage() {

  //const [datasets, setData] = useState(undefined);
  const datasets = useStore((state) => (state.datasets));
  const setDatasets = useStore((state) => state.setDatasets)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    setIsLoading(true)
    DatasetsLoader().then(fetchedData => {
      setDatasets(fetchedData);
    }).finally(() => {
      setIsLoading(false)
    });
  }, []);


  console.log("Server Response:", datasets)
  const query = useStore((state) => (state.queryDataset));

  return (
    <>
      <Center>
        <Flex direction="row" align="center" gap="xs" style={{ width: "85%", marginBottom: "30px" }}>
          <SearchBar />

          <Button radius="md" onClick={open}>
            <Box style={{ marginRight: '8px' }}>
              <UploadArrowTray size={18} />
            </Box>
            <span>Upload</span>
          </Button>
        </Flex>
      </Center>
      
      <UploadModal opened={opened} close={close}/>


      {isLoading ? (
        <Flex
          mih={150}
          justify="center"
          align="center"
          direction="column"
          wrap="wrap"
          style={{ width: '100%' }}
        >
          <Text>Loading...</Text>
          <Loader />
        </Flex>) :
        (
          <DatasetBT query={query} datasets={datasets} />
        )}

    </>
  );
}
