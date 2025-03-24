import { PointCloudVisualization } from '../../components/client/PointCloudVisualization';
import { cache, Suspense } from 'react'; // or from 'next/cache' in some versions
import FeatureLoader from '../../functionalities/FeatureLoader';
import ImageDisplayer from '../../components/server/ImageDisplayer';
import getData from '../../functionalities/Utils';
import dynamic from "next/dynamic"
import Loading from './loader';


export default async function Home(props: {searchParams: Promise<{ name: string , indexes : string}> }) {
  const { searchParams } = props;
  const { name } = await searchParams;
  const {indexes} = await searchParams
  //conditional fetching TODO
  const resourcess = await FeatureLoader(indexes,"image")
  console.log(resourcess)
  //const data = await getData();

  return (
    <div className="w-full h-screen">
      <div>
        <h1>This is the Embedding Visualization Page</h1>
        <h2>You are using {name} dataset</h2>
      </div>
      <Suspense>
        <PointCloudVisualization/>
      </Suspense>
      
      {/* Conditional rendering for resourcess */}
      {resourcess && resourcess.length > 0 && (
        <div>
          {resourcess.map((res, index) => {
            console.log("RES",resourcess[index])
            return <ImageDisplayer data={resourcess[index]} alt="prova" key={index} />;
          })}
        </div>
      )}
    </div>
  );
}