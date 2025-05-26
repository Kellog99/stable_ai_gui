import React from "react";
import { Image, Card, Text, Badge, Group, Grid, CardSection, GridCol} from '@mantine/core';
import classes from './DatasetBT.module.css';
import Dataset from "../../interfaces/DatasetInterface"
import ImageDisplayer from "./ImageDisplayer";
import TextDisplayer from "./TextDisplayer";
import { image_type, text_type } from "../../properties/types";
import RouterButton from "../client/buttons/RouterButton";
  
  interface DatasetBTProps {
    query?: string;
    datasets: Dataset[] | null;
  }
  
  
  export default function DatasetBT({ query, datasets }: DatasetBTProps) {

    if (!datasets) {
      return null
    } else {
    const filteredDatasets = query
  ? datasets?.filter(dataset => 
      dataset.name.toLowerCase().includes(query.toLowerCase())
    )
  : datasets;
    
    return (
        <div className={classes.dataset_buttons}>
            <Grid
            columns={4}
            gutter="xs"
            >

            {filteredDatasets.length > 0 ? (filteredDatasets.map((dataset, index) => (
                
                <GridCol span={1} key={index}>
                    <Card className={classes.card} shadow="sm" padding="lg" radius="md" withBorder>
                    <CardSection className={classes.cardsection}>
                        <RouterButton name={dataset.name} route="/pages/dataquality/datasets">
                          {dataset.prototype.type === image_type ? (
                            <ImageDisplayer className={classes.ImageDisplayer} data={dataset.prototype.datas[0]} alt={dataset.name} />
                          ) : dataset.prototype.type === text_type ? (
                            <TextDisplayer className={classes.TextDisplayer} data={dataset.prototype.datas[0]} />
                          ) : null}
                        </RouterButton>
                    </CardSection>
                
                    <Group justify="space-between" mt="md" mb="xs">
                        <Text fw={700} size="lg">{dataset.name}</Text>
                        <Badge color="#ec777e">{dataset.task}</Badge>
                    </Group>
                    <Text size="sm" c="dimmed">
                        {dataset.n_samples} samples
                    </Text>
                    </Card>
            </GridCol>
            ))
        ) : (
            <p>No result found</p>
        )}
            </Grid>
        </div>
        
    );
    
}}
