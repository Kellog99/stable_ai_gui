import React from "react";
import { Card, Image, Text, Badge, Button, Group, Grid } from '@mantine/core';
import classes from './DatasetBT.module.css';

interface Dataset {
    prototype: any;
    name: string;
    n_classes: number;
    samples_per_class: number;
    n_samples: number;
    task: string;
    features: string[];
  }
  
  interface DatasetBTProps {
    data: Dataset[];
  }

function DatasetBT(props : DatasetBTProps) {

    function clicked(name : string){
        console.log( `clicked on ${name}! `)
    }
    return (
        <div className={classes.dataset_buttons}>
            <Grid
            columns={4}
            >
            {props.data.map((dataset, index) => (
                <Grid.Col span={1} key={index}>
                    <Card className={classes.card} shadow="sm" padding="lg" radius="md" withBorder>
                    <Card.Section>
                        <Image
                            src={dataset.prototype}
                            height={300}
                            alt={dataset.name}
                            onClick={() => clicked(dataset.name)}
                        />
                    </Card.Section>
                
                    <Group justify="space-between" mt="md" mb="xs">
                        <Text fw={700} size="lg">{dataset.name}</Text>
                        <Badge color="#ec777e">{dataset.task}</Badge>
                    </Group>
                    <Text size="sm" c="dimmed">
                        {dataset.n_samples} samples
                    </Text>
                    </Card>
            </Grid.Col>
            ))}
            </Grid>
        </div>
    );
}

export default React.memo(DatasetBT);