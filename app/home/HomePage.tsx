'use client'

import { AppShell, Image, Title, Flex} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import classes from './AppDemo.module.css';
import { TextInput } from '@mantine/core';
import { useState } from 'react';
import DatasetBT from '../components/client/app/DatasetBT';
import Filters from '../components/client/app/Filters';

export function HomePage() {
  const [opened, { toggle }] = useDisclosure();
  
  
  const datasets = [
    {
      prototype: "/0a37838e99.jpg",
      name: "Antelopes",
      n_classes: 90,
      samples_per_class: 60,
      n_samples: 90 * 60,
      task: "Image Classification",
      features: ["image", "label"]
    },
    {
      prototype: "/2f3534e28e.jpg",
      name: "Elephants",
      n_classes: 90,
      samples_per_class: 60,
      n_samples: 90 * 60,
      task: "Image Classification",
      features: ["image", "label"]
    },
    {
      prototype: "/133858239_3eaa8a91fd_n.jpg",
      name: "Tulips",
      n_classes: 90,
      samples_per_class: 60,
      n_samples: 90 * 60,
      task: "Image Classification",
      features: ["image", "label"]
    },
    {
      prototype: "/164670455_29d8e02bbd_n.jpg",
      name: "Sunflowers",
      n_classes: 90,
      samples_per_class: 60,
      n_samples: 90 * 60,
      task: "Image Classification",
      features: ["image", "label"]
    }
      ];
  
    const [searchDataset, setSearchDataset] = useState("");
    
    const filteredDatasets = datasets.filter((dataset) =>
      dataset.name.toLowerCase().includes(searchDataset.toLowerCase())
    );

  return (
    <AppShell
      header={{ height:  150}}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
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
          />
          <Title className={classes.title} >Data Quality Framework</Title>
        </Flex>
      </AppShell.Header>

      <AppShell.Navbar 
        p="md"
        bg="#f0f0f0"
        >
        <Filters/>

      </AppShell.Navbar>

      <AppShell.Main>
        <div >
          <TextInput
            className={classes.search}
            radius="xl"
            placeholder="Search datasets..."
            value={searchDataset}
            onChange={(e) => setSearchDataset(e.target.value)}
          />
        </div>
          {filteredDatasets.length > 0 ? (
            <DatasetBT data={filteredDatasets} />
          ) : searchDataset === "" ? (
            <DatasetBT data={datasets} />
          ) : null
          }
      </AppShell.Main>
    </AppShell>
  );
}
