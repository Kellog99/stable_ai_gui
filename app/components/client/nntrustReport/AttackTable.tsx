import React from 'react'
import { RingProgress, Text } from "@mantine/core";
import { useRouter } from "next/navigation";
import './AttackTable.css';
import { attacksProps } from '@/interfaces/reportInterfaces';
// Color scheme for different risk levels
const COLORS = ['#4caf50', '#03a9f4', '#ff9800', '#ef5350'];
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


const AttackTable: React.FC<{ [key: string]: attacksProps }> = ({
    data
}) => {
    const router = useRouter();

    return (
        <table className="vulnerability-grid">
            <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Vulnerabilities tested
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Risk
                    </th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
                {Object.entries(data).map(([key, value], index) => (
                    <tr>
                        <td className="px-6 py-4">
                            <button
                                onClick={() => router.push(`/${key}`)}
                                className="btn-table"
                            >
                                {value.name}
                            </button>
                        </td>
                        <td className="place-content-center">
                            <RingProgress
                                size={125}
                                roundCaps
                                label={
                                    <Text size="xs" ta="center">
                                        {value.risk}%
                                    </Text>
                                }
                                sections={[{
                                    value: value.risk,
                                    color: getRiskColor(value.risk)
                                }]} />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default AttackTable