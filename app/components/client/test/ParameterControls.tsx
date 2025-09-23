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
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-300 mb-3">Attack Parameters</h3>
      <div className='block-parameters'>
        {parameters.map((parameter, index) => (
          <div
            className='parameter'
            key={parameter.name}>
            <h3> {parameter.name}</h3>
            <p style={{ fontSize: "1vw" }}>{parameter.description}</p>
            <div className='value'>
              <input
                style={{ width: '100%' }}
                type="range"
                min={parameter.min}
                max={parameter.max}
                step={(parameter.max - parameter.min) / 100}
                value={values[index] ? values[index].toFixed(2) : parameter.default}
                onChange={(e) => handleChange(index, parseFloat(e.target.value))} />
              <div>{values[index].toFixed(2)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};