import React, { useState } from 'react';
import { LucideIcon } from 'lucide-react';
import { ParametersProps } from '@/interfaces/NNInterfaces';
import './AttackCard.css';
import ParametersWindow from './Parameters';

interface AttackCardProps {
  id: string,
  name: string,
  description?: string,
  parameters?: ParametersProps[],
  isSelected: boolean;
  onSelect: (attackId: string) => void;
  Icon: LucideIcon
}

const OptionCard: React.FC<AttackCardProps> = ({
  id,
  name,
  parameters,
  description,
  isSelected,
  onSelect,
  Icon
}) => {
  const [openSettings, setIsExpanded] = useState(false);
  return (
    <><div className="attack-card">
      <input
        className='checkbox'
        type="checkbox"
        onClick={() => onSelect(id)}
        defaultChecked={isSelected} />
      <div className='card-body'>
        <div className="card-header" >
          <span className='title'>{name}</span>
          <div
            className='open'
            onClick={() => setIsExpanded(true)} >
            <Icon className='icon' />
          </div>
        </div>
        {description ?
          <div className='description'>
            {description}
          </div>
          : null}
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