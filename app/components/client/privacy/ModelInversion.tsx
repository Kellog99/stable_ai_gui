import { useState } from "react";
import { MetricCard } from "./MembershipInference";
import VulnerabilitySelection from "../utils/VulnerabilitySelection";
import { Shield } from "lucide-react";
import nnTrustStore from "@/store/nnTrustStore";

// Model Inversion Attack Page
const ModelInversion = () => {
    const { attacks } = nnTrustStore()
    const modelInvAtk = Object.fromEntries(
        Object.entries(attacks).filter(([_, atk]) => atk.task === 'model_inversion')
    )
    const [iterations, setIterations] = useState(1000);
    const [results, setResults] = useState<{ [key: string]: number }>();
    const [isRunning, setIsRunning] = useState(false);

    const handleExecuteAttack = async () => {
        setIsRunning(true);

        // Simulate attack execution
        setTimeout(() => {
            setResults({
                reconstructedSamples: 5,
                loss: (Math.random() * 0.5 + 0.1).toFixed(4),
                iterations: iterations,
                convergence: (Math.random() * 0.2 + 0.75).toFixed(3)
            });
            setIsRunning(false);
        }, 2500);
    };

    return (
        <div className="attack-page">


            <div className="Property Inference Attack">
                <div className='info-header'>
                    <Shield size={25} />
                    Model Inversion Attack
                </div>
                <p className="info-description">
                    Infer global properties of training data from model behavior
                </p>
            </div>

            <div className="components-container">
                <VulnerabilitySelection
                    attacks={modelInvAtk}
                    isReady={false}
                    attackResults={{
                        prediction: undefined,
                        confidence: undefined,
                        metrics: undefined
                    }}
                    handleSelection={function (e: React.ChangeEvent<HTMLSelectElement>): void {
                        throw new Error("Function not implemented.");
                    }}
                    handlePostRequest={function (): void {
                        throw new Error("Function not implemented.");
                    }}
                    handleChange={function (value: number[]): void {
                        throw new Error("Function not implemented.");
                    }} />



                {/* output */}
                <div className="metrics-display">
                    <h3 className="component-title">Attack Results</h3>
                    <div className="variant-grid">
                        {results ?
                            Object.entries(results).map(([metric, value]: [string, number]) => (
                                <MetricCard
                                    name={metric}
                                    value={value}
                                />
                            )) :
                            "No Results"
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModelInversion;