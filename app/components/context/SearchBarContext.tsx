"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Dataset {
    name: string;
    n_samples: number;
    task: string;
    features: {
        type: string;
        name: string;
        datas: string[];
        is_logic: boolean
      };
    prototype: {
        type: string;
        name: string;
        datas: string[];
        is_logic: boolean
      };  
    n_classes: number;
    samples_per_class?: number;
    label_dict?: any;
  }

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredDatasets: Dataset[];
  datasets: Dataset[];
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children, datasets }: { children: ReactNode; datasets: Dataset[] }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDatasets = searchQuery
    ? datasets.filter(dataset => dataset.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : datasets;

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery, filteredDatasets, datasets }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}