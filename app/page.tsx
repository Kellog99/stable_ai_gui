// Usage in a page or layout
// Page.js (or App.js)
//import HomePage from "./pages/home/HomePage";


import classes from './page.module.css';
import DatasetBT from '../app/components/server/DatasetBT';
import SearchBar from '../app/components/client/SearchBar';
import DatasetsLoader from './functionalities/DatasetsLoader';

export const metadata = {
  title: "Data Quality Framework",
  description: "",
};


export default async function HomePage ( props: { searchParams: Promise<{ query: string }> } )
{
  const { searchParams } = props;

  const { query } = await searchParams;
  const datasets = await DatasetsLoader()

  //console.log( "Server Response:", datasets )

  return (
    <>
      <SearchBar />
      <DatasetBT query={ query } datasets={ datasets } />
    </>
  );
}
