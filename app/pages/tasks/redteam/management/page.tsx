"use client";
import React, { useEffect, useState } from 'react'
import './TaskManagement.css'
import useNNTrustStore from '@/store/nnTrustStore'
import { HoverCard } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { BenchmarkDataProps, ReportProps } from '@/interfaces/reportInterfaces';
import { getStatusIcon, statuses } from './utils';
import ManagementTable from './ManagementTable';
import { CircleArrowRight, Info } from 'lucide-react';



const TaskManagement: React.FC = () => {
    const { setReport, setBenchmark, executedAttacks } = useNNTrustStore()
    const [attackStates, setAttackStates] = useState<{ [key: string]: number }>({});
    const [isDisabled, setIsDisabled] = useState<boolean>(true)

    // Convert Set to Array whenever executedAttacks changes
    useEffect(() => {
        const recap = Object.fromEntries(
            statuses.map(status => [
                status,
                executedAttacks.filter(job => job.status === status).length
            ])
        )
        setAttackStates(recap)
        // the report button is disable if there are still jobs that are pending or in progress to be finished
        setIsDisabled(!(recap["Pendig"] === 0 && recap["In progress"] === 0))
        console.log("is disable = ", isDisabled)
    }, [executedAttacks]);

    const router = useRouter()
    // handle click for going to the Report page
    const handleClickReport = async () => {
        // If the button is clickable then all the attacks are done and the JSON has been produced
        async function fetchResult<T>(url: string): Promise<T | undefined> {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error for the report JSON! Status: ${response.status}`);
                }
                const json: T = await response.json();
                return json;
            } catch (err) {
                console.log(err instanceof Error ? err.message : "An error occurred");
                return undefined; // Explicitly return undefined on error
            }
        }

        const reportFetch = await fetchResult<ReportProps>('http://127.0.0.1:8000/report/getReport');
        const benchmarkFetch = await fetchResult<BenchmarkDataProps>('http://127.0.0.1:8000/report/getBenchmark');
        if (reportFetch) {
            setReport(reportFetch);
        }
        if (benchmarkFetch) {
            console.log("saving = ", benchmarkFetch)
            setBenchmark(benchmarkFetch);
        }
        router.push("/pages/report/reportTITANN")
    }



    return (
        <div className="container">
            <div className='management-header'>
                <div className='management-title'>
                    <h1>Job Status Management</h1>
                    <Info size={20} color='white' style={{ margin: '0 0 8px' }} />
                    {/* <p style={{ color: "lightgray" }}>
                        Here it is possible to controll the advancement of all the vulnerabilities that have been executed in the <b>Benchmark</b> page.
                    </p> */}
                </div>

                <HoverCard
                    width={170}
                    shadow="md"
                    disabled={!isDisabled}>
                    <HoverCard.Target>
                        <div>
                            <button
                                disabled={isDisabled}
                                onClick={handleClickReport}
                                className={`header-button ${isDisabled ? 'disabled' : ''}`}>
                                Vulnerability Report <CircleArrowRight size={25} />
                            </button>
                        </div>
                    </HoverCard.Target>
                    <HoverCard.Dropdown>
                        <p style={{ fontSize: "0.7rem" }}>
                            This button is currently disabled.
                            Because {executedAttacks.length === 0 ? "there are no vulnearbilities scheduled." : `${executedAttacks.length - 0} vulnearbily(s) remains to be finished.`}
                        </p>
                    </HoverCard.Dropdown>
                </HoverCard>
            </div>
            {/* Status Summary Cards */}
            <div className="container-cards">
                {Object.entries(attackStates).map(([status, value]) => (
                    <div className="card-summary">
                        {getStatusIcon(status)}
                        <div >
                            <div style={{ fontSize: "0.8rem" }}>{status}:</div>
                            <span style={{ fontSize: "1.4rem", fontWeight: 700 }}>{value}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Table Management */}
            <div >
                <h3 style={{ color: 'white' }}>Info Vulnerabilities</h3>
                <ManagementTable
                    jobs={executedAttacks}
                />
            </div>
        </div>
    );
}

export default TaskManagement