'use client';

import React, { useState } from 'react';
import ScatterPlot3D from './ScatterPlot3D';
import ImageViewer from './ImageViewer';
import { Settings } from 'lucide-react';

type DataPoint = {
  x: number;
  y: number;
  z: number;
  label: string;
  value: number;
};

type ScatterPlotClientProps = {
  initialData: DataPoint[];
};

export default function ScatterPlotClient({ initialData }: ScatterPlotClientProps) {
  const [colorScale, setColorScale] = useState<'viridis' | 'rainbow' | 'category'>('viridis');
  const [pointSize, setPointSize] = useState(5);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<number | null>(null);
  const [selectedPoints, setSelectedPoints] = useState<number[]>([]);

  const handlePointsSelected = (indices: number[]) => {
    setSelectedPoints(indices);
    if (indices.length > 0) {
      setSelectedPoint(indices[0]); // Show the first selected point's image
    }
  };

  return (
    <>
     
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <ScatterPlot3D
          data={initialData}
          width={800}
          height={600}
          pointSize={pointSize}
          colorScale={colorScale}
          onPointClick={(index) => setSelectedPoint(index)}
          onPointsSelected={handlePointsSelected}
        />
        
        
        {selectedPoints.length > 0 && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="font-medium text-gray-700">
              Selected Points: {selectedPoints.length}
            </p>
            <p className="text-sm text-gray-600">
              Indices: {selectedPoints.slice(0, 5).join(', ')}
              {selectedPoints.length > 5 ? ` ... and ${selectedPoints.length - 5} more` : ''}
            </p>
          </div>
        )}
      </div>


    </>
  );
}