import { CheckCircleIcon, RefreshCw, Save, Settings, TimerReset, Trash, X } from 'lucide-react';
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
    const [defaultValues, setDefaultValues] = useState<(number | string)[]>([]);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        if (isOpen && parameters && parameters.length > 0) {
            const currentValues = parameters.map((p) => {
                if (p.default !== undefined && p.default !== null) return p.default;
                if (p.kind === 'enum') return p.options?.[0] ?? '';
                if (p.max != null && p.min != null) return (p.max + p.min) / 2;
                if (p.min != null) return p.min;
                return 0;
            });
            const defaults = parameters.map((p) => {
                if (typeof p.default === 'number' || typeof p.default === 'string') return p.default;
                if (p.kind === 'enum') return p.options?.[0] ?? '';
                if (p.max != null && p.min != null) return (p.max + p.min) / 2;
                if (p.min != null) return p.min;
                return 0;
            });
            setValues(currentValues);
            setDefaultValues(defaults);
            setIsSaved(false);
        }
    }, [isOpen, parameters]);


    const handleChange = (index: number, newValue: number | string) => {
        setValues((prev) => {
            const next = [...prev];
            next[index] = newValue;
            return next;
        });
    };

    const handleReset = () => setValues(defaultValues);

    const handleSave = () => {
        handleParametersChange(values);
        setIsSaved(true);
        setTimeout(() => {
            setIsSaved(false);
            onClose();
        }, 600);
    };


    const toNumber = (v: number | string): number =>
        typeof v === 'number' ? v : Number(v) || 0;


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
                        <button className="btn btn-ghost" onClick={handleReset}>
                            <RefreshCw size={15} /> Reset
                        </button>
                        <div className="btn-group">
                            <button className="btn btn-outline" onClick={onClose}>
                                <X size={15} /> Cancel
                            </button>
                            <button
                                className={`btn btn-primary ${isSaved ? 'btn-saved' : ''}`}
                                onClick={handleSave}
                                disabled={isSaved}
                            >
                                {isSaved ? <CheckCircleIcon size={15} /> : <Save size={15} />}
                                {isSaved ? 'Saved' : 'Save'}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </Modal>
    );
};

export default ParametersWindow;
