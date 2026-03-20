"use client"
import DatasetsLoader from "@/functionalities/DQServices/DatasetsLoader";
import useStore from "@/store/dsStore";
import { Loader, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import DatasetBT from "../server/DatasetBT";


export const DatasetRepository: React.FC = () => {
    const datasets = useStore((state) => (state.datasets));
    const setDatasets = useStore((state) => state.setDatasets)
    const [isLoading, setIsLoading] = useState<boolean>(false)


    useEffect(() => {
        setIsLoading(true)
        DatasetsLoader().then(fetchedData => {
            setDatasets(fetchedData);
        }).finally(() => {
            setIsLoading(false)
        });
    }, []);

    const query = useStore((state) => (state.queryDataset));

    return (
        <div style={{ position: 'relative', width: '100%', height: "340px", overflowY: "auto", overflowX: 'hidden', }}>
            {isLoading && (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 10
                }}>
                    <Text>Loading...</Text>
                    <Loader />
                </div>
            )}
            <div style={{ opacity: isLoading ? 0 : 1 }}>
                <DatasetBT query={query} datasets={datasets} />
            </div>
        </div>
    )
}