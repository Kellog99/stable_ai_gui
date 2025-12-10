import React, { useEffect, useState } from 'react';
import { ParametersProps } from '@/interfaces/NNInterfaces';
import './test.css';
interface ParameterControlsProps {
  parameters?: ParametersProps[],
  handleChange: (index: number, value: number) => void;
}

export const ParameterControls: React.FC<ParameterControlsProps> = ({
  parameters,
  handleChange,
}) => {
  console.log(typeof parameters)
  if (!parameters) {
    return <>No Parameters to manually set.</>
  }
  const [defaultValues, setDefaultValues] = useState<number[]>([])
  useEffect(() => {
    setDefaultValues(parameters.length > 0 ? parameters.map((parameter) => parameter.default) : [])
  }, [])


  const handleReset = () => {
    defaultValues.map((val, index) => {
      handleChange(index, val)
    })
  }
  return (
    <div>
      <p style={{ color: 'gray' }}>
        Set manually the parameters for a fully customized experience.
      </p>

      <div className='block-parameters'>
        <div className='hyperparameters'>
          <h4>
            Hyper Parameters
          </h4>
          <button
            onClick={handleReset}
            className='reset-button'>
            Reset
          </button>
        </div>
        {parameters.map((parameter, index) => (
          <div
            className='parameter'
            key={parameter.name}>
            <div style={{ fontWeight: '900', height: '100%' }}> {parameter.name.charAt(0).toUpperCase() + parameter.name.slice(1)}</div>
            <div style={{ fontSize: "1vw" }}>{parameter.description}</div>
            <div className='value'>
              <input
                style={{ width: '100%' }}
                type="range"
                min={parameter.min}
                max={parameter.max}
                step={(parameter.max - parameter.min) / 100}
                value={parameters[index].default}
                onChange={(e) => handleChange(index, parseFloat(e.target.value))} />
              <div>{parameters[index].default}</div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

