"use client";

import { useDebouncedCallback } from 'use-debounce';
import classes from './SearchBar.module.css';
import { Box, TextInput } from '@mantine/core';
import { Suspense } from 'react'
import useStore from '../../store/dsStore';



function Search() {

  const queryDataset = useStore((state) => state.queryDataset)
  const setQueryDataset = useStore((state) => state.setQueryDataset)

  const handleSearch = useDebouncedCallback((term: string) => {
    setQueryDataset(term)
  }, 50);

    return(
      <>
        <Box style={{width:"85%"}}>
            <TextInput
              className={classes.search}
              radius="md"
              placeholder="Search datasets..."
              value={queryDataset}
              onChange={(e) => handleSearch(e.target.value)}
            />
        </Box>
        </>
    )
}

export default function SearchBar() {
  return (
    <Suspense>
      <Search />
    </Suspense>
  )
}
