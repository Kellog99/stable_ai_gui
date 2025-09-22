import React from 'react';
import { AttackConfig, AttackType } from '@/interfaces/testInterfaces';

interface ParameterControlsProps {
  config: AttackConfig;
  onConfigChange: (config: AttackConfig) => void;
  attackType: AttackType;
}

export const ParameterControls: React.FC<ParameterControlsProps> = ({
  config,
  onConfigChange,
  attackType
}) => {
  const handleChange = (key: keyof AttackConfig, value: number) => {
    onConfigChange({ ...config, [key]: value });
  };

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-300 mb-3">Attack Parameters</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-xs text-gray-400 mb-1">
            Epsilon (ε) - Perturbation Budget
          </label>
          <input
            type="range"
            min="0.001"
            max="0.3"
            step="0.001"
            value={config.epsilon}
            onChange={(e) => handleChange('epsilon', parseFloat(e.target.value))}
            className="w-full accent-blue-500"
          />
          <div className="text-xs text-gray-500 mt-1">
            {config.epsilon.toFixed(3)}
          </div>
        </div>

        {(attackType === 'pgd' || attackType === 'cw') && (
          <div>
            <label className="block text-xs text-gray-400 mb-1">
              Iterations
            </label>
            <input
              type="range"
              min="1"
              max="100"
              step="1"
              value={config.iterations}
              onChange={(e) => handleChange('iterations', parseInt(e.target.value))}
              className="w-full accent-blue-500"
            />
            <div className="text-xs text-gray-500 mt-1">
              {config.iterations}
            </div>
          </div>
        )}

        {attackType === 'pgd' && (
          <div>
            <label className="block text-xs text-gray-400 mb-1">
              Step Size (α)
            </label>
            <input
              type="range"
              min="0.0001"
              max="0.1"
              step="0.0001"
              value={config.stepSize}
              onChange={(e) => handleChange('stepSize', parseFloat(e.target.value))}
              className="w-full accent-blue-500"
            />
            <div className="text-xs text-gray-500 mt-1">
              {config.stepSize.toFixed(4)}
            </div>
          </div>
        )}

        {(attackType === 'cw' || attackType === 'jsma') && (
          <div>
            <label className="block text-xs text-gray-400 mb-1">
              Target Class (optional)
            </label>
            <input
              type="number"
              min="0"
              max="999"
              value={config.targetClass || ''}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-1 text-white text-sm"
              placeholder="Auto-detect"
            />
          </div>
        )}

        {attackType === 'cw' && (
          <div>
            <label className="block text-xs text-gray-400 mb-1">
              Confidence
            </label>
            <input
              type="range"
              min="0"
              max="50"
              step="0.1"
              value={config.confidence || 0}
              onChange={(e) => handleChange('confidence', parseFloat(e.target.value))}
              className="w-full accent-blue-500"
            />
            <div className="text-xs text-gray-500 mt-1">
              {(config.confidence || 0).toFixed(1)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};