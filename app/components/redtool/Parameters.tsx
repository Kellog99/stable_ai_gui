import { CheckCircleIcon, Save, Settings, TimerReset, Trash } from 'lucide-react';
import './Parameters.css';
import { ParametersProps } from '@/interfaces/NNInterfaces';
import { useState, useEffect } from 'react';
import { Group, Modal, NumberInput, Select, Slider } from '@mantine/core';

/**
 * Processes a user's subscription.
 * @param isOpen - It is a flag that tells whether the windows is open or not.
 * @param parameters - The unique identifier for the selected tier.
 * @param onClose - It is the function that handles the closing of the ModalWindow
 * @param handleParametersChange - It handles the change of the attack's parameters
*/
interface ParametersWindowProps {
    isOpen: boolean;
    parameters?: ParametersProps[];
    onClose: () => void;
    handleParametersChange: (parameters: any[]) => void;
}
// This component handles the attack's parameters Modal windows
// It allows to modify and update the parameters for a specific attack
const ParametersWindow: React.FC<ParametersWindowProps> = ({
    isOpen,
    parameters,
    onClose,
    handleParametersChange

}) => {

    const [values, setValues] = useState<(number | string)[]>([]);
    const [defaultParameters, setDefaultParameters] = useState<(number | string)[]>([]);

    // Update values when parameters change or modal opens
    useEffect(() => {
        if (isOpen && parameters && parameters.length > 0) {
            const def = parameters.map((p) => {
                if (p.kind === "enum") return typeof p.default === "string" ? p.default : p.options?.[0] ?? "";
                if (typeof p.default === "number") return p.default;
                if (p.max != null && p.min != null) return (p.max + p.min) / 2;
                if (p.min != null) return p.min;
                return 0;
            });
            setValues(def)
            setDefaultParameters(def)

        }
    }, [isOpen, parameters]);


    const handleChange = (index: number, newValue: number | string) => {
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
        onClose();
        setTimeout(() => setIsSaving(false), 300);
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
                                {param.kind === "enum" ? (
                                    <Select
                                        size="xs"
                                        variant="filled"
                                        radius="md"
                                        data={(param.options ?? []).map((option) => ({ value: option, label: option }))}
                                        value={typeof values[index] === "string" ? values[index] as string : null}
                                        onChange={(value) => value && handleChange(index, value)}
                                    />
                                ) : (
                                    <>
                                        {param.id === "property_target_ratio" ? (
                                            <Slider
                                                min={param.min ?? 0}
                                                max={param.max ?? 1}
                                                step={0.05}
                                                value={typeof values[index] === "number" ? values[index] : Number(values[index]) || 0}
                                                onChange={(value) => handleChange(index, value)}
                                            />
                                        ) : (
                                            <>
                                                <NumberInput
                                                    variant="filled"
                                                    size='xs'
                                                    w={100}
                                                    min={param.min}
                                                    max={param.max}
                                                    step={param.step}
                                                    allowDecimal={!Number.isInteger(param.step ?? 1)}
                                                    allowNegative={(param.min ?? 0) < 0}
                                                    radius="md"
                                                    value={typeof values[index] === "number" ? values[index] : Number(values[index]) || 0}
                                                    onChange={(value) => handleChange(index, Number(value) || 0)}
                                                />
                                                <Slider
                                                    min={param.min ?? 0}
                                                    max={param.max ?? 1}
                                                    step={param.step ?? 0.01}
                                                    value={typeof values[index] === "number" ? values[index] : Number(values[index]) || 0}
                                                    onChange={(value) => handleChange(index, value)}
                                                />
                                            </>
                                        )}
                                    </>
                                )}
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
