import React from 'react'
import './Status.css';
interface StatusProp {
    attackList: string[]
}
function getStatus(id: string, item: 'status' | 'criticality') {
    if (item === 'status') {
        return 'Not-executed'
    }
    else {
        return 'None'
    }
}
const Status: React.FC<StatusProp> = ({ attackList }) => {

    return (
        <div className="task-table-container">
            <h2 className="task-table-title">Task Management Table</h2>
            <div className='table-container'>
                <table className="task-table">
                    <thead className="task-table-header">
                        <tr>
                            <th>Item</th>
                            <th>Status</th>
                            <th>Criticality</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attackList.map((attack, index) => (
                            <tr key={index}>
                                <td>
                                    <div className="task-item">{attack}</div>
                                </td>
                                <td>
                                    <span className='status-badge status-not-executed'>
                                        {getStatus(attack, 'status')}
                                    </span>
                                </td>
                                <td>
                                    <span className={`criticality-badge criticality-${getStatus(attack, 'criticality')}`}>
                                        {getStatus(attack, 'criticality')}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div >);
};

export default Status