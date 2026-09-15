import { CheckCircle2, CheckCircleIcon, RefreshCw, Save, Settings, Settings2, X } from 'lucide-react';
import './Parameters.css';
import { ParametersProps } from '@/interfaces/NNInterfaces';
import { useState, useEffect } from 'react';
import { Modal, NumberInput, Select, Slider, Switch } from '@mantine/core';

type ParameterValue = number | string | boolean;

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

    const [values, setValues] = useState<ParameterValue[]>([]);
    const [defaultValues, setDefaultValues] = useState<ParameterValue[]>([]);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        if (isOpen && parameters && parameters.length > 0) {
            const currentValues = parameters.map((p) => {
                if (p.default !== undefined && p.default !== null) return p.default;
                if (p.kind === 'boolean' || typeof p.default === 'boolean') return false;
                if (p.kind === 'enum') return p.options?.[0] ?? '';
                if (p.max != null && p.min != null) return (p.max + p.min) / 2;
                if (p.min != null) return p.min;
                return 0;
            });
            const defaults = parameters.map((p) => {
                if (p.default !== undefined && p.default !== null) return p.default;
                if (p.kind === 'boolean' || typeof p.default === 'boolean') return false;
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


    const handleChange = (index: number, newValue: ParameterValue) => {
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

    if (isOpen && parameters) {
        console.log(parameters.map((param, index) => ([param.id, param.step, param.max])))
    }

    return (
        <Modal
            opened={isOpen}
            onClose={onClose}
            size={500}
            title={
                <div className="parameters-header-content">
                    <div className="parameters-icon">
                        <Settings2 size={22} />
                    </div>

                    <div className='modal-title'>
                        <p className="parameters-title">
                            Parameters
                        </p>

                        <p className="parameters-subtitle">
                            Configure the settings for this operation
                        </p>
                    </div>
                </div>
            }
            classNames={{
                content: 'parameters-modal',
            }}
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
                            // Boolean parameters use a switch instead of numeric controls.
                            <div
                                key={`${param.name}-${index}`}
                                className="form-group"
                            >
                                <div className="param-header">
                                    <div className="param-title">
                                        <p className="param-name">
                                            {param.name}
                                        </p>

                                        {param.description && (
                                            <p className="param-desc">
                                                {param.description}
                                            </p>
                                        )}
                                    </div>

                                    {(param.kind === 'boolean' || typeof param.default === 'boolean') ? (
                                        <Switch
                                            size="md"
                                            checked={values[index] === true}
                                            onChange={(event) => handleChange(index, event.currentTarget.checked)}
                                        />
                                    ) : param.kind !== 'enum' && (
                                        <NumberInput
                                            variant="filled"
                                            size="xs"
                                            w={100}
                                            min={param.min}
                                            max={param.max}
                                            step={param.step}
                                            allowDecimal={
                                                !Number.isInteger(
                                                    param.step ?? 1
                                                )
                                            }
                                            allowNegative={
                                                (param.min ?? 0) < 0
                                            }
                                            radius="md"
                                            value={typeof values[index] === "number" ? values[index] : Number(values[index]) || 0}
                                            onChange={(value) => handleChange(index, Number(value) || 0)}
                                        />
                                    )}
                                </div>

                                {(param.kind === "boolean" || typeof param.default === 'boolean') ? null : param.kind === "enum" ? (
                                    <Select
                                        size="xs"
                                        variant="filled"
                                        radius="md"
                                        data={(param.options ?? []).map((option) => ({ value: option, label: option }))}
                                        value={typeof values[index] === "string" ? values[index] as string : null}
                                        onChange={(value) => value && handleChange(index, value)}
                                    />
                                ) : (

                                    <Slider
                                        min={param.min ?? 0}
                                        max={param.max ?? 1}
                                        step={param.step ?? 0.01}
                                        value={typeof values[index] === "number" ? values[index] : Number(values[index]) || 0}
                                        onChange={(value) => handleChange(index, value)}
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="modal-footer">
                        <button
                            className="footer-button reset"
                            onClick={handleReset}
                            type="button"
                        >
                            <RefreshCw size={16} />
                            Reset
                        </button>

                        <div className="button-group">
                            <button
                                className="footer-button cancel"
                                onClick={onClose}
                                type="button"
                            >
                                <X size={16} />
                                Cancel
                            </button>

                            <button
                                className={`footer-button save ${isSaved ? 'saving' : ''
                                    }`}
                                onClick={handleSave}
                                disabled={isSaved}
                                type="button"
                            >
                                {isSaved ? (
                                    <CheckCircle2 size={16} />
                                ) : (
                                    <Save size={16} />
                                )}

                                {isSaved ? 'Saved' : 'Save changes'}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </Modal>
    );
};

export default ParametersWindow;
