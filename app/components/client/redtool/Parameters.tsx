import { Settings, X } from 'lucide-react';
import './Parameters.css';
import { ParametersProps } from '@/interfaces/NNInterfaces';
import { useState, useEffect } from 'react';

interface ParametersWindowProps {
    id: string;  // Add the ID of the option being configured
    isOpen: boolean;
    onClose: () => void;
    parameters: ParametersProps[];
}

const ParametersWindow: React.FC<ParametersWindowProps> = ({
    id,
    isOpen,
    onClose,
    parameters,
}) => {
    // Initialize state with parameter defaults
    const [values, setValues] = useState<number[]>([]);

    // Update values when parameters change or modal opens
    useEffect(() => {
        if (isOpen) {
            setValues(parameters.map(p => p.default));
        }
    }, [isOpen, parameters]);

    if (!isOpen) return null;

    const handleChange = (index: number, newValue: number) => {
        const newValues = [...values];
        newValues[index] = newValue;
        setValues(newValues);
    };

    const handleReset = () => {
        setValues(parameters.map(p => p.default));
    };

    const handleSave = () => {
        // Create updated parameters with new values
        const updatedParams = parameters.map((param, index) => ({
            ...param,
            default: values[index]
        }));
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-window" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="modal-header">
                    <h2 className="modal-title">
                        <Settings size={24} />
                        Settings
                    </h2>
                    <button onClick={onClose} className="close-button">
                        <X size={24} />
                    </button>
                </div>

                {/* Settings Content */}
                <div className="modal-content">
                    {parameters.map((param, index) => (
                        <div key={`${param.label}-${index}`} className="form-group">
                            <label className="form-label">
                                {param.label}
                                <span style={{
                                    float: 'right',
                                    fontWeight: 'bold',
                                    color: '#3b82f6'
                                }}>
                                    {values[index]?.toFixed(2) ?? param.default}
                                </span>
                            </label>
                            {param.description && (
                                <p style={{
                                    fontSize: '0.8rem',
                                    color: '#6b7280',
                                    marginTop: '0.25rem',
                                    marginBottom: '0.75rem'
                                }}>
                                    {param.description}
                                </p>
                            )}
                            <input
                                type="range"
                                min={param.min}
                                max={param.max}
                                step={(param.max - param.min) / 100}
                                value={values[index] ?? param.default}
                                onChange={(e) => handleChange(index, parseFloat(e.target.value))}
                                className="form-slider"
                            />
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="modal-footer">
                    <button onClick={handleReset} className="reset-button">
                        Reset to Default
                    </button>
                    <div className="button-group">
                        <button onClick={onClose} className="cancel-button">
                            Cancel
                        </button>
                        <button onClick={handleSave} className="save-button">
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParametersWindow;