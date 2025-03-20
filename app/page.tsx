// app/page.tsx

import ScatterPlotClient from './components/client/ScatterPlotClient';

// Generate sample data on the server
function generateSampleData() {
  return Array.from({ length: 100 }, (_, i) => ({
    x: Math.random() * 100 - 50,  // Values between -50 and 50
    y: Math.random() * 100 - 50,
    z: Math.random() * 100 - 50,
    label: `Point ${i}`,
    value: Math.random()
  }));
}

export default function ScatterPlotPage() {
  // Generate data on the server
  const sampleData = generateSampleData();
  
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">3D Interactive Scatter Plot</h1>
        </div>
        
        {/* Pass the server-generated data to the client component */}
        <ScatterPlotClient initialData={sampleData} />
      </div>
    </div>
  );
}