import React, { useState } from 'react';
import { Check, LucideIcon } from 'lucide-react';
import { ParametersProps } from '@/interfaces/NNInterfaces';
import './AttackCard.css';
import ParametersWindow from './Parameters';
import useNNStore from '@/store/nnTrustStore';

interface OptionCardProps {
  name: string,
  description?: string,
  parameters?: ParametersProps[],
  isSelected: boolean;
  Icon: LucideIcon
  tags: string[]
  onSelect: () => void;
  handleParametersChange: (parameters: number[]) => void;
}

export function OptionCard({
  name,
  description,
  parameters,
  isSelected,
  onSelect,
  handleParametersChange,
  Icon,
  tags,
}: OptionCardProps) {

  const [openSettings, setIsExpanded] = useState(false);

  return (
    <>
      <div className="attack-card">
        <h3 color='black'>{name}</h3>

        <div className='container-options'>
          {tags.map((tag, index) => (
            <div key={`${tag}-${index}`}
              className='option-tag'>{tag}</div>
          ))}
        </div>

        <span style={{ fontSize: "0.7rem" }}>{description}</span>
        <div className='card-footer'>
          <Icon
            className='card-icon'
            style={{ pointerEvents: parameters ? "auto" : "none" }}
            size={"var(--icon-size)"}
            onClick={() => setIsExpanded(true)} />
          <label className="circle-checkbox">
            <input
              type="checkbox"
              onChange={onSelect}
              checked={isSelected}
            />
            <span className="checkmark">
              <Check className="check-icon" size={15} strokeWidth={3} />
            </span>
          </label>
        </div>
      </div>
      {
        parameters ?
          <ParametersWindow
            isOpen={openSettings}
            parameters={parameters}
            onClose={() => setIsExpanded(false)}
            handleParametersChange={handleParametersChange} />
          : null
      }
    </>
  );
};

export default OptionCard;