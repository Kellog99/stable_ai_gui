import React from "react";
import { Card, Image, Text, Badge, Group, Grid, CardSection, GridCol} from '@mantine/core';
import classes from './DatasetBT.module.css';
import ClickableComponent from "../client/ClickableComponent";


interface FeatureDTO{
    type: string;
    name: string;
    datas?: string[];
    is_logic?: boolean
}

/*

interface Dataset{
    prototype: string,
    name: string,
    n_classes: number,
    samples_per_class: number,
    n_samples: number,
    task: string,
    features: string[]
}
*/


interface Dataset {
    name: string;
    n_samples: number;
    task: string;
    features: {
        type: string;
        name: string;
        datas: string[];
        is_logic: boolean
      };
    prototype: {
        type: string;
        name: string;
        datas: string[];
        is_logic: boolean
      };  
    n_classes: number;
    samples_per_class?: number;
    label_dict?: any;
  }

  
  interface DatasetBTProps {
    data: Dataset[];
  }

function DatasetBT(props : DatasetBTProps) {
    /*
    function clicked(name : string){
        console.log( `clicked on ${name}! `)
    }
    */

    return (
        <div className={classes.dataset_buttons}>
            <Grid
            columns={4}
            >

            {props.data.length > 0 ? (props.data.map((dataset, index) => (
                
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
            <p>Loading data...</p>
        )}
            </Grid>
        </div>
    );
    
}

export default DatasetBT;



/* 
<Image
    src={dataset.prototype.datas}
    height={300}
    alt={dataset.name}
    //onClick={() => clicked(dataset.name)}
/>
*/