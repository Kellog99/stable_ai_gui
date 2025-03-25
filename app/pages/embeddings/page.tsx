"use client";

import { PointCloudVisualization } from '../../components/client/PointCloudVisualization';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { cache, Suspense, useState, useEffect} from 'react'; 
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


export default function Home() {

  const searchParams = useSearchParams();
  const [feature, setFeature] = useState(null)
  const [featureData, setFeatureData] = useState([])
  const [featureType, setFeatureType] = useState("")
  const [featureName, setFeatureName] = useState("")

  const datasetName = searchParams.get("name")
  
  const indexes = useStore((state) => state.selectedIndexes);
  //const featureName = "image"
  //const datasetName = "Animal Dataset"

 
  //const feature = getFeatureResources(indexes,featureName)
  
  useEffect(() => {
    // Only proceed if indexes is not null
    if (featureName != "") {
      const loadFeature = async () => {
        try {
          const feature = await featureLoader(datasetName,featureName);
          console.log(feature);
          setFeature(feature);
          setFeatureType(feature.type)
        } catch (error) {
          console.error('Error loading feature:', error);
        }
      };
      loadFeature();
    }
  }, [featureName]); // Still keep indexes and featureName in the dependency array

  useEffect(() => {
    // Only proceed if indexes is not null
    if (indexes != null) {
      const filterFeature = async () => {
        try {
          let filteredArr = [];
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



  console.log(featureData);
  console.log(featureType)

  
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
          <ScrollArea h={600}>
          <div className="grid grid-cols-4 gap-4">
          <Grid columns={4} className="gap-4">
            {featureData && featureData.length > 0 && (
              featureData.map((data, index) => (
                <GridCol span={1} key={index}>
                  <Card className="shadow-sm p-4 rounded-md border border-gray-200">
                    <div className="mb-4">
                      {featureType === image_type ? (
                        <ImageDisplayer data={data} alt="" />
                      ) : featureType === text_type ? (
                        <TextDisplayer data={data} alt="" />
                      ) : null}
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
          </ScrollArea>
          </Flex>
        </>
      ) : (
        <p>Select Feature</p>
      )}
    </div>
  );
};