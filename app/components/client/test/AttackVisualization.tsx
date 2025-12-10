import React from 'react';
import { AdvanceResult } from '@/interfaces/testInterfaces';
import { LineChart } from '@mantine/charts';
import { Clock, FileImage } from 'lucide-react';
import './test.css';

interface AttackVisualizationProps {
  results?: AdvanceResult
}
export const AttackVisualization: React.FC<AttackVisualizationProps> = ({
  results
}) => {
  console.log("confid", results?.confidence)
  return (
    <>
      {results ? (

        <div>
          <h3>
            Statistics
          </h3>
          <div className='statistics-container'>
            <div className='statistic'>
              <div className='stat-title'>
              <Clock size={30}/>
              <span>Execution Time (s) </span>
              </div>
              <b>{results.executionTime}</b>
            </div>
            <div className='statistic'>
              <div className='stat-title'>
              <FileImage size={30}/>
              <span>Structural Similarity Index </span>
              </div>
              <b>{results.ssim}</b>
            </div>
          </div>
          {/*<h3>
            Confidence Chart
          </h3>
          <LineChart
            h={300}
            type="gradient"
            data={results.confidence.map((conf, index) => ({
              confidence: conf.toFixed(3),
              step: index,
            }))}
            dataKey="step"
            series={[{ name: 'confidence', color: 'blue' }]}
            curveType="linear"
          />*/}

        </div>
      ) : (
        <p style={{ color: 'gray' }}>
          Run an attack to see statistics and analysis
        </p>
      )}
    </>
  );
};

