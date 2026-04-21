import { useState, useRef } from 'react';
import { Shield, Play, Upload, X, AlertCircle } from 'lucide-react';
import "./MembershipInference.css";
import { RegisterObjectProps } from '@/interfaces/NNInterfaces';

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

    const [variantId, setVariantId] = useState(listAttacks[0].id);
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
                            <button
                                key={v.id}
                                onClick={() => {
                                    setVariantId(v.id)
                                }}
                                className={`variant-button ${variantId === v.id ? 'active' : ''}`}
                            >
                                <div className="variant-name">{v.name}</div>
                                <div className="variant-description">{v.description}</div>
                            </button>
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
                    <h3 className="component-title">Results</h3>
                    <div className="metrics-container">
                        {results ?
                            Object.entries(results).map(([metric, value]: [string, number]) => (
                                <div
                                    key={metric}
                                    className="metric-card"
                                >
                                    <div className="metric-label">{metric}</div>
                                    {value.toFixed(3)}
                                </div>
                            )) :
                            "No Results"
                        }
                    </div>
                </div>

            </div>
            <button
                disabled={running || !hasInput}
                className="run-button"
            >
                {running ? (
                    <>
                        <div className="spinner" />
                        Running attack...
                    </>
                ) : (
                    <>
                        <Play className="play-icon" />
                        Run Attack
                    </>
                )}
            </button>


        </div>
    );
}

export default MembershipInference;