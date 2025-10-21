import React, { useState } from 'react';
import { LucideIcon } from 'lucide-react';
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
    <><div className="attack-card">
      <input
        className='checkbox'
        type="checkbox"
        onChange={onSelect}
        checked={isSelected} />
      <div className='card-body'>
        <span className='title'>{name}</span>
        {
          tags && tags.length > 0 && (
            tags.map((tag, index) => (
              <div key={`${tag}-${index}`}
                className='option-tag'>{tag}</div>
            )))
        }
        {
          description ?
            <div className='description'>
              {description}
            </div>
            : null
        }
      </div>

      <Icon
        onClick={() => setIsExpanded(true)}
        className='icon' />
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