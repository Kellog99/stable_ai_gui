import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Settings } from 'lucide-react';
import { AttackProps } from '@/interfaces/NNInterfaces';
import './AttackCard.css';
import ParametersWindow from './Parameters';

interface AttackCardProps {
  attack: AttackProps;
  isSelected: boolean;
  onSelect: (attackId: string) => void;
}

const AttackCard: React.FC<AttackCardProps> = ({
  attack,
  isSelected,
  onSelect }) => {
  const [openSettings, setIsExpanded] = useState(false);

  const handleCardClick = () => {
    onSelect(attack.id);
  };

  return (
    <><div className="attack-card">
      <input
        className='checkbox'
        type="checkbox"
        onClick={handleCardClick}
        defaultChecked={isSelected} />
      <div className='card-body'>
        <div className="card-header" >
          <span className='title'>{attack.name}</span>
          <div
            className='open'
            onClick={() => setIsExpanded(true)} >
            <Settings className='icon' />
          </div>
        </div>
        <div className='description'>
          {attack.description}
        </div>
      </div>
    </div>
      <ParametersWindow
        isOpen={openSettings}
        parameters={attack.parameters}
        onClose={() => setIsExpanded(false)}
      />
    </>
  );
};

export default AttackCard;