import React from 'react';
import { ChevronDown } from 'lucide-react';
import { AttackType } from '@/interfaces/testInterfaces';

interface AttackSelectorProps {
  selectedAttack: AttackType;
  onAttackChange: (attack: AttackType) => void;
}

const attackInfo = {
  fgsm: {
    name: 'FGSM',
    description: 'Fast Gradient Sign Method - Single step attack',
    complexity: 'Low'
  },
  pgd: {
    name: 'PGD',
    description: 'Projected Gradient Descent - Multi-step iterative attack',
    complexity: 'Medium'
  },
  cw: {
    name: 'C&W',
    description: 'Carlini & Wagner - Optimization-based attack',
    complexity: 'High'
  },
  deepfool: {
    name: 'DeepFool',
    description: 'Minimal perturbation attack',
    complexity: 'Medium'
  },
  jsma: {
    name: 'JSMA',
    description: 'Jacobian-based Saliency Map Attack',
    complexity: 'High'
  }
};

export const AttackSelector: React.FC<AttackSelectorProps> = ({
  selectedAttack,
  onAttackChange
}) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-300 mb-3">
        Attack Algorithm
      </label>
      <div className="relative">
        <select
          value={selectedAttack}
          onChange={(e) => onAttackChange(e.target.value as AttackType)}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white appearance-none cursor-pointer hover:border-gray-500 focus:border-blue-500 focus:outline-none transition-colors"
        >
          {(Object.keys(attackInfo) as AttackType[]).map((attack) => (
            <option key={attack} value={attack}>
              {attackInfo[attack].name} - {attackInfo[attack].description}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
      </div>
      
      {/* Display selected attack info */}
      <div className="mt-3 p-3 bg-gray-800 rounded-lg border border-gray-600">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium text-white">
            {attackInfo[selectedAttack].name}
          </span>
          <span className={`text-xs px-2 py-1 rounded ${
            attackInfo[selectedAttack].complexity === 'Low' 
              ? 'bg-green-500/20 text-green-400'
              : attackInfo[selectedAttack].complexity === 'Medium'
              ? 'bg-yellow-500/20 text-yellow-400'
              : 'bg-red-500/20 text-red-400'
          }`}>
            {attackInfo[selectedAttack].complexity}
          </span>
        </div>
        <p className="text-sm text-gray-400">
          {attackInfo[selectedAttack].description}
        </p>
      </div>
    </div>
  );
};