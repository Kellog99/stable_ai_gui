import React from 'react';

import './AttackVisualization.css';
import ConfidenceChart from './ConfidenceChart';
import '@mantine/charts/styles.css';


interface AttackVisualizationProps {
  confidence?: { [key: string]: { [key: number]: number } }
  results?: { [key: string]: number }
  prediction?: { adversarial: string, original: string }
}

export const AttackVisualization: React.FC<AttackVisualizationProps> = ({
  confidence,
  results,
  prediction
}) => {


  // ############# PRE ATTACK #############
  if (!results || !confidence || !prediction) {
    return (
      <div className="empty-state">
        <div className="empty-state-content">
          <svg className="empty-state-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="empty-state-text">Run an attack to see statistics and analysis</p>
        </div>
      </div>
    );
  }
  // ######################################


  return (
    <div className="statistics-container">
      <div>
        <h3 className="card-title">Prediction</h3>
        <span style={{ fontSize: "0.9rem" }}>
          {
            prediction.original !== prediction.adversarial ?
              "The attack has successfully evade the model prediction"
              : "The attack could not fool the model."
          }
        </span>

        <div className={`card-predictions ${prediction.original !== prediction.adversarial ? "evasion" : ""}`}>
          <span> Original prediction: <b>{prediction.original}</b></span>
          <span> Adversarial prediction: <b>{prediction.adversarial}</b></span>
        </div>
      </div>


      {/* Statistics Table */}
      <div className='statistics_container'>
        <div>
          <h3 className="card-title">Statistics</h3>
          <span style={{ fontSize: "0.9rem" }}>This table shows some metrics regarding the executed attack.</span>
        </div>
        <table className='metric_table'>
          <thead style={{ background: 'var(--bg)' }}>
            <tr>
              <th>Metric</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {results
              ? Object.entries(results).map(([key, value]) => (
                <tr key={key}>
                  <td> <b>{key}</b></td>
                  <td >{value.toFixed(3)}</td>
                </tr>
              ))
              : null}
          </tbody>
          <caption className='table_caption' >
            Computed Metrics
          </caption>
        </table>

      </div>

      {/* Confidence Chart */}
      <ConfidenceChart confidence={confidence} />
    </div >
  );
};

