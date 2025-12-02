import React from 'react'
import { SemiCircleProgress, Text } from "@mantine/core";
import { useRouter } from "next/navigation";
import './AttackTable.css';
import { attacksProps } from '@/interfaces/reportInterfaces';
import useNNTrustStore from '@/store/nnTrustStore';
import { getRiskColor } from '@/functionalities/Utils';



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
                                    router.push(`/pages/report/reportTITANN/AttackPage?atkId=${key}`);
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
                                value={value.risk}
                                filledSegmentColor={getRiskColor(value.risk)}
                                label={`${(value.risk).toFixed(1)}%`}
                            />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default AttackTable;