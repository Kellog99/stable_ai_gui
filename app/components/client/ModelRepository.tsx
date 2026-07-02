"use client"

import { motion } from "framer-motion";
import { getModels } from "@/functionalities/TITANNServices/get_info";
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
        <motion.div
            className={styles.modelsContainer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {models?.map((model, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <ModelCard {...model} />
                </motion.div>
            ))}
        </motion.div>
    );
}
