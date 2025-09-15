import React, { useState, useEffect } from 'react';
import './Report.css'
import { mockData } from './examples';
import { ReportProps } from '@/interfaces/reportInterfaces';
import AttackTable from './components/AttackTable';
import BenchmarkTable from './components/BenchmarkTable';

const SecurityReport = () => {
    const [data, setData] = useState<ReportProps>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');


    // Mock data structure - replace with actual JSON fetch
    useEffect(() => {
        const fetchData = async () => {
            try {
                setData(mockData);
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
                {data.metrics ? <BenchmarkTable {...data.metrics} /> : null}


            </div>

            {/* Vulnerability Section */}
            <div className="section">
                <h2>Vulnerability</h2>
                <p>
                    Here are all the vulnerabilities that were tested on the model.
                    The center column indicates which vulnerability has been tested, and on the right,
                    its criticality is displayed.
                </p>

                <AttackTable data={data.attacks} />
            </div >
        </div >
    );
};

export default SecurityReport;