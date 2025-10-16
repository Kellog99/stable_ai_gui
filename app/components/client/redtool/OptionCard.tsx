import React, { useState } from 'react';
import { LucideIcon } from 'lucide-react';
import { ParametersProps } from '@/interfaces/NNInterfaces';
import './AttackCard.css';
import ParametersWindow from './Parameters';

interface OptionCardProps {
  id: string,
  name: string,
  description?: string,
  parameters?: ParametersProps[],
  isSelected: boolean;
  onSelect: () => void;
  Icon: LucideIcon
  tags?: string[]
}

export function OptionCard({
  id,
  name,
  description,
  parameters,
  isSelected,
  onSelect,
  Icon,
  tags
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
            tags && tags.length > 0 ?
              tags.map(tag => (
                <div className='option-tag'>{tag}</div>
              )) : null
          }
          {description ?
            <div className='description'>
              {description}
            </div>
            : null}
      </div>
      <div
        className='open'
        onClick={() => setIsExpanded(true)} >
        <Icon className='icon' />
      </div>
    </div>
      {
        parameters ? <ParametersWindow
          isOpen={openSettings}
          parameters={parameters}
          onClose={() => setIsExpanded(false)}
        /> : null
      }
    </>
  );
};

export default OptionCard;