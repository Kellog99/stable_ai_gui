"use client";

import {useEffect, useState} from 'react';
import BenchmarkTable from '@/components/client/nntrustReport/BenchmarkTable';
import useNNTrustStore from '@/store/nnTrustStore';
import {Download, Gauge, IdCardLanyard, Trophy} from 'lucide-react';
import HeaderPageTask from '@/components/client/utils/HeaderPageTask';
import InfoTable from '@/components/client/report/InfoTable';
import {getBenchmarkList} from '@/functionalities/TITANNServices/get_benchmarks';
import {BenchmarkDataProps, MetricsProps} from '@/interfaces/reportInterfaces';
import useBackendVariablesStore from '@/store/globalStore';
import styles from '@/styles/Report.module.css';
import {handleDownloadPDF} from './handle_download';
import VulnerabilityTable from '../../../components/client/report/VulnerabilityTable';
import MetricsCard, {MetricCardItem} from '@/components/client/report/MetricsCard';
import {ModelInfo} from "@/interfaces/homePageInterface";

const SecurityReport = () => {
    const {hostname, port} = useBackendVariablesStore();
    const {modelReport} = useNNTrustStore();
    const [benchmark, setBenchmark] = useState<BenchmarkDataProps[]>([]);

    console.log(modelReport)
    useEffect(() => {
        getBenchmarkList(hostname, port)
            .then(setBenchmark)
            .catch(err => console.error('Failed to load benchmarks:', err));
    }, [hostname, port]);

    if (!modelReport) return <div className={styles.error}>No report data loaded.</div>;

    const info: ModelInfo = modelReport.info;
    const metrics: MetricsProps = modelReport.metrics;
    const attacks = modelReport.attacks ?? {};
    const metricCards: MetricCardItem[] = Object.entries(metrics)
        .filter(([key, value]) => key !== 'confusion_matrix' && value != null)
        .map(([key, value]) => ({
            key,
            label: key
                .split('_')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' '),
            value,
        }));

    return (
        <main className={styles.report_container}>
            <HeaderPageTask
                Icon={IdCardLanyard}
                title="Security Report"
                description="Results from the benchmark evaluation."
                button_props={{
                    description: 'Download report',
                    isDisabled: false,
                    handleClick: () => handleDownloadPDF({modelReport, hostname, port}),
                    Icon: Download,
                }}
            />

            <InfoTable info={info}/>

            <section className={styles.metrics} aria-labelledby="metrics-title">
                <div className={styles.metrics_title}>
                    <Gauge size={32}/>
                    <div className={styles.metrics_heading}>
                        <h2 id="metrics-title">Metrics</h2>
                        <p className={styles.metrics_description}>
                            Here are all the metrics that are computed on this model.
                        </p>
                    </div>
                </div>
                <MetricsCard items={metricCards}/>
            </section>

            <section className={styles.section} aria-labelledby="benchmark-title">
                <div className={styles.report_title}>
                    <Trophy size={32}/>
                    <div>
                        <h2 id="benchmark-title">Benchmarking</h2>
                    </div>
                </div>
                <BenchmarkTable
                    modelName={String(info.name ?? '')}
                    data={modelReport.metrics}
                    benchmark={benchmark}
                />
            </section>

            <VulnerabilityTable data={attacks}/>
        </main>
    );
};

export default SecurityReport;
