import featureLoader from '@/functionalities/FeatureLoader';
import { IsFeatureBond } from '@/functionalities/Utils';
import Dataset, { FeatureDTO } from '@/interfaces/genericInterface';
import { CompletenessDTO } from '@/interfaces/metricsInterface';
import { image_type, label_type, text_type } from '@/properties/types';
import useStore from '@/store/dsStore';
import { BarChart } from '@mantine/charts';
import '@mantine/charts/styles.css';
import { Flex, Text } from '@mantine/core';
import { useEffect, useState } from 'react';
import FeatureDisplayer from '../../FeatureDisplayer';

export default function CompletenessDisplayer(props: { completeness: CompletenessDTO, requirements: string[] }) {
  const { featureName, score, combinedScore, giniScore, score_per_requirement, indexes_per_requirement } = props.completeness;
  const scoreRound = (score * 100).toFixed(1)

  const datasetUsed = useStore((state) => state.datasetUsed)
  const [feature, setFeature] = useState<FeatureDTO | null>(null)
  const [featureType, setFeatureType] = useState<string | null>(null)
  const [labelFeature, setLabelFeature] = useState<FeatureDTO | null>(null)
  const [labelDict, setLabelDict] = useState<{ [key: number]: string } | null>(null)

  const [indexesRetrieved, setIndexesRetrieved] = useState<number[] | null>(null)
  const [samplesRetrieved, setSamplesRetrived] = useState<string[] | null>(null)
  const [labelsRetrived, setLabelsRetrived] = useState<number[] | null>(null)

  const data = props.requirements.map((req, index) => ({
    requirement: req,
    score: score_per_requirement[index] ?? 0, // default to 0 if missing
  }));



  const RetrieveSamples = (bar: any) => {
    const index = data.findIndex((d) => d.requirement === bar.requirement);
    setIndexesRetrieved(indexes_per_requirement[index])
  }



  useEffect(() => {
    const loadFeature = async () => {
      try {
        if (datasetUsed) {
          const featureLoaded = await featureLoader(datasetUsed.name, featureName);
          console.log("FEATURE LOADED:", featureLoaded);
          if (featureLoaded.type === image_type || featureLoaded.type === text_type) {
            setFeature(featureLoaded);
            setFeatureType(featureLoaded.type)
          }

          const labelFeatureName = IsFeatureBond(datasetUsed as Dataset, featureName, label_type)
          if (labelFeatureName) {
            const labelLoaded = await featureLoader(datasetUsed.name, labelFeatureName as string);
            setLabelFeature(labelLoaded)
            if (labelLoaded.label_dict) {
              setLabelDict(labelLoaded.label_dict)
            }
          }
        }
      } catch (error) {
        console.error('Error loading feature:', error);
      }
    };
    loadFeature();
  }, []);


  useEffect(() => {
    // Only proceed if indexes is not null
    if (indexesRetrieved != null && feature != null) {
      const filterFeature = async () => {
        try {
          let filteredArr: any[] = [];
          let filteredLabel: any[] = [];

          indexesRetrieved.forEach(index => {
            filteredArr.push(feature.datas[index]);
            if (labelFeature != null) {
              filteredLabel.push(labelFeature.datas[index])
            }
          });

          setSamplesRetrived(filteredArr)
          if (labelFeature != null) {
            setLabelsRetrived(filteredLabel)
          }

        } catch (error) {
          console.error('Error loading feature:', error);
        }
      };

      filterFeature();
    }
  }, [indexesRetrieved]);

  console.log("FILTERED", samplesRetrieved)

  return (
    <>
      <Flex
        direction="column"
        align="center"
      >
        {/*
                <h3>Score on the { featureName } feature</h3>

                <RingProgress
                    size={ 180 }
                    roundCaps
                    sections={ [ { value: score * 100, color: getScoreColor( score ) } ] }
                    transitionDuration={ 1000 }
                    label={ <Text ta="center" fw={ 700 } size="lg">{ scoreRound }%</Text> }
                />*/}

        <BarChart
          h={300}
          data={data}
          orientation="vertical"
          dataKey="requirement"
          //getBarColor={ ( value ) => ( value > 0.1 ? 'teal.8' : 'red.8' ) }
          series={[{ name: 'score', color: 'red.8' }]}
          barProps={{
            onClick: RetrieveSamples
          }}
          style={{ marginTop: "50px" }}
        />
        {samplesRetrieved && (<>

          <Text fw={600} style={{ margin: "20px" }} >Samples that best adhere to the requirement selected</Text>
          <FeatureDisplayer
            indexes={indexesRetrieved as number[]}
            featureData={samplesRetrieved as string[]}
            featureType={featureType as string}
            labelData={labelsRetrived as number[]}
            label_dict={labelDict as { [key: number]: string }}
            columns={3} />
        </>
        )}
      </Flex>
    </>
  )
}