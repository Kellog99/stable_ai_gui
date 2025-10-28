import styles from "@/styles/JsonRepository.module.css"
import { Flex } from "@mantine/core";
import { Brain, Cpu, Database } from "lucide-react"

export const JsonRepository: React.FC = () => {
    const models = [{
        name: "ResNet-50",
        image: "https://upload.wikimedia.org/wikipedia/commons/2/2d/ResNet.png",
        results: {
            accuracy: "76.15%",
            parameters: "25.6M",
            flops: "4.1 GFLOPs",
        },
        task: "Image Classification",
        domain: "Computer Vision",
        description:
            "ResNet-50 is a deep convolutional neural network with 50 layers. It introduced residual connections that help mitigate vanishing gradient problems, enabling the training of very deep architectures.",
    }, {
        name: "BERT-base",
        image: "https://miro.medium.com/v2/resize:fit:1400/1*lMSmPZPp8BkQwQ9blvS-GQ.png",
        results: {
            accuracy: "84.7% (GLUE)",
            parameters: "110M",
            flops: "22 GFLOPs",
        },
        task: "Language Understanding",
        domain: "NLP",
        description:
            "BERT-base is a bidirectional Transformer encoder pretrained on large text corpora. It’s widely used for natural language understanding tasks.",
    }];

    return (
        <>
        <Flex direction="row">
            <div>
                {models.map(model => (
                    <div className={styles.card}>

                        <div className={styles.left}>
                            <div className={styles.networkName}>
                                <h3>{model.name}</h3>
                            </div>

                            <div className={styles.networkImage}>
                                <img
                                    src={model.image}
                                    alt={`${model.name} architecture`}
                                />
                            </div>
                        </div>


                        <div className={styles.right}>

                            <div className={styles.panel}>
                                <div className={styles.panelHeader}>
                                    <Cpu />
                                    <h4>Results</h4>
                                </div>
                                <div className={styles.panelBody}>
                                    {model.results.accuracy && (
                                        <div>
                                            <span className="font-medium">Acc:</span> {model.results.accuracy}
                                        </div>
                                    )}
                                    {model.results.parameters && (
                                        <div>
                                            <span className="font-medium">Params:</span> {model.results.parameters}
                                        </div>
                                    )}
                                    {model.results.flops && (
                                        <div>
                                            <span className="font-medium">FLOPs:</span> {model.results.flops}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className={styles.panel}>
                                <div className={styles.panelHeader}>
                                    <Database />
                                    <h4>Domain</h4>
                                </div>
                                <div className={styles.panelBody}>
                                    <div>
                                        <span className="font-medium">Task:</span> {model.task}
                                    </div>
                                    <div>
                                        <span className="font-medium">Field:</span> {model.domain}
                                    </div>
                                </div>
                            </div>

                            <div className={`${styles.panel} ${styles.infoPanel}`}>
                                <div className={styles.panelHeader}>
                                    <Brain />
                                    <h4>Info</h4>
                                </div>
                                <p>{model.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
                </div>
                </Flex>
        </>
    )
}