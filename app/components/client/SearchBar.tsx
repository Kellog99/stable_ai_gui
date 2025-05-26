"use client";

import { useDebouncedCallback } from 'use-debounce';
import classes from './SearchBar.module.css';
import { TextInput } from '@mantine/core';
import { Suspense } from 'react'
import useStore from '../../store/dsStore';



function Search() {

  const queryDataset = useStore((state) => state.queryDataset)
  const setQueryDataset = useStore((state) => state.setQueryDataset)

  const handleSearch = useDebouncedCallback((term: string) => {
    setQueryDataset(term)
  }, 50);

    return(
            <TextInput
            className={classes.search}
            radius="xl"
            placeholder="Search datasets..."
            value={queryDataset}
            onChange={(e) => handleSearch(e.target.value)}
            />
    )
}

export default function SearchBar() {
  return (
    <Suspense>
      <Search />
    </Suspense>
  )
}
