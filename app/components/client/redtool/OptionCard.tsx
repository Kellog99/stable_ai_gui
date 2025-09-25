import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { ParametersProps } from '@/interfaces/NNInterfaces';
import './AttackCard.css';
import ParametersWindow from './Parameters';

interface AttackCardProps {
  id: string,
  name: string,
  description: string,
  parameters?: ParametersProps[],
  isSelected: boolean;
  onSelect: (attackId: string) => void;
}

const OptionCard: React.FC<AttackCardProps> = ({
  id,
  name,
  parameters,
  description,
  isSelected,
  onSelect,
}) => {
  const [openSettings, setIsExpanded] = useState(false);
  if (typeof parameters === "undefined") {
    return
  }
  return (
    <>{typeof parameters !== "undefined" ?
      <div className="attack-card">
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
              <Settings className='icon' />
            </div>
          </div>
          <div className='description'>
            {description}
          </div>
        </div>
      </div> :
      <div style={{ color: "white" }}> No parameters has been passed for {name}</div>
    }

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