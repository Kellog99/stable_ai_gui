import { useState } from 'react';
import { Settings, X } from 'lucide-react';
import './Parameters.css';
import { ParametersWindowProps } from '@/interfaces/NNInterfaces';

const ParametersWindow: React.FC<ParametersWindowProps> = ({
    isOpen,
    onClose,
    parameters,
}) => {

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-window">
                {/* Header */}
                <div className="modal-header">
                    <h2 className="modal-title">
                        <Settings size={24} />
                        Settings
                    </h2>
                    <button
                        onClick={onClose}
                        className="close-button">
                        <X size={24} />
                    </button>
                </div>

                {/* Settings Content */}
                <div className="modal-content">
                    {
                        parameters.map((param) => (
                            <div className="form-group">
                                <p>{param.label}</p>
                                <label className="form-label">{param.description}</label>
                                <input
                                    type="range"
                                    min={param.min}
                                    max={param.max}
                                    value={param.default ? param.default : 2}
                                    className="form-slider"
                                />
                            </div>
                        ))
                    }
                </div>



                {/* Footer */}
                <div className="modal-footer">
                    <button
                        // onClick={handleReset}
                        className="reset-button"
                    >
                        Reset to Default
                    </button>
                    <div className="button-group">
                        <button
                            onClick={onClose}
                            className="cancel-button"
                        >
                            Cancel
                        </button>
                        <button
                            // onClick={handleSave}
                            className="save-button">
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ParametersWindow