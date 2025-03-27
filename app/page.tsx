// Usage in a page or layout
// Page.js (or App.js)
//import HomePage from "./pages/home/HomePage";


import { AppShell, AppShellHeader, AppShellNavbar, AppShellMain, Image, Title, Flex } from '@mantine/core';;
import classes from './page.module.css';
import DatasetBT from '../app/components/server/DatasetBT';
import Filters from './components/client/AppNavbar';
import SearchBar from '../app/components/client/SearchBar';
import DatasetsLoader from './functionalities/DatasetsLoader';

export const metadata = {
  title: "Data Quality Framework",
  description: "",
};

//export default async function HomePage({ searchParams }: { searchParams: { query?: string } }) {

export default async function HomePage(props: { searchParams: Promise<{ query: string }> }) {
  const { searchParams } = props;

  const { query } = await searchParams;

  //console.log("Dataset query:", query);

  /*const [opened, { toggle }] = useDisclosure();*/
  /*
  const response = await POST();
  
  const data = await response.json();
  
  if ("message" in data) {
    console.log("post:", data.message);
  } else {
    console.error("Error:", data.error);
  }
*/

  const datasets = await DatasetsLoader()

  console.log("Server Response:", datasets)


  /*
  const datasetsResponse = await fetch("http://localhost:8000", {
    cache: 'force-cache',
  });

  const datasets = await datasetsResponse.json(); 
  */

  return (
    <>
      <SearchBar />
      <DatasetBT query={query} datasets={datasets} />
    </>
  );
}

/*
<DatasetBT query={query} datasets={[
  { id: '1', name: 'Test Dataset 1' },
  { id: '2', name: 'Test Dataset 2' },
  { id: '3', name: 'Another Dataset' },
]}/>
*/

/*export default async function Page() {
  const endPointApi = 'http://localhost:8000/get-image-data'
  
  return (
    <main>
      <HomePage/>
    </main>
  );
}
*/

