"use client";

import React, { useRef } from 'react';
import './Report.css'
import AttackTable from '@/components/client/nntrustReport/AttackTable';
import BenchmarkTable from '@/components/client/nntrustReport/BenchmarkTable';
import useNNTrustStore from '@/store/nnTrustStore';
import { ChartNoAxesCombined, Download, IdCardLanyard, Info, Radar, Trophy } from 'lucide-react';
import html2pdf from 'html2pdf.js'

const SecurityReport = () => {

    const { report, benchmark } = useNNTrustStore()
    const reportRef = useRef<HTMLDivElement>(null);

    const handleDownloadPDF = () => {
        if (!reportRef.current) return;

        const opt = {
            margin: [15, 15, 15, 15],
            filename: `security_report_${report.info?.name || 'model'}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
                scale: 2,
                useCORS: true,
                letterRendering: true,
                logging: false
            },
            jsPDF: {
                unit: 'mm',
                format: 'a4',
                orientation: 'portrait',
                compress: true
            },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }

        };
        // Make sure your element has black text  
        const element = reportRef.current;
        element.style.color = "black";


        // Then generate PDF  
        html2pdf()
            .set(opt)
            .from(reportRef.current)
            .save()
            .then(() => {
                element.style.color = "white";
            });


    };

    if (report && benchmark) {
        return (
            <div>
                <button
                    onClick={handleDownloadPDF}
                    className="download-pdf-button"
                    style={{
                        position: 'fixed',
                        top: '20px',
                        right: '20px',
                        backgroundColor: '#1B9AAA',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '12px 20px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                        zIndex: 1000,
                        transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#16818f'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1B9AAA'}
                >
                    <Download size={18} />
                    Download PDF
                </button>
                <div ref={reportRef} style={{color:"white"}}>


                    <div className='report-title'>
                        <IdCardLanyard size={"8vw"} color='#1B9AAA' />
                        <div>
                            <h1 style={{ color: "white" }}>Security Report</h1>
                            <p >
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
            </div>
        );
    }
    else {
        return <div className="error">No data are lodaded</div>;
    }

};

export default SecurityReport;