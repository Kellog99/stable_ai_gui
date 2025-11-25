"use client"

import { getModels } from "@/functionalities/NNTrustBackendUtils";
import useStore from "@/store/nnTrustStore";
import styles from "@/styles/ModelCard.module.css";
import { useEffect } from "react";
import { ModelCard } from "./ModelCard";

export const ModelRepository: React.FC = () => {
    
    const setModels = useStore((state) => state.setModels)
    const models = useStore((state) => state.models)

    useEffect(() => {
        getModels().then((fetchedModels) => {
            setModels(fetchedModels.models);
        })
    }, [setModels])

    return (
        <>
            <div className={styles.modelsContainer}>
                {models?.map((model, index) => (
                    <ModelCard key={index} {...model} />
                ))}
            </div>

        </>
    );
}
