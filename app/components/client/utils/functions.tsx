// Color scheme for different risk levels
const COLORS = ['#4caf50', '#03a9f4', '#ff9800', '#ef5350'];


export default function getRiskColor (value: number) {
    if (value <= 25) return COLORS[0];
    if (value <= 50) return COLORS[1];
    if (value <= 75) return COLORS[2];
    return COLORS[3];
};

export default function getRiskLevel(value: number) {
    if (value <= 25) return 'Low';
    if (value <= 50) return 'Medium';
    if (value <= 75) return 'High';
    return 'Critical';
};

