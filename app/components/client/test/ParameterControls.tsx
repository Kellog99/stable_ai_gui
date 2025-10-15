import React, { useState } from 'react';
import { ParametersProps } from '@/interfaces/NNInterfaces';
import './test.css';

export function ParameterControls({ parameters }: { parameters: ParametersProps[] | undefined }) {
  console.log(typeof parameters)
  if (!parameters) {
    return <></>
  }
  const [values, setValues] = useState<number[]>(parameters.map((parameter) => parameter.default))
  const handleChange = (index: number, newValue: number) => {
    const newValues = [...values];
    newValues[index] = newValue;
    setValues(newValues);
  }
  return (
    <div>
      <p style={{ color: 'gray' }}>
        Here it is possible to set manually some parameters that characterize the attack.
      </p>
      <div className='block-parameters'>
        {parameters.map((parameter, index) => (
          <div
            className='parameter'
            key={parameter.name}>
            <div style={{fontWeight:'900', height:'100%'}}> {parameter.name.charAt(0).toUpperCase() + parameter.name.slice(1)}</div>
            <div style={{ fontSize: "1vw" }}>{parameter.description}</div>
            <div className='value'>
              <input
                style={{ width: '100%' }}
                type="range"
                min={parameter.min}
                max={parameter.max}
                step={(parameter.max - parameter.min) / 100}
                value={values[index] ? values[index].toFixed(3) : parameter.default}
                onChange={(e) => handleChange(index, parseFloat(e.target.value))} />
              <div>{values[index] ? values[index].toFixed(2) : parameter.default}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};