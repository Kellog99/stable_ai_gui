import React from 'react'
import './Report.css'

export interface InfoTableProps {
    title: string
    props: { [key: string]: string | number }
}
// This component is for displayin a certain "list" of information into a proper table
const InfoTable: React.FC<InfoTableProps> = ({
    title,
    props
}) => {
    return (
        <table className='info-table'>
            <thead style={{ borderBottom: "1px solid gray" }}>
                <th
                    colSpan={1}
                    style={{
                        textAlign: "left",
                        padding: "20px",
                        fontWeight: "bold"
                    }}> {title}</th>
            </thead>
            <tbody>
                {Object.entries(props).map(([key, value]) => (
                    <tr >
                        <th>{key}:</th>
                        <td>{value}</td>
                    </tr>
                ))}
            </tbody>
        </table>

    )
}

export default InfoTable