"use client";

import { PointCloudVisualization } from '../../components/client/PointCloudVisualization';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { cache, Suspense, useState, useEffect, useRef} from 'react'; 
import FeatureLoader from '../../functionalities/FeatureLoader';
import ImageDisplayer from '../../components/server/ImageDisplayer';
import getData from '../../functionalities/Utils';
import dynamic from "next/dynamic"
import Loading from './loader';
import TextDisplayer from '../../components/server/TextDisplayer';
import { Card, Text, Badge, Group, Grid, CardSection, GridCol, Autocomplete, Flex, ScrollArea} from '@mantine/core';
import { image_type, text_type } from "../../properties/types";
import classes from "./page.module.css"
import featureLoader from '../../functionalities/FeatureLoader';
import useStore from '../../store/dsStore';
import style from 'styled-jsx/style';
import { useIntersection } from '@mantine/hooks';

interface Feature{
  
    type: string;
    name: string;
    datas: string[];
    is_logic: boolean
  
}


function Home() {

  const searchParams = useSearchParams();
  const [feature, setFeature] = useState<Feature | null>(null)
  const [featureData, setFeatureData] = useState<string[]>([])
  const [featureType, setFeatureType] = useState<any>("")
  const [featureName, setFeatureName] = useState<any>("")
  const [datasetName, setDatasetName] = useState<string | null>("")
  const [displayedFeatureData, setDisplayedFeatureData] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<any>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const { ref, entry } = useIntersection({
    root: containerRef.current,
    threshold: 0.1,
  });
  

  //setDatasetName(searchParams.get("name"))
  //const datasetName = "Animals"
  const indexes = useStore((state) => state.selectedIndexes);
  //const featureName = "image"
  //const datasetName = "Animal Dataset"

  useEffect(() => {
    if (searchParams.get("name")){
      setDatasetName(searchParams.get("name"))
    }
  }, [searchParams])
  
  //const feature = getFeatureResources(indexes,featureName)
  
  useEffect(() => {
    // Only proceed if featureName is not an empty string
    if (featureName != "") {
      const loadFeature = async () => {
        try {
          if (datasetName && featureName){
          const feature = await featureLoader(datasetName,featureName);
          console.log(feature);
          setFeature(feature);
          setFeatureType(feature.type)
          }
        } catch (error) {
          console.error('Error loading feature:', error);
        }
      };
      loadFeature();
    }
  }, [featureName]); // Still keep indexes and featureName in the dependency array

  useEffect(() => {
    // Only proceed if indexes is not null
    if (indexes != null && feature != null) {
      const filterFeature = async () => {
        try {
          let filteredArr : string[] = [];
          indexes.forEach(index => {
          filteredArr.push(feature.datas[index]);
          });
          setFeatureData(filteredArr)
        } catch (error) {
          console.error('Error loading feature:', error);
        }
      };
      filterFeature();
    }
  }, [indexes]); // Still keep indexes and featureName in the dependency array



  

  return (
    <div className="w-full h-screen">
      <div>
        <h1>This is the Embedding Visualization Page</h1>
        <h2>You are using {datasetName} dataset</h2>
      </div>
      
      <label htmlFor="feature" className="font-bold">Feature</label>
      <div id="autocomplete-container" style={{width: '300px', position: 'relative', marginBottom: '20px'}}>
        <Autocomplete 
          id="feature" 
          radius="md" 
          placeholder="Choose feature to visualize" 
          data={['image']} 
          value={featureName} 
          onChange={(value) => setFeatureName(value)} 
        />
      </div>

      {featureName !== "" ? (
        <>
          <Flex 
            mih={150} 
            justify="center" 
            align="center" 
            direction="column" 
            wrap="wrap"
          >
            <Suspense>
              <PointCloudVisualization />
            </Suspense>

            <div className="absolute top-4 left-4 bg-black/50 text-white px-4 py-2 rounded-lg z-50">
              <p className="text-sm font-medium">
                {indexes.length} point{indexes.length !== 1 ? 's' : ''} selected
              </p>
            </div>
        
            <ScrollArea h={600} viewportRef={setParentElement}>
            <div
              style={{
                height: `${virtualizer.getTotalSize()}px`,
                width: '100%',
                position: 'relative',
              }}>
              
              {virtualizer.getVirtualItems().map((virtualRow) => {
                  const firstItemIndex = virtualRow.index * ITEMS_PER_ROW;
                  const rowItems = featureData.slice(
                    firstItemIndex,
                    firstItemIndex + ITEMS_PER_ROW
                  );

            <ScrollArea h={600} ref={containerRef}>
              <div className="grid grid-cols-4 gap-4">
                <Grid columns={4} className="gap-4" ref={ref}>
                  {featureData && featureData.length > 0 && (
                    featureData.map((data, index) => (
                      <GridCol span={1} key={index}>
                        <Card className="shadow-sm p-4 rounded-md border border-gray-200">
                        <div className="mb-4">
                            {entry?.isIntersecting ? (
                              featureType === 'image_type' ? (
                                <ImageDisplayer data={data} alt="" />
                              ) : featureType === 'text_type' ? (
                                <TextDisplayer data={data} />
                              ) : null
                            ) : (
                              <p>Not Visible Yet</p>
                            )}
                          </div>
                          
                          <Group className="flex justify-between items-center mb-2">
                            <Text className="font-bold text-lg">INFO</Text>
                            <Badge className="bg-[#ec777e] text-white px-2 py-1 rounded">
                              INFO
                            </Badge>
                          </Group>
                          
                          <Text className="text-sm text-gray-600">
                            INFO
                          </Text>
                        </Card>
                      </GridCol>
                    ))
                  )}
                </Grid>
              
              </div>
              
              {isLoading && (
                <div className="w-full text-center py-4">
                  <Text>Loading more items...</Text>
                </div>
              )}
            </ScrollArea>
          </Flex>
        </>
      ) : (
        <p>Select Feature</p>
      )}
    </div>
  );
}

export default function HomePage(){
  return (
  <Suspense>  
    <Home/>
  </Suspense>
)
}