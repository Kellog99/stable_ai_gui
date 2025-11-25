import { ModelSpecs } from "@/interfaces/NNInterfaces";
import styles from "@/styles/ModelCard.module.css";
import useStore from "@/store/nnTrustStore";
import { Brain } from "lucide-react";

export function ModelCard(model: ModelSpecs) {
    const setModelName = useStore((state) => state.setModelName)
    const modelName = useStore((state) => state.modelName)

    const handleClick = (clickedModelName: string) => {
        setModelName(clickedModelName);
        if (clickedModelName === modelName) {
            setModelName(null);
        }
    }
    return (
        <div
            className={`${styles.card} ${modelName === model.name ? styles.cardSelected : ""
                }`}
            onClick={() => handleClick(model.name)}
        >
            <div className={styles.iconSection}>
                <Brain className={styles.icon} />
            </div>

            <div className={styles.contentSection}>
                <div className={styles.topSection}>
                    <h3 className={styles.modelName}>{model.name}</h3>
                </div>

                <div className={styles.divider}></div>

                <div className={styles.bottomSection}>
                    <div className={styles.infoColumns}>
                        <div className={styles.infoRow}>
                            <span className={styles.label}>task:</span>
                            <span className={styles.value}>{model.task}</span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.label}>num_classes:</span>
                            <span className={styles.value}>{model.num_classes}</span>
                        </div>
                    </div>

                    <div className={styles.infoColumns}>
                        <div className={styles.infoRow}>
                            <span className={styles.label}>pretrained:</span>
                            <span className={styles.value}>{model.pretrained ? "true" : "false"}</span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.label}>type:</span>
                            <span className={styles.value}>{model.type}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}