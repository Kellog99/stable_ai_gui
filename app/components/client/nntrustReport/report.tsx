import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
// Color scheme for different risk levels
const COLORS = ['#4caf50', '#03a9f4', '#ff9800', '#ef5350'];

const getRiskColor = (value) => {
    if (value <= 25) return COLORS[0];
    if (value <= 50) return COLORS[1];
    if (value <= 75) return COLORS[2];
    return COLORS[3];
};

const getRiskLevel = (value) => {
    if (value <= 25) return 'Low';
    if (value <= 50) return 'Medium';
    if (value <= 75) return 'High';
    return 'Critical';
};


import mockData from './examples';
import { ReportProps } from '@/interfaces/reportInterfaces';

const SecurityReport = () => {
    const [data, setData] = useState<ReportProps>();
    const [selectedModel, setSelectedModel] = useState('');
    const [selectedBenchmark, setSelectedBenchmark] = useState('');
    const [selectedClassBenchmark, setSelectedClassBenchmark] = useState('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');


    console.log(mockData)
    // Mock data structure - replace with actual JSON fetch
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Replace with your actual JSON file path
                // const response = await fetch('/data/imagenet1k-2012-20250203/data.json');
                // const jsonData = await response.json();
                setData(mockData);
                setSelectedModel('resnet50');
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
    const benchmarkData = Object.entries(attacks).map(([attackName, attackData]) => ({
        name: attackName.toUpperCase(),
        original: data[selectedBenchmark] || 0,
        attacked: attackData[selectedBenchmark] || 0
    }));

    // Prepare class-level data
    const classData = data.classNames?.slice(0, 10).map((className, index) => ({
        name: className,
        value: Math.random() * 100 // Replace with actual class-level metrics
    })) || [];

    const GaugeChart = ({ value, title, size = 120 }) => {
        const circumference = 2 * Math.PI * 45;
        const strokeDasharray = `${(value / 100) * circumference} ${circumference}`;

        return (
            <div className="gauge-container">
                <div className="gauge-title">{title}</div>
                <svg width={size} height={size} className="gauge">
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r="45"
                        fill="none"
                        stroke="#e0e0e0"
                        strokeWidth="10"
                    />
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r="45"
                        fill="none"
                        stroke={getRiskColor(value)}
                        strokeWidth="10"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset="0"
                        transform={`rotate(-90 ${size / 2} ${size / 2})`}
                    />
                    <text x={size / 2} y={size / 2} textAnchor="middle" dy="0.3em" className="gauge-text">
                        {value.toFixed(1)}%
                    </text>
                </svg>
            </div>
        );
    };

    return (
        <div className="report">
            <div className="header">
                <img src="/assets/logo_letters.png" alt="Logo" className="logo" />
                <h1>Security Report</h1>
            </div>

            {/* Model Information Section */}
            <div className="section">
                <h2>Model Information</h2>
                <p>Main information of the tested model <strong>{data.info?.name || selectedModel}</strong>.</p>

                <div className="model-info">
                    <div className="model-details">
                        <div className="info-grid">
                            <div className="info-item">
                                <span className="label">Model:</span>
                                <span className="value">{data.info?.name || selectedModel}</span>
                            </div>
                            <div className="info-item">
                                <span className="label">Parameters:</span>
                                <span className="value">{data.info?.parameters || 'N/A'}</span>
                            </div>
                            <div className="info-item">
                                <span className="label">Accuracy:</span>
                                <span className="value">{(data.accuracy * 100).toFixed(1)}%</span>
                            </div>
                            <div className="info-item">
                                <span className="label">Description:</span>
                                <span className="value">{data.info?.description || 'No description available'}</span>
                            </div>
                        </div>
                    </div>
                    <div className="model-icon">
                        <img src="/assets/icon.png" alt="Model Icon" />
                    </div>
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
                        className="benchmark-select"
                    >
                        <option value="accuracy">Accuracy</option>
                        <option value="precision">Precision</option>
                        <option value="f1_score">F1 Score</option>
                    </select>
                </div>

                <div className="benchmark-chart">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={benchmarkData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="original" fill="#4caf50" name="Original" />
                            <Bar dataKey="attacked" fill="#ef5350" name="After Attack" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <p>Here below it is shown the performance and the metrics associated to each class of the model.</p>

                <div className="benchmark-controls">
                    <select
                        value={selectedClassBenchmark}
                        onChange={(e) => setSelectedClassBenchmark(e.target.value)}
                        className="benchmark-select"
                    >
                        <option value="accuracy">Class Accuracy</option>
                        <option value="precision">Class Precision</option>
                        <option value="f1_score">Class F1 Score</option>
                    </select>
                </div>

                <div className="class-chart">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={classData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#03a9f4" />
                        </BarChart>
                    </ResponsiveContainer>
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
                    {vulnerabilityData.map((vuln, index) => (
                        <div key={index} className="vulnerability-card">
                            <div className="vuln-header">
                                <h3>{vuln.name}</h3>
                                <span className={`risk-badge risk-${getRiskLevel(vuln.risk).toLowerCase()}`}>
                                    {getRiskLevel(vuln.risk)}
                                </span>
                            </div>

                            <div className="vuln-metrics">
                                <div className="metric">
                                    <span className="metric-label">Risk Level:</span>
                                    <span className="metric-value">{vuln.risk}%</span>
                                </div>
                                <div className="metric">
                                    <span className="metric-label">Post-Attack Accuracy:</span>
                                    <span className="metric-value">{(vuln.accuracy * 100).toFixed(1)}%</span>
                                </div>
                                <div className="metric">
                                    <span className="metric-label">Misclassification:</span>
                                    <span className="metric-value">{vuln.misclassification}%</span>
                                </div>
                            </div>

                            <div className="vuln-gauge">
                                <GaugeChart value={vuln.risk} title="Risk Score" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SecurityReport;