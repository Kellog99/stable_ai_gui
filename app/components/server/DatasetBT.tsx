import { useThumbnailWS } from '@/functionalities/DQServices/useThumbnailWS';
import useStore from '@/store/dsStore';
import { Badge, Card, CardSection, Grid, GridCol, Group, Text } from '@mantine/core';
import React from 'react';
import Dataset from "../../interfaces/genericInterface";
import { image_type, text_type } from "../../properties/types";
import { AlertCust } from '../client/AlertCustom';
import classes from './DatasetBT.module.css';
import TextDisplayer from "./TextDisplayer";

interface DatasetBTProps {
  query?: string;
  datasets: Dataset[] | null;
}

export default function DatasetBT({ query, datasets }: DatasetBTProps) {
  const datasetName = useStore((state) => state.datasetUsed)?.name;
  const setDatasetUsed = useStore((state) => state.setData);


  const filteredDatasets = datasets && query
    ? datasets.filter(dataset =>
      dataset.name.toLowerCase().includes(query.toLowerCase())
    )
    : datasets || [];

  const imageDatas = filteredDatasets
    .filter(ds => ds.prototype.type === image_type)
    .map(ds => ds.prototype.datas[0]);

  const { thumbnails, connectionStatus, requestThumbnail } = useThumbnailWS(
    image_type,
    imageDatas
  );

  if (!datasets) return null;

  const handleClick = (dataset: Dataset) => {
    setDatasetUsed(datasetName === dataset.name ? null : dataset);
  };

  const DatasetItem = ({ dataset }: { dataset: Dataset }) => {
    const path = dataset.prototype.datas[0];
    React.useEffect(() => {
      requestThumbnail(path);
    }, [path]);

    return (
      <img
        src={thumbnails.get(path)}
        alt={dataset.name}
        className={classes.ImageDisplayer}
        style={{
          width: "100%",
          height: "192px",
          objectFit: "contain",
          backgroundColor: "#f7f7f7",
          display: "block",
        }}
      />
    );
  };

  return (
    <div className={classes.dataset_buttons}>
      <Grid columns={3} gutter="xs">
        {filteredDatasets.length > 0 ? (
          filteredDatasets.map((dataset, index) => (
            <GridCol span={1} key={dataset.name || index}>
              <Card
                className={`${classes.card} ${datasetName === dataset.name ? classes.cardSelected : ""
                  }`}
                onClick={() => handleClick(dataset)}
              >
                <CardSection className={classes.cardsection}>
                  {dataset.prototype.type === image_type ? (
                    <DatasetItem dataset={dataset} />
                  ) : dataset.prototype.type === text_type ? (
                    <TextDisplayer
                      className={classes.TextDisplayer}
                      data={dataset.prototype.datas[0]}
                    />
                  ) : null}
                </CardSection>

                <Group justify="space-between" mt="md" mb="xs">
                  <Text fw={700} size="lg" c="#334155">{dataset.name}</Text>
                  <Badge color="#334155">{dataset.task}</Badge>
                </Group>
                <Text size="sm" c="dimmed">{dataset.n_samples} samples</Text>
              </Card>
            </GridCol>
          ))
        ) : (
          <>
            <AlertCust
              result={'warning'}
              textToDisplay={
                <>
                  No datasets found.
                  <br />
                  Try uploading a new dataset or check the datasets folder.
                </>} />
          </>
        )}
      </Grid>
    </div>
  );
}
