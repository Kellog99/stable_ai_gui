import { StyleSheet } from '@react-pdf/renderer';


// Helper function to get risk color
export const getRiskColor = (value: number): string => {
    value = Math.max(0, Math.min(100, value));
    const t = value / 100;
    const lightGreen = { r: 144, g: 238, b: 144 };
    const darkRed = { r: 139, g: 0, b: 0 };
    const r = Math.round(lightGreen.r + (darkRed.r - lightGreen.r) * t);
    const g = Math.round(lightGreen.g + (darkRed.g - lightGreen.g) * t);
    const b = Math.round(lightGreen.b + (darkRed.b - lightGreen.b) * t);
    return `rgb(${r}, ${g}, ${b})`;
};

// Helper function to get risk level text
export const getRiskLevel = (value: number): string => {
    if (value < 25) return 'Low';
    if (value < 50) return 'Medium';
    if (value < 75) return 'High';
    return 'Critical';
};


// Define styles for the PDF
export const stylesPDF = StyleSheet.create({
    page: {
        padding: 40,
        backgroundColor: '#ffffff',
        fontFamily: 'Helvetica',
    },
    header: {
        marginBottom: 20,
        borderBottom: '2 solid #1B9AAA',
        paddingBottom: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1B9AAA',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 12,
        color: '#666666',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1B9AAA',
        marginTop: 20,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    sectionDescription: {
        fontSize: 11,
        color: '#333333',
        marginBottom: 15,
        lineHeight: 1.5,
    },
    infoGrid: {
        marginBottom: 20,
    },
    infoRow: {
        flexDirection: 'row',
        borderBottom: '1 solid #CCCCCC',
        paddingVertical: 8,
    },
    infoLabel: {
        fontSize: 11,
        fontWeight: 'bold',
        width: '40%',
        color: '#333333',
    },
    infoValue: {
        fontSize: 11,
        width: '60%',
        color: '#666666',
    },
    table: {
        marginTop: 10,
        marginBottom: 20,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#1B9AAA',
        padding: 10,
        fontWeight: 'bold',
    },
    tableHeaderText: {
        fontSize: 11,
        color: '#ffffff',
        fontWeight: 'bold',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottom: '1 solid #CCCCCC',
        padding: 10,
    },
    tableCell: {
        fontSize: 10,
        color: '#333333',
    },
    benchmarkCell: {
        width: '25%',
    },
    attackNameCell: {
        width: '70%',
    },
    attackRiskCell: {
        width: '30%',
        textAlign: 'center',
    },
    riskBadge: {
        padding: 5,
        borderRadius: 4,
        textAlign: 'center',
    },
    riskText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        textAlign: 'center',
        fontSize: 9,
        color: '#999999',
        borderTop: '1 solid #CCCCCC',
        paddingTop: 10,
    },
    pageNumber: {
        fontSize: 9,
        color: '#999999',
    },
});
