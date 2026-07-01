import React from 'react'
import { SemiCircleProgress } from "@mantine/core";
import { useRouter } from "next/navigation";
import './AttackTable.css';
import { attacksProps } from '@/interfaces/reportInterfaces';
import useNNTrustStore from '@/store/nnTrustStore';
import { getRobustnessColor, getRiskColor } from '@/functionalities/Utils';



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
                    <th>Robustness</th>
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
                            {value.robustness && (
                                <SemiCircleProgress
                                    fillDirection="left-to-right"
                                    orientation="up"
                                    size={100}
                                    value={value.robustness * 100 / 3}
                                    filledSegmentColor={getRobustnessColor(value.robustness * 100 / 3)}
                                    label={`${(value.robustness).toFixed(2)}`}
                                />
                                )}
                        </td>
                    </tr>
                    ))}
            </tbody>
        </table>
    )
}

export default AttackTable;