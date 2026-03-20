"use client";

import React, { useEffect, useRef, useState } from 'react';
import './Report.css'
import AttackTable from '@/components/client/nntrustReport/AttackTable';
import BenchmarkTable from '@/components/client/nntrustReport/BenchmarkTable';
import useNNTrustStore from '@/store/nnTrustStore';
import { ChartNoAxesCombined, Download, IdCardLanyard, Radar, Trophy } from 'lucide-react';
import HeaderPageTask from '@/components/client/utils/HeaderPageTask';
import SecurityReportPDF from './PDF/SecurityReportPDF';
import { pdf } from '@react-pdf/renderer';
import InfoTable from './InfoTable';
import { getBenchmarkList } from '@/functionalities/TITANNServices/get_benchmarks';
import { BenchmarkDataProps } from '@/interfaces/reportInterfaces';
import useBackendVariablesStore from '@/store/globalStore';


const SecurityReport = () => {
    const { hostname, port } = useBackendVariablesStore()
    const { modelReport } = useNNTrustStore()

    const [modelInfo, setModelInfo] = useState<{ [key: string]: string | number }>({})
    const [modelMetrics, setModelMetric] = useState<{ [key: string]: string | number }>({})
    const [benchmark, setBenchmark] = useState<BenchmarkDataProps[]>([])

    useEffect(() => {
        if (modelReport) {
            setModelInfo(Object.fromEntries(
                Object.entries(modelReport.info).filter(([key]) => !['id', 'image'].includes(key))
            ))
            setModelMetric(
                Object.fromEntries(
                    Object.entries(modelReport.metrics).filter(([key]) => !['id', 'confusion_matrix'].includes(key))
                ))
        }

        //####################### benchmarking list #######################
        getBenchmarkList(hostname, port)
            .then(setBenchmark)
            .catch(err => console.error("Failed to load attacks:", err));
        //################################################################# 
    }, [modelReport, hostname, port])
    console.log("benchmark = ", benchmark)

    //####################### PDF GENERATION #######################
    const reportRef = useRef<HTMLDivElement>(null);

    const handleDownloadPDF = async () => {
        try {
            // Generate PDF blob
            if (modelReport && benchmark) {
                const blob = await pdf(
                    <SecurityReportPDF
                        report={modelReport}
                        benchmark={benchmark}
                    />
                ).toBlob();

                // Create download link
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `Security_Report_${modelReport.info?.name}_${new Date().toISOString().split('T')[0]}.pdf`;

                // Trigger download
                document.body.appendChild(link);
                link.click();

                // Cleanup
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
                // Create URL and open PDF in a new tab
                // const url = URL.createObjectURL(blob);
                // window.open(url, "_blank");
                console.log('PDF downloaded successfully');
            }
        } catch (error) {
            console.error('Error generating PDF:', error);
            throw error;
        }
    };
    //##############################################################

    //  Handling the case where no report is loaded
    if (!modelReport) return <div className="error">No data are lodaded</div>;

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
                <div className="section">
                    <div className='report-title'>
                        <svg style={{ width: "60px" }} fill='#1B9AAA' viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20.5 9a3.49 3.49 0 0 0-3.45 3h-1.1a2.49 2.49 0 0 0-4.396-1.052L8.878 9.731l3.143-4.225a2.458 2.458 0 0 0 2.98-.019L17.339 8H16v1h3V6h-1v1.243l-2.336-2.512A2.473 2.473 0 0 0 16 3.5a2.5 2.5 0 0 0-5 0 2.474 2.474 0 0 0 .343 1.243L7.947 9.308 4.955 7.947a2.404 2.404 0 0 0-.161-1.438l3.704-1.385-.44 1.371.942.333L10 4 7.172 3l-.334.943 1.01.357-3.659 1.368a2.498 2.498 0 1 0-.682 4.117l2.085 2.688-2.053 2.76a2.5 2.5 0 1 0 .87 3.864l3.484 1.587-1.055.373.334.943L10 21l-1-2.828-.943.333.435 1.354-3.608-1.645A2.471 2.471 0 0 0 5 17.5a2.5 2.5 0 0 0-.058-.527l3.053-1.405 3.476 4.48a2.498 2.498 0 1 0 4.113.075L18 17.707V19h1v-3h-3v1h1.293l-2.416 2.416a2.466 2.466 0 0 0-2.667-.047l-3.283-4.23 2.554-1.176A2.494 2.494 0 0 0 15.95 13h1.1a3.493 3.493 0 1 0 3.45-4zm-7-7A1.5 1.5 0 1 1 12 3.5 1.502 1.502 0 0 1 13.5 2zm0 18a1.5 1.5 0 1 1-1.5 1.5 1.502 1.502 0 0 1 1.5-1.5zM1 7.5a1.5 1.5 0 1 1 2.457 1.145l-.144.112A1.496 1.496 0 0 1 1 7.5zm3.32 1.703a2.507 2.507 0 0 0 .264-.326l2.752 1.251-1.124 1.512zM2.5 19A1.5 1.5 0 1 1 4 17.5 1.502 1.502 0 0 1 2.5 19zm2.037-2.941a2.518 2.518 0 0 0-.193-.234l1.885-2.532 1.136 1.464zm3.76-1.731L6.849 12.46l1.42-1.908L11.1 11.84a2.29 2.29 0 0 0-.033 1.213zM13.5 14a1.5 1.5 0 1 1 1.5-1.5 1.502 1.502 0 0 1-1.5 1.5zm7 1a2.5 2.5 0 1 1 2.5-2.5 2.502 2.502 0 0 1-2.5 2.5zm1.5-2.5a1.5 1.5 0 1 1-1.5-1.5 1.502 1.502 0 0 1 1.5 1.5z" />
                        </svg>
                        <h2 style={{ alignItems: "center" }}>Information</h2>
                    </div>
                    <InfoTable
                        props={modelInfo}
                        title={`Model ${modelReport.info.name}'s information`}
                    />
                </div>

                {/* Model Performance Metrics */}
                <div className="section">

                    <div className='report-title'>
                        <ChartNoAxesCombined size={"calc(var(--icon-size) * 2)"} color='#1B9AAA' />
                        <h2>Model performance  </h2>
                    </div>
                    <InfoTable
                        props={modelMetrics}
                        title='Computed metrics' />
                </div>


            </div>

            {/* Benchmarking section */}
            <div className="section">
                <div className='report-title'>
                    <Trophy size={"calc(var(--icon-size) * 2)"} color='#1B9AAA' />
                    <h2>Benchmarking</h2>
                </div>
                <p>
                    Below, the model's performance is presented in comparison with other models on the same task.
                    The reported metrics reflect how each model performed across multiple evaluation scenarios.
                </p>

                <BenchmarkTable
                    modelName={modelReport.info.name}
                    data={modelReport.metrics}
                    benchmark={benchmark ? benchmark : []} />
            </div>

            {/* Vulnerability Section */}
            <div className="section">

                <div className='report-title'>
                    <Radar size={"calc(var(--icon-size) * 2)"} color='#1B9AAA' />
                    <h2>Vulnerability</h2>
                </div>
                <p>
                    Here are all the vulnerabilities that were tested on the model. The center column indicates which vulnerability has been tested, and on the right, its criticality is displayed.
                </p>

                <AttackTable data={modelReport.attacks} />
            </div >
        </div >
    );

};

export default SecurityReport;