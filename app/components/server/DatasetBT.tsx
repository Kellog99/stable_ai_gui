import React from "react";
import { Card, Text, Badge, Group, Grid, CardSection, GridCol} from '@mantine/core';
import classes from './DatasetBT.module.css';
import Dataset from "../../interfaces/DatasetInterface"
import ImageDisplayer from "./ImageDisplayer";
import TextDisplayer from "./TextDisplayer";
import { image_type, text_type } from "../../properties/types";
import RouterButton from "../client/buttons/RouterButton";

/*
    interface Dataset {
        id: string;
        name: string;
    }
*/
  
  interface DatasetBTProps {
    query?: string;
    datasets: Dataset[];
  }
  
  
  export default function DatasetBT({ query, datasets }: DatasetBTProps) {

      const filteredDatasets = query
    ? datasets.filter(dataset => 
        dataset.name.toLowerCase().includes(query.toLowerCase())
      )
    : datasets;
/*
    return (
        <div className="grid gap-4">
          {filteredDatasets.map(dataset => (
            <div key={dataset.id} className="p-4 border rounded">
              <h3 className="font-semibold">{dataset.name}</h3>
            </div>
          ))}
        </div>
      );
    }
*/
    return (
        <div className={classes.dataset_buttons}>
            <Grid
            columns={4}
            >

            {filteredDatasets.length > 0 ? (filteredDatasets.map((dataset, index) => (
                
                <GridCol span={1} key={index}>
                    <Card className={classes.card} shadow="sm" padding="lg" radius="md" withBorder>
                    <CardSection>
                        <RouterButton name={dataset.name} route="/pages/prova">
                          {dataset.prototype.type === image_type ? (
                            <ImageDisplayer data={dataset.prototype.datas[0]} alt={dataset.name} />
                          ) : dataset.prototype.type === text_type ? (
                            <TextDisplayer data={dataset.prototype.datas[0]} />
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
    
}

/*
<Image
    src={dataset.prototype.datas[0]}
    height={300}
    alt={dataset.name}
/>
*/
