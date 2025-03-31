"use client";
import RouterButton from "@/components/client/buttons/RouterButton";
import { Box, Button, Text } from "@mantine/core";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react"
import classes from './datasets.module.css'
import useStore from '@/store/dsStore';
import SchemaFlow from "@/components/client/SchemaShower";
import Schema from "@/components/client/SchemaShower2";
import CircleSchema from "@/components/client/SchemaShower3";

export default function Datasets(){

    const searchParams = useSearchParams();
    const [ datasetName, setDatasetName ] = useState<string | null>( "" )
    const datasets = useStore((state) => (state.datasets))
    const setDatasets: (datasets: null) => void = useStore((state) => state.setDatasets);
    
    const datasetUsed = useStore((state) => state. datasetUsed)
    const setData = useStore((state) => (state.setData));
    
    console.log("DATASETS:",datasets)
    
    useEffect(() => {
      if (searchParams.get("name")) {
        setDatasetName(searchParams.get("name"));
        
        const filteredDataset = datasets?.find(dataset => 
          dataset.name === searchParams.get("name")
        );
        
        if (filteredDataset) {
          setData(filteredDataset);
        }
      }
    }, [searchParams, datasets, setData]);
    
    console.log("datasetUsed:", datasetUsed)

    return (
    <div>
      <Box
      className={classes.title}>
          <h1> { datasetName } dataset</h1>
          {datasetName? 
          <RouterButton name={datasetName} route={"/pages/dataquality/embeddings"}>
              <Button>Embeddings</Button>
          </RouterButton> : null}
          <CircleSchema/>
      </Box>
      <h2>
        Description
      </h2>
      <Box style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      <Text fw={600}>{datasetUsed?.name || ""}</Text> is a dataset for {datasetUsed?.task || ""}.
      It has {datasetUsed?.n_classes || ""} classes.
      </Box>
    </div>
    )
}