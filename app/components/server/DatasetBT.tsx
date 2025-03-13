"use client";
import React from "react";
import { Card, Image, Text, Badge, Group, Grid, CardSection, GridCol} from '@mantine/core';
import classes from './DatasetBT.module.css';
import ClickableComponent from "../client/ClickableComponent";
import {useSearch} from "../context/SearchBarContext";


function DatasetBT() {
  
    const { filteredDatasets } = useSearch();    
    
    return (
        <div className={classes.dataset_buttons}>
            <Grid
            columns={4}
            >

            {filteredDatasets.length > 0 ? (filteredDatasets.map((dataset, index) => (
                
                <GridCol span={1} key={index}>
                    <Card className={classes.card} shadow="sm" padding="lg" radius="md" withBorder>
                    <CardSection>
                        <ClickableComponent name={dataset.name}>
                            <Image
                                src={dataset.prototype.datas}
                                height={300}
                                alt={dataset.name}
                            />
                        </ClickableComponent>
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

export default DatasetBT;