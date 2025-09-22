import React from 'react';
import { AttackResult, AttackStats } from '@/interfaces/testInterfaces';
import { TrendingUp, Target, Zap, Clock } from 'lucide-react';

interface AttackVisualizationProps {
  result?: AttackResult;
  stats?: AttackStats;
}

export const AttackVisualization: React.FC<AttackVisualizationProps> = ({
  result,
  stats
}) => {
  if (!result || !stats) {
    return (
      <div className="bg-gray-800 rounded-lg border border-gray-600 p-6">
        <div className="text-center text-gray-500">
          <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>Run an attack to see statistics and analysis</p>
        </div>
      </div>
    );
  }

  const metrics = [
    {
      label: 'Attack Success',
      value: result.success ? 'Success' : 'Failed',
      icon: Target,
      color: result.success ? 'text-green-400' : 'text-red-400'
    },
    {
      label: 'Model Confidence',
      value: `${(result.confidence * 100).toFixed(1)}%`,
      icon: Zap,
      color: 'text-blue-400'
    },
    {
      label: 'L∞ Distance',
      value: result.linfinityDistance.toFixed(4),
      icon: TrendingUp,
      color: 'text-yellow-400'
    },
    {
      label: 'Execution Time',
      value: `${stats.executionTime}ms`,
      icon: Clock,
      color: 'text-purple-400'
    }
  ];

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-600 p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Attack Analysis</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <metric.icon className={`w-4 h-4 ${metric.color} mr-2`} />
              <span className="text-sm text-gray-400">{metric.label}</span>
            </div>
            <div className={`text-lg font-semibold ${metric.color}`}>
              {metric.value}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Perturbation Strength
          </label>
          <div className="bg-gray-700 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-400 to-red-500 transition-all duration-500"
              style={{ width: `${Math.min(result.linfinityDistance * 1000, 100)}%` }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1">
            L2: {result.l2Distance.toFixed(4)} | L∞: {result.linfinityDistance.toFixed(4)}
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Attack Progress
          </label>
          <div className="bg-gray-700 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-500"
              style={{ width: `${(result.iterations / 50) * 100}%` }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Iterations: {result.iterations}
          </div>
        </div>
      </div>
    </div>
  );
};