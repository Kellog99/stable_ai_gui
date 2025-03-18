"use client";

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import classes from './SearchBar.module.css';
import { TextInput } from '@mantine/core';
import { Suspense } from 'react'



function Search() {
  const searchParams = useSearchParams()
  const pathname = usePathname();
  const { replace } = useRouter();
  
  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    term ? params.set('query', term) : params.delete('query');
    replace(`${pathname}?${params.toString()}`);
  }, 300);

    return(
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            handleSearch(formData.get('search') as string);
          }}
          >
            <TextInput
            className={classes.search}
            radius="xl"
            placeholder="Search datasets..."
            defaultValue={searchParams.get('query')?.toString()}
            onChange={(e) => handleSearch(e.target.value)}
            />
        </form>
    )
}

export default function SearchBar() {
  return (
    <Suspense>
      <Search />
    </Suspense>
  )
}
