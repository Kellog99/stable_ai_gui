import { AttackManagementProps } from '@/interfaces/NNInterfaces';
import { Progress } from '@mantine/core';
import { ArrowDownUp, Search } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import './ManagementTable.css';
import { getStatusIcon, getStatusColor, statuses } from './utils';
interface ManagementTableProps {
    jobs: AttackManagementProps[]
}

const ManagementTable: React.FC<ManagementTableProps> = ({
    jobs
}) => {


    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [sortConfig, setSortConfig] = useState<{ key: keyof AttackManagementProps | null, direction: 'asc' | 'desc' }>({
        key: null,
        direction: 'asc'
    });

    const filteredAndSortedJobs = useMemo(() => {
        let filtered = jobs.filter(job => {
            const matchesSearch =
                job.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.status.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = statusFilter === 'All' || job.status === statusFilter;

            return matchesSearch && matchesStatus;
        });

        return filtered;
    }, [jobs, searchTerm, statusFilter]);



    return (
        <div className='table-container'>
            <div>
                <div className="filters">
                    <div className="search-wrapper">
                        <Search className="search-icon" />
                        <input
                            type="text"
                            id="searchInput"
                            placeholder="Search jobs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className='filter'>
                        <div>Filter by:</div>
                        <select
                            className='selectionButton'
                            id="statusFilter"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="All">All Statuses</option>
                            {statuses.map(status => {
                                return <option key={status} value={status}>{status}</option>
                            })
                            }
                        </select>
                    </div>
                </div>
                <div className="table-wrapper">

                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Attack Name </th>
                                <th>Status & Progress</th>
                            </tr>
                        </thead>
                        <tbody>
                            {jobs.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                                        No jobs found
                                    </td>
                                </tr>
                            ) : (
                                filteredAndSortedJobs.map((job, index) => {
                                    return (
                                        <tr key={`${job.id}-${index}`}>
                                            <td>
                                                {job.id}
                                            </td>
                                            <td style={{ fontWeight: "bold" }}>
                                                {job.name}
                                            </td>
                                            <td>
                                                {job.status === "In Progress" ?
                                                    <Progress value={job.progress} color='blue' animated />
                                                    : job.status === "Completed" && job.progress !== 100 ?
                                                        <Progress value={job.progress} color='red' />
                                                        :
                                                    <div className={`status-badge ${getStatusColor(job.status)}`}>
                                                        {getStatusIcon(job.status)}
                                                        <span>{job.status}</span>
                                                    </div>
                                                }
                                            </td>

                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default ManagementTable