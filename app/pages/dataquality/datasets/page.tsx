"use client";
import RouterButton from "@/components/client/buttons/RouterButton";
import { Button } from "@mantine/core";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react"

export default function Datasets(){

    const searchParams = useSearchParams();
    const [ datasetName, setDatasetName ] = useState<string | null>( "" )

    useEffect( () =>
      {
        if ( searchParams.get( "name" ) ) {
          setDatasetName( searchParams.get( "name" ) )
        }
      }, [ searchParams ] )
    return (
        <div>
            <h1>This is the page dedicated to the Datasets</h1>
            <h2>You are using { datasetName } dataset</h2>
            {datasetName? 
            <RouterButton name={datasetName} route={"/pages/dataquality/embeddings"}>
                <Button>Embeddings</Button>
            </RouterButton> : null}
        </div>
    )
}