import React from 'react';
import { LineChart } from '@mantine/charts';
import './test.css';

interface AttackVisualizationProps {
  confidence?: { [key: string]: number[] }
  results?: { [key: string]: number }
}
export const AttackVisualization: React.FC<AttackVisualizationProps> = ({
  confidence,
  results
}) => {
  console.log("confid", results)
  return (
    <>
      {results && confidence ? (

        <div className='statistics-container'>
          <h3>
            Statistics
          </h3>
          <div >
            <table>
              <thead>
                <tr>
                  <th> Metric </th>
                  <th> Value </th>
                </tr>
              </thead>
              <tbody>
                {
                  Object.entries(results).map(([metric, value]) => {
                    return (
                      <tr key={metric}>
                        <td>{metric}</td>
                        <td>{value}</td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
          </div>
          <h3>
            Confidence Chart
          </h3>
          <LineChart
            h={500}
            data={
              Object.values(confidence)[0]?.map((_, stepIndex) => {
                const point: any = { step: stepIndex };
                Object.entries(confidence).forEach(([key, series]) => {
                  point[key] = parseFloat(series[stepIndex].toFixed(3));
                });
                return point;
              }) || []
            }
            withLegend
            legendProps={{
              verticalAlign: 'bottom',
              layout: "horizontal",
              height: 50,
              align: 'right'
            }}
            styles={{
              legend: {
                display:"flex", 
                flexDirection:"row",
                gap:"20px",
                paddingTop:"50px", 
                fontSize:"0.9rem", 
                flexWrap: 'nowrap',
                overflowX: 'auto'  // Optional: adds scrolling if items overflow  
              }
            }}
            dataKey="step"
            xAxisLabel="Iteration Step"
            yAxisLabel="Confidence of the model"
            series={Object.keys(confidence).map((key, index) => ({
              name: key,
              color: ['blue', 'red', 'green', 'orange', 'purple'][index % 5]
            }))}
          />
        </div>
      ) : (
        <span style={{ color: 'lightgray' }}>
          Run an attack to see statistics and analysis
        </span>
      )}
    </>
  );
};

