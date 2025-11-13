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

  const model = useNNStore((state) => state.models);
  const numClasses = model?.filter((m) => m.name === useNNStore((state) => state.modelName))[0].num_classes as number

  console.log("cm in elements??", name == "confusionmatrix")
  console.log("is selected", isSelected)

  let isCM = false;
  if (numClasses > 100 && name == "confusionmatrix") {
    isCM = true;
  }
  console.log("isCM", isCM)


  return (
    <>
      <div className={`attack-card ${isCM ? "inactive" : ""}`}>
        {isCM && <span className="tooltip">The model you chose has too many classes, and do not allow a clear view of the confusion matrix</span>}
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
            style={{ pointerEvents: parameters ? "auto" : "none" }}
            size={30}
            onClick={() => setIsExpanded(true)} />
          <label className="circle-checkbox">
            <input
              type="checkbox"
              onChange={onSelect}
              checked={isSelected && !isCM}
            />
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