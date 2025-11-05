"use client";

import React from 'react';
import './Report.css'
import AttackTable from '@/components/client/nntrustReport/AttackTable';
import BenchmarkTable from '@/components/client/nntrustReport/BenchmarkTable';
import useNNTrustStore from '@/store/nnTrustStore';
import { ChartNoAxesCombined, IdCardLanyard, Info, Radar, Trophy } from 'lucide-react';


const SecurityReport = () => {

    const { report, benchmark } = useNNTrustStore()

    // Bisogna pensare ad una logica in cui il benchmark viene anche caricato qua se e è nullo 

    
    console.log("benchark fetch = ", benchmark)
    if (report && benchmark) {
        return (
            <div>
                <div className='report-title'>
                    {/*<IdCardLanyard size={"8vw"} color='#1B9AAA' />*/}
                    <div>
                        <h1 style={{ color: "white" }}>Security Report</h1>
                        <p style={{ color: "gray" }}>
                            Here are displayed all the results that comes from the Benchmark evaluation.
                        </p>
                    </div>
                </div>
                {/* Model Information Section */}
                <div className="section">
                    <div className='report-title'>
                        <Info color='#1B9AAA' size={"3vw"} />
                        <h2 style={{ alignItems: "center" }}>Model Information</h2>
                    </div>
                    <p>Main information of the tested model <strong>{report.info?.name}</strong>.</p>

                    <div className="info-grid">
                        {Object.entries(report.info).map(([key, value]) => (
                            key !== 'confusion_matrix' ?
                                <div className="info-item">
                                    <div className="label" key={key}>{key}:</div>
                                    <div className="value" key={`value-${key}`}>{value}</div>
                                </div> : null)
                        )}
                    </div>
                    <div className='report-title'>
                        <ChartNoAxesCombined size={"4vw"} color='#1B9AAA' />
                        <h2>Model global performance  </h2>
                    </div>
                    <p>Information about the global metrics.</p>
                    <div className="info-grid">
                        {Object.entries(report.metrics).map(([key, value]) => (
                            key !== 'confusion_matrix' ?
                                <div className="info-item">
                                    <span className="label">{key}: </span>
                                    <span className="value">{value}</span>
                                </div> : null)
                        )}
                    </div>
                </div>
                {/* Model Performance Section */}
                <div className="section">
                    <div className='report-title'>
                        <Trophy size={"4vw"} color='#1B9AAA' />
                        <h2>Benchmarking</h2>
                    </div>
                    <p>
                        Below, the model's performance is presented in comparison with other models on the same task.
                        The reported metrics reflect how each model performed across multiple evaluation scenarios.
                    </p>
                    <BenchmarkTable
                        modelName={report.info.name}
                        data={report.metrics}
                        benchmark={benchmark} />
                </div>
                {/* Vulnerability Section */}
                <div className="section">

                    <div className='report-title'>
                        <Radar size={"4vw"} color='#1B9AAA' />
                        <h2>Vulnerability</h2>
                    </div>
                    <p>
                        Here are all the vulnerabilities that were tested on the model. The center column indicates which vulnerability has been tested, and on the right, its criticality is displayed.
                    </p>

                    <AttackTable data={report.attacks} />
                </div >
            </div >
        );
    }
    else {
        return <div className="error">No data are lodaded</div>;
    }

};

export default SecurityReport;