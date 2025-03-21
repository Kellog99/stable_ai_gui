import { PointCloudVisualization } from '../../components/client/PointCloudVisualization';
import { cache } from 'react'; // or from 'next/cache' in some versions
import FeatureLoader from '../../functionalities/FeatureLoader';
import ImageDisplayer from '../../components/server/ImageDisplayer';

// Wrap the function with cache so that repeated calls return the cached result
const getData = cache(async function getData() {
  // Simulate fetching 80,000 points
  const points = Array.from({ length: 80000 }, () => ({
    position: [
      (Math.random() - 0.5) * 1000, // x
      (Math.random() - 0.5) * 1000, // y
      (Math.random() - 0.5) * 1000  // z
    ],
    color: [
      Math.random() * 255, // r
      Math.random() * 255, // g
      Math.random() * 255  // b
    ]
  }));
  return points;
});

export default async function Home(props: {searchParams: Promise<{ name: string , indexes : string}> }) {
  const { searchParams } = props;
  const { name } = await searchParams;
  const {indexes} = await searchParams
  //conditional fetching TODO
  const resourcess = await FeatureLoader(indexes,"image")
  
  console.log(resourcess)
  const data = await getData();

  return (
    <div className="w-full h-screen">
      <div>
        <h1>This is the Embedding Visualization Page</h1>
        <h2>You are using {name} dataset</h2>
      </div>
      
      <PointCloudVisualization data={data} />
      
      {/* Conditional rendering for resourcess */}
      {resourcess && resourcess.length > 0 && (
        <div>
          {resourcess.map((res, index) => {
            console.log("RES",resourcess[index])
            return <ImageDisplayer data={resourcess[index]} alt="prova" />;
          })}
        </div>
      )}
    </div>
  );
}