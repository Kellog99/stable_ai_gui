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
  const [selectedAttack, setSelectedAttack] = useState<AttackProps>()
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-300 mb-3">
        Attack Algorithm

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
              {attack.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};