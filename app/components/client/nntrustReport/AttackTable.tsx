import React from 'react'
import { SemiCircleProgress, Text } from "@mantine/core";
import { useRouter } from "next/navigation";
import './AttackTable.css';
import { attacksProps } from '@/interfaces/reportInterfaces';
import useNNTrustStore from '@/store/nnTrustStore';

// Color scheme for different risk levels
function getRiskColor(value: number) {
    // Clamp the value between 0 and 100
    value = Math.max(0, Math.min(100, value));

    // Normalize to 0-1 range
    const t = value / 100;

    // Light green RGB values
    const lightGreen = { r: 144, g: 238, b: 144 };

    // Dark red RGB values
    const darkRed = { r: 139, g: 0, b: 0 };

    // Interpolate between the colors
    const r = Math.round(lightGreen.r + (darkRed.r - lightGreen.r) * t);
    const g = Math.round(lightGreen.g + (darkRed.g - lightGreen.g) * t);
    const b = Math.round(lightGreen.b + (darkRed.b - lightGreen.b) * t);

    // Return as RGB string
    return `rgb(${r}, ${g}, ${b})`;
}

interface AttackTableProps {
    data: { [key: string]: attacksProps }
}

const AttackTable: React.FC<AttackTableProps> = ({
    data
}) => {
    const { setVulnerabilitySelected } = useNNTrustStore()
    const router = useRouter();

    return (
        <table className="vulnerability-grid">
            <thead>
                <tr>
                    <th>Vulnerabilities tested</th>
                    <th>Risk</th>
                </tr>
            </thead>
            <tbody>
                {Object.entries(data).map(([key, value]) => (
                    <tr key={key}>
                        <td>
                            <button
                                onClick={() => {
                                    setVulnerabilitySelected(key)
                                    router.push(`/pages/report/reportTITANN/AttackPage`)
                                }}
                                className="btn-table"
                            >
                                {value.name}
                            </button>
                        </td>
                        <td className="place-content-center">
                            <SemiCircleProgress
                                fillDirection="left-to-right"
                                orientation="up"
                                size={130}
                                value={value.risk * 100}
                                filledSegmentColor={getRiskColor(value.risk * 100)}
                                label={
                                    <Text size="s" ta="center">
                                        {(value.risk * 100).toFixed(1)}%
                                    </Text>
                                }
                            />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default AttackTable;