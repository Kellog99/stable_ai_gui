import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { AttackProps } from '../../types';
import './AttackCard.css';

interface AttackCardProps {
  attack: AttackProps;
  isSelected: boolean;
  onSelect: (attackId: string) => void;
}

const AttackCard: React.FC<AttackCardProps> = ({
  attack,
  isSelected,
  onSelect }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCardClick = () => {
    onSelect(attack.id);
  };

  return (
    <div>
      <div className="attack-card">
        <input
        className='checkbox'
          type="checkbox"
          onClick={handleCardClick}
          checked={isSelected} />
        <div className='card-body'>
          <div className="card-header" >
            <span className='title'>{attack.name}</span>
            <div
            className='open'
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {
                isExpanded ?
                  <ChevronUp className='icon' /> :
                  <ChevronDown className='icon'
                  />
              }
            </div>
          </div>
          <div className='description'>
            {attack.description}
          </div>
        </div>
      </div>
      {isExpanded ? <div className={`card-content ${isExpanded ? 'expanded' : ''}`}>
        <div className="parameters-section">
          <h4>Parameters ({attack.parameters.length})</h4>
          <div className="parameters-list">
            {attack.parameters.map((param, index) => (
              <div key={index} className="parameter-item">
                <div className="parameter-header">
                  <span className="parameter-name">{param.label}</span>
                  <span className="parameter-range">
                    {param.min} - {param.max} (step: {param.step})
                  </span>
                </div>
                <div className="parameter-details">
                  <span className="parameter-default">
                    Default: {param.default}
                  </span>
                </div>
                <p className="parameter-description">
                  {param.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div> : null}
    </div>
  );
};

export default AttackCard;