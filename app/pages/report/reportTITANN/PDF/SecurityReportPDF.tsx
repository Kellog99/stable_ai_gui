import React from 'react';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import { BenchmarkDataProps, ReportAttacksProps } from '@/interfaces/reportInterfaces';
import { getRiskColor, getRiskLevel, stylesPDF } from './SecurityReportStyle';


interface SecurityReportPDFProps {
    report: ReportAttacksProps,
    benchmark: { [key: string]: BenchmarkDataProps }

}
// PDF Document Component
const SecurityReportPDF: React.FC<SecurityReportPDFProps> = ({ report, benchmark }) => (

    <Document>
        <Page size="A4" style={stylesPDF.page}>
            {/* Header */}
            <View style={stylesPDF.header}>
                <Text style={stylesPDF.title}>Security Report</Text>
                <Text style={stylesPDF.subtitle}>
                    Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                </Text>
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

            {/* Model Global Performance */}
            <View>
                <Text style={stylesPDF.sectionTitle}> Model Global Performance</Text>
                <Text style={stylesPDF.sectionDescription}>
                    Information about the global metrics.
                </Text>
                <View style={stylesPDF.table}>
                    {/* Table Header */}
                    <View style={stylesPDF.tableHeader}>
                        <Text style={[stylesPDF.tableHeaderText, { width: '40%' }]}>Metric</Text>
                        <Text style={[stylesPDF.tableHeaderText, { width: '30%', textAlign: 'center' }]}>Value</Text>
                        <Text style={[stylesPDF.tableHeaderText, { width: '30%', textAlign: 'center' }]}>Rank</Text>
                    </View>

                    {/* Table Rows */}
                    {Object.entries(report.metrics || {}).map(([key, value]: [string, any]) => {
                        if (key === 'confusion_matrix') return null;

                        // Calculate ranking
                        const getRanking = () => {
                            if (!benchmark) return 'N/A';

                            const allValues = [
                                { name: report.info?.name || 'Current Model', value: Number(value) },
                                ...Object.entries(benchmark).map(([name, metrics]: [string, any]) => ({
                                    name,
                                    value: Number(metrics[key] || 0)
                                }))
                            ];

                            // Sort descending (higher is better for most metrics)
                            allValues.sort((a, b) => b.value - a.value);

                            const position = allValues.findIndex(m => m.name === (report.info?.name || 'Current Model')) + 1;
                            const total = allValues.length;

                            return `${position}/${total}`;
                        };
                        const ranking = getRanking();

                        return (
                            <View key={key} style={stylesPDF.tableRow}>
                                <Text style={[stylesPDF.tableCell, { width: '40%' }]}>{key}</Text>
                                <Text style={[stylesPDF.tableCell, { width: '30%', textAlign: 'center' }]}>{String(value)}</Text>
                                <Text style={[stylesPDF.tableCell, { width: '30%', textAlign: 'center', fontWeight: 'bold', color: '#1B9AAA' }]}>
                                    {ranking}
                                </Text>
                            </View>
                        );
                    })}
                </View>
            </View>

            {/* Footer */}
            <Text style={stylesPDF.footer} fixed>
                Security Report - Page 1
            </Text>
        </Page>

        {/* Second Page - Benchmarking */}
        <Page size="A4" style={stylesPDF.page}>
            <Text style={stylesPDF.sectionTitle}>Benchmarking</Text>
            <Text style={stylesPDF.sectionDescription}>
                Below, the model's performance is presented in comparison with other models on the same task.
                The reported metrics reflect how each model performed across multiple evaluation scenarios.
            </Text>

            <View style={stylesPDF.table}>
                <View style={stylesPDF.tableHeader}>
                    <Text style={[stylesPDF.tableHeaderText, stylesPDF.benchmarkCell]}>Model Name</Text>
                    {Object.keys(report.metrics).map((key) =>
                        key !== 'confusion_matrix' ? (
                            <Text key={key} style={[stylesPDF.tableHeaderText, stylesPDF.benchmarkCell]}>
                                {key}
                            </Text>
                        ) : null
                    )}
                </View>

                {/* Current model row */}
                <View style={[stylesPDF.tableRow, { backgroundColor: '#E8F4F8' }]}>
                    <Text style={[stylesPDF.tableCell, stylesPDF.benchmarkCell, { fontWeight: 'bold' }]}>
                        {report.info.name}
                    </Text>
                    {Object.entries(report.metrics).map(([key, value]: [string, any]) =>
                        key !== 'confusion_matrix' ? (
                            <Text key={key} style={[stylesPDF.tableCell, stylesPDF.benchmarkCell]}>
                                {String(value)}
                            </Text>
                        ) : null
                    )}
                </View>
            </View>

            <Text style={stylesPDF.footer} fixed>
                Security Report - Page 2
            </Text>
        </Page>

        {/* Third Page - Vulnerabilities */}
        <Page size="A4" style={stylesPDF.page}>
            <Text style={stylesPDF.sectionTitle}>Vulnerability Assessment</Text>
            <Text style={stylesPDF.sectionDescription}>
                Here are all the vulnerabilities that were tested on the model. The center column indicates
                which vulnerability has been tested, and on the right, its criticality is displayed.
            </Text>

            <View style={stylesPDF.table}>
                <View style={stylesPDF.tableHeader}>
                    <Text style={[stylesPDF.tableHeaderText, stylesPDF.attackNameCell]}>
                        Vulnerabilities Tested
                    </Text>
                    <Text style={[stylesPDF.tableHeaderText, stylesPDF.attackRiskCell]}>
                        Risk Level
                    </Text>
                </View>

                {Object.entries(report.attacks).map(([key, value]: [string, any]) => (
                    <View key={key} style={stylesPDF.tableRow}>
                        <Text style={[stylesPDF.tableCell, stylesPDF.attackNameCell]}>
                            {value.name}
                        </Text>
                        <View style={[stylesPDF.attackRiskCell]}>
                            <View style={[stylesPDF.riskBadge, { backgroundColor: getRiskColor(value.risk * 100) }]}>
                                <Text style={stylesPDF.riskText}>
                                    {(value.risk * 100).toFixed(1)}% - {getRiskLevel(value.risk * 100)}
                                </Text>
                            </View>
                        </View>
                    </View>
                ))}
            </View>

            <Text style={stylesPDF.footer} fixed>
                Security Report - Page 3
            </Text>
        </Page>
    </Document>
);
export default SecurityReportPDF;