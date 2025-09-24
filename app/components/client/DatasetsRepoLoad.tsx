import DatasetsLoader from "@/functionalities/DatasetsLoader";
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
        <>
            {
                isLoading ? (
                    <div >
                        <Text>Loading...</Text>
                        <Loader />
                    </div >
                ) : (
                    <DatasetBT query={query} datasets={datasets} />

                )
            } </>)
}