import React from 'react';
import { LineChart } from '@mantine/charts';
import './test.css';

interface AttackVisualizationProps {
  confidence?: { [key: string]: number[] }
  results?: { [key: string]: number }
  prediction?: { adversarial: string, original: string }
}

export const AttackVisualization: React.FC<AttackVisualizationProps> = ({
  confidence,
  results,
  prediction
}) => {
  const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];
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

  const chartData = Object.values(confidence)[0]?.map((_, stepIndex) => {
    const point: any = { step: stepIndex };
    Object.entries(confidence).forEach(([key, series]) => {
      point[key] = parseFloat(series[stepIndex].toFixed(3));
    });
    return point;
  }) || [];

  const series = Object.keys(confidence).map((key, index) => ({
    name: key,
    color: colors[index % colors.length]
  }));

  return (
    <div className="statistics-container">
      <div>
        <h3 className="card-title">Prediction</h3>
        <div className='card-predictions' style={{
          backgroundColor: `${prediction.original !== prediction.adversarial ? "lightgreen" : "rgb(255, 121, 121)"}`,
          border: `2px solid ${prediction.original !== prediction.adversarial ? "green" : "red"}`

        }}>
          <span> Original prediction: {prediction.original}</span>
          <span> Adversarial prediction: {prediction.adversarial}</span>
        </div>
        <span style={{fontSize:"0.9rem"}}>{prediction.original !== prediction.adversarial ? "The attack has successfully evade the model prediction" : "The attack could not fool the model."}</span>
      </div>
      {/* Statistics Table */}
      <div>
        <h3 className="card-title">Statistics</h3>
        <span style={{ fontSize: "0.8rem" }}>This table shows some metrics regarding the executed attack.</span>
      </div>
      <table className="stats-table">
        <thead>
          <tr>
            <th>Metric</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(results).map(([metric, value], index) => (
            <tr key={metric} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
              <td className="metric-name">{metric}</td>
              <td className="metric-value">
                {typeof value === 'number' ? value.toFixed(4) : value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Confidence Chart */}
      {
        confidence['adversarial'].length > 0 && confidence['original'].length > 0 ?
          <>
            <div>
              <h3 className="card-title">Confidence Chart</h3>
              <span style={{ fontSize: "0.8rem" }}>
                The following graph shows the trend in confidence for the original class and the opposing class.        </span>
            </div>
            <div className="chart-wrapper">
              <LineChart
                h={500}
                w={800}
                data={chartData}
                withLegend
                legendProps={{
                  verticalAlign: 'bottom',
                  layout: 'horizontal',
                  height: 60,
                  align: 'center'
                }}
                styles={{
                  legend: {
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '16px',
                    paddingTop: '32px',
                    fontSize: '0.875rem',
                    flexWrap: 'wrap',
                    justifyContent: 'center'
                  }
                }}
                dataKey="step"
                xAxisLabel="Iteration Step"
                yAxisLabel="Model Confidence"
                series={series}
                curveType="monotone"
                strokeWidth={2}
                gridAxis="xy"
              />
            </div>
          </>
          : null}
    </div>
  );
};

