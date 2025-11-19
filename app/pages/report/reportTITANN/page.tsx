"use client";

import React, { useRef } from 'react';
import './Report.css'
import AttackTable from '@/components/client/nntrustReport/AttackTable';
import BenchmarkTable from '@/components/client/nntrustReport/BenchmarkTable';
import useNNTrustStore from '@/store/nnTrustStore';
import { ChartNoAxesCombined, Download, IdCardLanyard, Info, Radar, Trophy } from 'lucide-react';
import html2pdf from 'html2pdf.js'
import HeaderPageTask from '@/components/client/utils/HeaderPageTask';
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
            <div className='report-container'>
                <HeaderPageTask
                    Icon={IdCardLanyard}
                    title="Security Report"
                    descrition="Here are displayed all the results that comes from the Benchmark evaluation."
                    buttonprops={{
                        description: "Download PDF",
                        isDisabled: false,
                        handleClick: handleDownloadPDF,
                        Icon: Download
                    }}
                />

                <div
                    ref={reportRef}
                    className='report-container'>

                    {/* Model Information Section */}
                    <div className='model-info'>

                        <div className="section">
                            <div className='report-title'>
                                <Info color='#1B9AAA' size={"calc(var(--icon-size) * 2)"} />
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
                        </div>
                                                {/* Image of the neural network */}
                        <svg width="400px" height="400px" fill='lightgray' viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20.5 9a3.49 3.49 0 0 0-3.45 3h-1.1a2.49 2.49 0 0 0-4.396-1.052L8.878 9.731l3.143-4.225a2.458 2.458 0 0 0 2.98-.019L17.339 8H16v1h3V6h-1v1.243l-2.336-2.512A2.473 2.473 0 0 0 16 3.5a2.5 2.5 0 0 0-5 0 2.474 2.474 0 0 0 .343 1.243L7.947 9.308 4.955 7.947a2.404 2.404 0 0 0-.161-1.438l3.704-1.385-.44 1.371.942.333L10 4 7.172 3l-.334.943 1.01.357-3.659 1.368a2.498 2.498 0 1 0-.682 4.117l2.085 2.688-2.053 2.76a2.5 2.5 0 1 0 .87 3.864l3.484 1.587-1.055.373.334.943L10 21l-1-2.828-.943.333.435 1.354-3.608-1.645A2.471 2.471 0 0 0 5 17.5a2.5 2.5 0 0 0-.058-.527l3.053-1.405 3.476 4.48a2.498 2.498 0 1 0 4.113.075L18 17.707V19h1v-3h-3v1h1.293l-2.416 2.416a2.466 2.466 0 0 0-2.667-.047l-3.283-4.23 2.554-1.176A2.494 2.494 0 0 0 15.95 13h1.1a3.493 3.493 0 1 0 3.45-4zm-7-7A1.5 1.5 0 1 1 12 3.5 1.502 1.502 0 0 1 13.5 2zm0 18a1.5 1.5 0 1 1-1.5 1.5 1.502 1.502 0 0 1 1.5-1.5zM1 7.5a1.5 1.5 0 1 1 2.457 1.145l-.144.112A1.496 1.496 0 0 1 1 7.5zm3.32 1.703a2.507 2.507 0 0 0 .264-.326l2.752 1.251-1.124 1.512zM2.5 19A1.5 1.5 0 1 1 4 17.5 1.502 1.502 0 0 1 2.5 19zm2.037-2.941a2.518 2.518 0 0 0-.193-.234l1.885-2.532 1.136 1.464zm3.76-1.731L6.849 12.46l1.42-1.908L11.1 11.84a2.29 2.29 0 0 0-.033 1.213zM13.5 14a1.5 1.5 0 1 1 1.5-1.5 1.502 1.502 0 0 1-1.5 1.5zm7 1a2.5 2.5 0 1 1 2.5-2.5 2.502 2.502 0 0 1-2.5 2.5zm1.5-2.5a1.5 1.5 0 1 1-1.5-1.5 1.502 1.502 0 0 1 1.5 1.5z" />
                        </svg>

                    </div>

                    <div className='report-title'>
                        <ChartNoAxesCombined size={"calc(var(--icon-size) * 2)"} color='#1B9AAA' />
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