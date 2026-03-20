import { CheckCheck, CheckCircleIcon, CheckIcon, Save, Settings, TimerReset, Trash } from 'lucide-react';
import './Parameters.css';
import { ParametersProps } from '@/interfaces/NNInterfaces';
import { useState, useEffect } from 'react';
import { Group, Modal, NumberInput, Stack } from '@mantine/core';

interface ParametersWindowProps {
    isOpen: boolean;
    parameters?: ParametersProps[];
    onClose: () => void;
    handleParametersChange: (parameters: number[]) => void;
}
// This component handles the Modal windows associated with the specification of the attack's parameters
const ParametersWindow: React.FC<ParametersWindowProps> = ({
    isOpen,
    parameters,
    onClose,
    handleParametersChange

}) => {

    const [values, setValues] = useState<number[]>([]);
    const [defaultParameters, setDefaultParameters] = useState<number[]>([]);

    // Update values when parameters change or modal opens
    useEffect(() => {
        if (isOpen && parameters && parameters.length > 0) {
            const def = parameters.map(p => {
                if (p.default != null) return p.default;
                if (p.max != null && p.min != null) return (p.max + p.min) / 2;
                if (p.min != null) return p.min;
                return 1;
            });
            setValues(def)
            setDefaultParameters(def)

        }
    }, [isOpen, parameters]);


    const handleChange = (index: number, newValue: number) => {
        const newValues = [...values];
        newValues[index] = newValue;
        setValues(newValues);
    };

    const handleReset = () => {
        setValues(defaultParameters);
    };


    // This is for showing that the save button has been clicked
    const [isSaving, setIsSaving] = useState(false);

    const handleSaveClick = () => {
        setIsSaving(true);
        handleParametersChange(values);

        // Reset after animation
        setTimeout(() => {
            setIsSaving(false);
        }, 600); // Duration should match CSS transition
    };
    return (
        <Modal
            opened={isOpen}
            onClose={onClose}
            size={500}
            title={
                <Group
                    gap="xs"
                    style={{
                        color: "black",
                        fontWeight: 'bold'
                    }}>
                    <Settings size={24} />
                    <span>Settings</span>
                </Group>
            }
            centered
        >
            {!parameters || parameters.length === 0 ? (
                <p style={{ padding: '1.5rem', textAlign: 'center' }}>
                    No parameters have been passed
                </p>
            ) : (
                <>
                    {/* Content Area */}
                    <div className='parameters-container'>

                        {/* Settings Content */}
                        {parameters.map((param, index) => (
                            <div
                                key={`${param.name}-${index}`}
                                className="form-group"
                            >
                                <div className="form-label">
                                    <p>{param.name}</p>

                                    <NumberInput
                                        variant="filled"
                                        size='xs'
                                        w={100}
                                        min={param.min}
                                        max={param.max}
                                        step={param.step}
                                        allowDecimal={!Number.isInteger(parameters[index].step)}
                                        allowNegative={param.min < 0}
                                        radius="md"
                                        value={values[index]}
                                        onChange={(e) => handleChange(index, e as number)}
                                    />
                                </div>
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
                                    step={param.step}
                                    value={values[index] ?? param.default * 10}
                                    onChange={(e) => handleChange(index, parseFloat(e.target.value))}
                                    className="form-slider"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="modal-footer">
                        <button
                            className="footer-button reset"
                            onClick={handleReset}
                        >
                            <TimerReset size={22} /> Reset
                        </button>
                        <div className="button-group">
                            <button
                                onClick={onClose}
                                className="footer-button delete"
                            >
                                <Trash size={22} /> Cancel
                            </button>
                            <button
                                onClick={handleSaveClick}
                                className={`footer-button save ${isSaving ? 'saving' : ''}`}
                            >
                                {isSaving ? <CheckCircleIcon size={22} /> : <Save size={22} />} Save
                            </button>
                        </div>
                    </div>
                </>
            )}
        </Modal>
    );
};

export default ParametersWindow;
