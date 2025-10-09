import React, { useState } from 'react';
import { AttackProps } from '@/interfaces/NNInterfaces';
import './test.css';

interface AttackSelectorProps {
  attackList: AttackProps[]
  handleSelection: (attack: AttackProps) => void;
}

export const AttackSelector: React.FC<AttackSelectorProps> = ({
  attackList,
  handleSelection
}) => {
  return (
    <div className="mb-6">
      <label style={{color:'grey'}}>
        Choose the vulnerability to test:
      </label>
      <div className="relative">
        <select
          onChange={(e) => {
            const tmp_attack = attackList.find((atk) => atk.id === e.target.value);
            if (tmp_attack) {
              handleSelection(tmp_attack)
            }
          }}
          className='attack-selection'
        >
          {attackList.map((attack) => (
            <option
              value={attack.id}
              key={attack.id}>
              {attack.name.charAt(0).toUpperCase()+attack.name.slice(1)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};