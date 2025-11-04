import React, { useState } from 'react';
import { Check, LucideIcon } from 'lucide-react';
import { ParametersProps } from '@/interfaces/NNInterfaces';
import './AttackCard.css';
import ParametersWindow from './Parameters';

interface OptionCardProps {
  name: string,
  description?: string,
  parameters?: ParametersProps[],
  isSelected: boolean;
  Icon: LucideIcon
  tags?: string[]
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
        <div className="card-header">
          <h3>{name}</h3>
          {
            tags && tags.length > 0 && (
              <div>
                {tags.map((tag, index) => (
                  <div key={`${tag}-${index}`}
                    className='option-tag'>{tag}</div>
                ))}
              </div>)
          }
        </div>

        {
          description ?
            <div className='card-body'>
              {description}
            </div>
            : null
        }
        <div className='card-footer'>
          <Icon
            className='card-icon'
            style={{ pointerEvents: parameters ? "auto" : "none", visibility: 'hidden'}} //TO MAKE CONFIG VISIBILE WHEN THE THEY CAN ACTUALLY BE SET
            size={30}
            onClick={() => setIsExpanded(true)} />
          <label className="circle-checkbox">
            <input
              type="checkbox"
              onChange={onSelect}
              checked={isSelected} />
            <span className="checkmark">
              <Check className="check-icon" size={18} strokeWidth={3} />
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