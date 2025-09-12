import React, { useState, useEffect } from 'react';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { RingProgress, Text } from "@mantine/core";
import { Heatmap } from '@mantine/charts';
import './Report.css'
import mockData from './examples';
import { ReportProps } from '@/interfaces/reportInterfaces';

// Color scheme for different risk levels
const COLORS = ['#4caf50', '#03a9f4', '#ff9800', '#ef5350'];
function getRiskColor(value: number) {
    // Clamp the value between 0 and 100
    value = Math.max(0, Math.min(100, value));

    // Normalize to 0-1 range
    const t = value / 100;

    // Light green RGB values
    const lightGreen = { r: 144, g: 238, b: 144 };

    // Dark red RGB values
    const darkRed = { r: 139, g: 0, b: 0 };

    // Interpolate between the colors
    const r = Math.round(lightGreen.r + (darkRed.r - lightGreen.r) * t);
    const g = Math.round(lightGreen.g + (darkRed.g - lightGreen.g) * t);
    const b = Math.round(lightGreen.b + (darkRed.b - lightGreen.b) * t);

    // Return as RGB string
    return `rgb(${r}, ${g}, ${b})`;
}


const SecurityReport = () => {
    const [data, setData] = useState<ReportProps>();
    const [selectedBenchmark, setSelectedBenchmark] = useState('');
    const [selectedClassBenchmark, setSelectedClassBenchmark] = useState('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');


    console.log(mockData)
    // Mock data structure - replace with actual JSON fetch
    useEffect(() => {
        const fetchData = async () => {
            try {
                setData(mockData);
                setSelectedBenchmark('accuracy');
                setSelectedClassBenchmark('accuracy');
                setLoading(false);
            } catch (err) {
                setError('Failed to load data');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="loading">Loading...</div>;
    }
    if (error || typeof data === 'undefined') {
        return <div className="error">{error}</div>;
    }

    const attacks = data.attacks


    // Prepare vulnerability data for display
    const vulnerabilityData = Object.entries(attacks).map(([attackName, attackData]) => {
        const risk = 100 * (1 - attackData.accuracy);
        return {
            name: attackName.toUpperCase(),
            risk: Math.round(risk),
            accuracy: attackData.accuracy,
            misclassification: attackData.misclassification || 0
        };
    });

    // Prepare benchmark comparison data
    // const benchmarkData = Object.entries(attacks).map(([attackName, attackData]) => ({
    //     name: attackName.toUpperCase(),
    //     original: data[selectedBenchmark] || 0,
    //     attacked: attackData[selectedBenchmark] || 0
    // }));

    // // Prepare class-level data
    // const classData = data.classNames?.slice(0, 10).map((className, index) => ({
    //     name: className,
    //     value: Math.random() * 100 // Replace with actual class-level metrics
    // })) || [];

    return (
        <div className="header">
            <h1>Security Report</h1>

            {/* Model Information Section */}
            <div className="section">
                <h2>Model Information</h2>
                <p>Main information of the tested model <strong>{data.info?.name}</strong>.</p>

                <div className="info-grid">
                    {Object.entries(data.info).map(([key, value]) => (
                        key !== 'confusion_matrix' ?
                            <div className="info-item">
                                <span className="label">{key}:</span>
                                <span className="value">{value}</span>
                            </div> : null)
                    )}
                </div>

                <h2>Model global performance</h2>
                <p>Information about the global metrics.</p>
                <div className="info-grid">
                    {Object.entries(data.metrics).map(([key, value]) => (
                        key !== 'confusion_matrix' ?
                            <div className="info-item">
                                <span className="label">{key}:</span>
                                <span className="value">{value}</span>
                            </div> : null)
                    )}
                </div>

            </div>

            {/* Model Performance Section */}
            <div className="section">
                <h2>Model's Performance</h2>
                <p>
                    Below, the model's performance is presented in comparison with other models on the same task.
                    The reported metrics reflect how each model performed across multiple evaluation scenarios.
                </p>

                <div className="benchmark-controls">
                    <select
                        value={selectedBenchmark}
                        onChange={(e) => setSelectedBenchmark(e.target.value)}
                        className="benchmark-select">
                        {Object.keys(data.metrics).map((key) =>
                            key !== 'confusion_matrix' ?
                                <option value="accuracy">{key}</option>
                                : null
                        )}
                    </select>
                </div>


            </div>

            {/* Vulnerability Section */}
            <div className="section">
                <h2>Vulnerability</h2>
                <p>
                    Here are all the vulnerabilities that were tested on the model.
                    The center column indicates which vulnerability has been tested, and on the right,
                    its criticality is displayed.
                </p>

                <div className="vulnerability-grid">
                    <table className="w-full">
                        <thead className="bg-gray-100 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                    Vulnerabilities tested
                                </th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                    Risk
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {Object.entries(data.attacks).map(([key, value], index) => (
                                <tr
                                    key={key}
                                    className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}
                                >
                                    <td className="px-6 py-4">
                                        <button
                                            // onClick={() => handleKeyClick(key)}
                                            className="text-blue-600 hover:text-blue-800 font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded transition-colors"
                                        >
                                            {key}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center">
                                            <RingProgress
                                                size={125}
                                                roundCaps
                                                label={
                                                    <Text size="xs" ta="center">
                                                        {value.risk}%
                                                    </Text>
                                                }
                                                sections={[{
                                                    value: value.risk,
                                                    color: getRiskColor(value.risk)
                                                }]} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div >
            </div >
        </div >
    );
};

export default SecurityReport;