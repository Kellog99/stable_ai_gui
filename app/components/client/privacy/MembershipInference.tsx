import { useState, useRef } from 'react';
import { Shield, Play, Upload, X, AlertCircle, Settings } from 'lucide-react';
import "./MembershipInference.css";
import { RegisterObjectProps } from '@/interfaces/NNInterfaces';
import AttackCard from './AtkCard';

export interface LoadedModel {
    type: 'llm' | 'vision';
    name?: string;
    architecture?: string;
}

interface MembershipInferenceProps {
    type: "llm" | "cv";
    listAttacks: RegisterObjectProps[];
    results?: { [key: string]: number };
}

const MembershipInference: React.FC<MembershipInferenceProps> = ({
    type,
    listAttacks,
    results
}) => {
    console.log(results)

    const [selectedAtk, setSelectedAtk] = useState(listAttacks[0].id);
    const [params, setParams] = useState<Record<string, unknown>>({});
    const [textInput, setTextInput] = useState('');
    const [imageFile, setImageFile] = useState<string | null>(null);
    const [running, setRunning] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);



    const hasInput = true;

    return (
        <div className="membership-inference">
            <div className="info-banner">
                <div className='info-header'>
                    <Shield size={25} />
                    Membership Inference Attack
                </div>
                <p className="info-description">
                    Determine whether a specific data point was used during model training. These attacks exploit overfitting behaviors and confidence gaps exposed through model queries.
                </p>
            </div>

            <div className='components-container'>

                {/* Attack selection */}
                <div className='attack-container'>
                    <h3 className='component-title'>Attack</h3>
                    <div className="variant-grid">
                        {listAttacks.map(v => (
                            <AttackCard
                                id={v.id}
                                title={v.name}
                                isActive={selectedAtk === v.id}
                                parameters={v.parameters}
                                description={v.description}
                                handleClick={() => setSelectedAtk(v.id)}
                                handleParametersChange={function (parameters: number[]): void {
                                    throw new Error('Function not implemented.');
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Input */}
                <div className='input-container'>
                    <h3 className="component-title">
                        Target Input &mdash; {type === 'llm' ? 'Text Sample' : 'Image Sample'}
                    </h3>
                    <div className="input-section">
                        {type === 'llm' ? (
                            <textarea
                                value={textInput}
                                onChange={e => setTextInput(e.target.value)}
                                placeholder="Paste the text sample to test for membership..."
                                rows={7}
                                className="text-input"
                            />
                        ) : (
                            <div
                                className="image-upload"
                                onClick={() => fileRef.current?.click()}
                            >
                                {imageFile ? (
                                    <>
                                        <img src={imageFile} alt="Target" className="uploaded-image" />
                                        <button
                                            className="remove-image"
                                            onClick={e => { e.stopPropagation(); setImageFile(null); }}
                                        >
                                            <X className="remove-icon" />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Upload className="upload-icon" />
                                        <p className="upload-text">Click to upload image</p>
                                        <p className="upload-formats">PNG, JPG, WebP</p>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>

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
}

interface MetricCardProps {
    name: string,
    value: number
}
const MetricCard: React.FC<MetricCardProps> = ({
    name, value
}) => {
    return (
        <div
            key={name}
            className="metric-card"
        >
            <div className="metric-label">{name}:</div>
            {value.toFixed(3)}
        </div>
    )
}

export default MembershipInference;