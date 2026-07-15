import React from 'react'
import './InfoTable.css'

export interface InfoTableProps {
    title: string
    // Updated to allow nested objects
    props: { [key: string]: any }
}

const InfoTable: React.FC<InfoTableProps> = ({
    title,
    props
}) => {
    const renderValue = (value: unknown): React.ReactNode => {
        if (value === null || value === undefined) return ''
        if (typeof value === 'string' || typeof value === 'number') return value
        return JSON.stringify(value)
    }

    const formatKey = (key: string) => {
        return key
            .split("_")
            .map(word => (word.at(0)?.toUpperCase() || '') + word.slice(1))
            .join(" ")
    }

    // Renders a clean, independent table inside the cell
    const renderNestedTable = (tableValues: Record<string, any>) => {
        return (
            <table className='info_table__nested'>
                <tbody>
                    {Object.entries(tableValues).map(([key, value]) => (
                        <tr key={key}>
                            <th className='info_table__key'>{formatKey(key)}:</th>
                            <td className='info_table__value'>{renderValue(value)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )
    }

    return (
        <table className='info_table'>
            <thead className='info_table__header-row'>
                <tr>
                    <th colSpan={2} className='info_table__title'>
                        {title}
                    </th>
                </tr>
            </thead>
            <tbody>
                {Object.entries(props).map(([key, value]) => {
                    const isObject = value !== null && typeof value === 'object' && !Array.isArray(value)

                    return (
                        <tr key={key}>
                            <th className='info_table__key'>{formatKey(key)}:</th>
                            <td className='info_table__value'>
                                {isObject ? renderNestedTable(value) : renderValue(value)}
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}

export default InfoTable