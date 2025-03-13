'use client';
import React from "react";
import { useState } from "react";
import { TextInput } from "@mantine/core";
import classes from './SearchBar.module.css';
import DatasetBT from "../server/DatasetBT";


interface SearchBarProps {
  datasets: any[];
}

export default function SearchBar({ 
  datasets
}: React.PropsWithChildren<SearchBarProps>) {

    const [searchDataset, setSearchDataset] = useState("");
    
    const filteredDatasets = datasets.filter((dataset) =>
      dataset.name.toLowerCase().includes(searchDataset.toLowerCase())
    ); 

    return(
        <div >
            <TextInput
            className={classes.search}
            radius="xl"
            placeholder="Search datasets..."
            value={searchDataset}
            onChange={(e) => setSearchDataset(e.target.value)}
            />
            {filteredDatasets.length > 0 ? (
            <DatasetBT data={filteredDatasets} />
          ) : searchDataset === "" ? (
            <DatasetBT data={datasets} />
          ) : null
          }
        </div>
    )
}