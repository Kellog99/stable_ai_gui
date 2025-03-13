'use client';
import React from "react";
import { useState, createContext } from "react";
import { TextInput } from "@mantine/core";
import classes from './SearchBar.module.css';
import DatasetBT from "../server/DatasetBT";
import { useSearch } from "../context/SearchBarContext";

export default function SearchBar() {
    const {searchQuery, setSearchQuery} = useSearch();

    return(
        <div >
            <TextInput
            className={classes.search}
            radius="xl"
            placeholder="Search datasets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
    )
}


/*{filteredDatasets.length > 0 ? (
            <DatasetBT data={filteredDatasets} />
          ) : searchDataset === "" ? (
            <DatasetBT data={datasets} />
          ) : null
          }*/