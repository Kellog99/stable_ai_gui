import { Shield } from "lucide-react";
import { useState } from "react";
import nnTrustStore from "@/store/nnTrustStore";
import VulnerabilitySelection from "../utils/VulnerabilitySelection";
import { MetricCard } from "./MembershipInference";

// Property Inference Attack Page
const PropertyInference = () => {
    const { attacks } = nnTrustStore()
    const propInfAtk = Object.fromEntries(
        Object.entries(attacks).filter(([_, atk]) => atk.task === 'property_inference')
    )
    const [targetProperty, setTargetProperty] = useState('');
    const [results, setResults] = useState<{ [key: string]: number }>();
    const [isRunning, setIsRunning] = useState(false);

    const handleExecuteAttack = async () => {
        setIsRunning(true);

        // Simulate attack execution
        setTimeout(() => {
            setResults({
                confidence: (Math.random() * 0.5 + 0.5).toFixed(3),
                inferredProperty: targetProperty || 'gender_distribution',
                accuracy: (Math.random() * 0.3 + 0.6).toFixed(3),
                dataPoints: Math.floor(Math.random() * 1000 + 500)
            });
            setIsRunning(false);
        }, 2000);
    };

    return (
        <div className="attack-page">
            <div className="Property Inference Attack">
                <div className='info-header'>
                    <Shield size={25} />
                    Property Inference Attack
                </div>
                <p className="info-description">
                    Infer global properties of training data from model behavior
                </p>
            </div>

            <div className="components-container">
                <VulnerabilitySelection
                    attacks={propInfAtk}
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


export default PropertyInference;