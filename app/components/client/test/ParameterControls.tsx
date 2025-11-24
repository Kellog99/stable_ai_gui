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

        </div>
        {parameters.map((parameter, index) => (
          <div
            className='parameter'
            key={parameter.name}>
            <span className="parameter-name"> {parameter.name.charAt(0).toUpperCase() + parameter.name.slice(1)}</span>
            <span className='parameter-description'>{parameter.description}</span>
            <div className='value'>
              <input
                style={{ width: '100%' }}
                type="range"
                min={parameter.min}
                max={parameter.max}
                step={(parameter.max - parameter.min) / 100}
                value={parameters[index].default}
                onChange={(e) => handleChange(index, parseFloat(e.target.value))} />
              <div className='parameter-value'>{parameters[index].default}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="parameter-container-btn">
        <button
          onClick={handleReset}
          className='button'
          style={{
            background: "var(--bg-light)",
            color: "white"
          }}>
          Reset
        </button>
        <button className='button' style={{
          backgroundColor: "lightgray",
          color: "black"
        }}>
          Save
        </button>

      </div>
    </div>
  );
};

