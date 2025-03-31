// Usage in a page or layout
// Page.js (or App.js)
//import HomePage from "./pages/home/HomePage";

"use client";
import classes from './page.module.css';
import DatasetBT from '../app/components/server/DatasetBT';
import SearchBar from '../app/components/client/SearchBar';
import DatasetsLoader from './functionalities/DatasetsLoader';
import { useEffect, useState } from 'react';
import useStore from './store/dsStore';

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
  const datasets  = useStore((state) => (state.datasets));
  const setDatasets = useStore((state) => state.setDatasets)

  
  useEffect(() => {
    DatasetsLoader().then(fetchedData => {
      setDatasets(fetchedData);
    });
  }, []);
  

  console.log("Server Response:",datasets)
  const query  = useStore((state) => (state.queryDataset));

  return (
    <>
      <SearchBar />
      <DatasetBT query={ query } datasets={ datasets } />
    </>
  );
}
