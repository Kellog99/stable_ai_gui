

import { AppShell, AppShellHeader, AppShellNavbar, AppShellMain, Image, Title, Flex} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import classes from './HomePage.module.css';
import { TextInput } from '@mantine/core';
import { useState } from 'react';
import DatasetBT from '../../components/server/DatasetBT';
import Filters from '../../components/client/Filters';
import SearchBar from '../../components/client/SearchBar';


interface HomePageProps {
  searchParams: {
    query?: string;
  };
}

export default async function HomePage({ searchParams }: HomePageProps) {
  

  const {query} = searchParams;
  
  //const datasetQuery = (await Promise.resolve(searchParams?.query)) || '';
  
  
  /*const [opened, { toggle }] = useDisclosure();*/
  
  
  const datasetsResponse = await fetch("http://localhost:8000");

  const datasets = await datasetsResponse.json(); 
  

  return (
    <AppShell
      header={{ height:  150}}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        //collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShellHeader>
        <Flex
          mih={150}
          bg="#f0f0f0"
          gap="sm"
          justify="center"
          align="center"
          direction="column"
          wrap="wrap"
          >
          <Image
              className={classes.logo}
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Logo_Leonardo.svg/2560px-Logo_Leonardo.svg.png"
              alt="logo"
          />
          <Title className={classes.title} >Data Quality Framework</Title>
        </Flex>
      </AppShellHeader>

      <AppShellNavbar 
        p="md"
        bg="#f0f0f0"
        >
        <Filters/>

      </AppShellNavbar>

      <AppShellMain>
        <SearchBar />
        <DatasetBT query={query} datasets={datasets}/>
      </AppShellMain>
    </AppShell>
  );
}
// <DatasetBT query={datasetQuery} datasets={datasets}/>