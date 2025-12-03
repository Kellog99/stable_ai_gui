import React from 'react';
import { Document, Page, Text, View, Image } from '@react-pdf/renderer';
import { attacksProps, BenchmarkDataProps, ReportAttacksProps } from '@/interfaces/reportInterfaces';
import { getRiskColor, getRiskLevel, stylesPDF } from './SecurityReportStyle';
import useNNTrustStore from '@/store/nnTrustStore';
import { ParametersProps, RegisterObjectProps } from '@/interfaces/NNInterfaces';


interface SecurityReportPDFProps {
    report: ReportAttacksProps,
    benchmark: BenchmarkDataProps[]

}
// PDF Document Component
const SecurityReportPDF: React.FC<SecurityReportPDFProps> = ({
    report,
    benchmark
}) => {


    // ################################## Global monitoring ##################################
    const metricTable: { [key: string]: (number | string)[] } = {
        "metric": [],
        "value": [],
        "ranking": []
    }

    Object.entries(report.metrics).forEach(([metric, value]: [string, number]) => {
        if (!["confusion_matrix", "num_queries", "power"].includes(metric) && value) {
            metricTable["metric"].push(metric)
            metricTable["value"].push(value)

            // Count how many benchmark reports have a greater value for this metric
            const ranking: number = benchmark.filter(benchmarkReport => {
                const benchmarkValue = benchmarkReport.metrics[metric]
                return benchmarkValue !== null && benchmarkValue !== undefined && benchmarkValue > value
            }).length

            const reference: number = benchmark.filter(benchmarkReport => {
                const benchmarkValue = benchmarkReport.metrics[metric]
                return benchmarkValue !== null && benchmarkValue !== undefined
            }).length
            metricTable["ranking"].push(`${ranking + 1}/${reference + 1}`)
        }
    })


    // ################################## Vulnerability Table ##################################
    const refAtkProps: attacksProps = Object.values(report.attacks)[0]
    const availableMetrics = [
        "name",
        ...Object.entries(refAtkProps)
            .filter(([key, value]) => !["risk", "confusion_matrix", "countsamples", "num_queries", "power", "name"].includes(key) && value !== undefined && value !== null)
            .map(([key]) => key)
    ];

    console.log("available metrics = ", availableMetrics);
    // Initialize table: each metric → empty list
    const vulnerabilityTable: { [metric: string]: any[] } = {};
    availableMetrics.forEach(metric => {
        vulnerabilityTable[metric] = [];
    });

    // Fill the table
    Object.values(report.attacks).forEach((atkProps: attacksProps) => {
        availableMetrics.forEach(metric => {
            const value =
                metric === "name"
                    ? atkProps.name
                    : (atkProps as any)[metric];

            vulnerabilityTable[metric].push(value);
        });
    });
    console.log("vulnerabilityTable = ", vulnerabilityTable);

    // ################################## Parameters ##################################
    const { selectedAttacks } = useNNTrustStore()
    return (
        <Document>
            <Page size="A4" style={stylesPDF.page}>
                {/* Header */}
                <View style={stylesPDF.header}>
                    <View style={stylesPDF.titleContainer}>
                        <Text style={stylesPDF.title}>Security Report</Text>
                        <Text style={stylesPDF.subtitle}>
                            Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                        </Text>
                    </View>
                    <Image
                        source="/logo_leonardo.png"
                        style={stylesPDF.logo}

                    />
                </View>

                {/* Model Information */}
                <View>
                    <Text style={stylesPDF.sectionTitle}> Model Information</Text>
                    <Text style={stylesPDF.sectionDescription}>
                        Main information of the tested model {report.info?.name}.
                    </Text>
                    <View style={stylesPDF.infoGrid}>
                        {Object.entries(report.info).map(([key, value]: [string, any]) =>
                            key !== 'confusion_matrix' ? (
                                <View key={key} style={stylesPDF.infoRow}>
                                    <Text style={stylesPDF.infoLabel}>{key}:</Text>
                                    <Text style={stylesPDF.infoValue}>{String(value)}</Text>
                                </View>
                            ) : null
                        )}
                    </View>
                </View>

                {/* Model Performance */}
                <View>
                    <Text style={stylesPDF.sectionTitle}> Model Performance</Text>
                    <Text style={stylesPDF.sectionDescription}>
                        This table contains the information about the model's performance and its comparision between other models that have been tested with each metric.
                    </Text>

                    <View style={stylesPDF.table}>
                        {Object.entries(metricTable).map(([key, values]) => (
                            <View key={key} style={stylesPDF.tableColumn}>
                                <View style={stylesPDF.headerCell}>
                                    <Text>{key}</Text>
                                </View>
                                {values.map((value, index) => (
                                    <View key={index} style={stylesPDF.cell}>
                                        <Text>{value}</Text>
                                    </View>
                                ))}
                            </View>
                        ))}
                    </View>
                </View>

                {/* Footer */}
                <Text style={stylesPDF.footer} fixed>
                    Security Report - Page 1
                </Text>
            </Page>


            {/* Second Page - Vulnerabilities */}
            <Page size="A4" style={stylesPDF.page}>
                <Text style={stylesPDF.sectionTitle}>Vulnerability Assessment</Text>
                <Text style={stylesPDF.sectionDescription}>
                    Here are all the vulnerabilities that were tested on the model. The center column indicates
                    which vulnerability has been tested, and on the right, its criticality is displayed.
                </Text>

                <View style={stylesPDF.table}>
                    {Object.entries(vulnerabilityTable).map(([metric, values]) => (
                        <View key={metric} style={stylesPDF.tableColumn}>
                            <View style={stylesPDF.headerCell}>
                                <Text>{metric}</Text>
                            </View>
                            {values.map((value, index) => (
                                <View key={index} style={stylesPDF.cell}>
                                    <Text>{metric === "name" ? value : value.toFixed(3)}</Text>
                                </View>
                            ))}
                        </View>
                    ))}
                </View>

                <Text style={stylesPDF.footer} fixed>
                    Security Report - Page 2
                </Text>
            </Page>

            {/* Third Page - Vulnerabilities */}
            <Page size="A4" style={stylesPDF.page}>
                <Text style={stylesPDF.sectionTitle}>Attack Parameters</Text>
                <Text style={stylesPDF.sectionDescription}>
                    This section lists all the parameters used during the benchmark for each attack.
                </Text>

                <View style={stylesPDF.listParams}>
                    {Object.entries(selectedAttacks).map(([atk, atkProps]: [string, RegisterObjectProps]) => (
                        <View
                            key={atk}
                            style={stylesPDF.paramContainer}
                        >
                            <View style={stylesPDF.paramName}>
                                <Text>{atkProps.name}</Text>
                            </View>
                            {
                                atkProps.parameters && atkProps.parameters.length > 0 ?
                                    atkProps.parameters?.map((param: ParametersProps) => {
                                        return (
                                            <View
                                                key={`${param.id}_${atk}`}
                                            >
                                                <Text style={{ fontSize: 8 }}>{param.name}: {param.default} </Text>
                                            </View>
                                        )
                                    }) : null
                            }
                        </View>
                    ))}
                </View>

                <Text style={stylesPDF.footer} fixed>
                    Security Report - Page 3
                </Text>
            </Page>
        </Document>
    )
};
export default SecurityReportPDF;