import type {JobResult} from '@/interfaces/NNInterfaces';
import { Progress } from '@mantine/core';
import { Search } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import './TaskManagement.css';
import {getStatusIcon, getStatusColor, getStatusLabel, statuses} from './utils';
import type {AttackStatusLabel} from './utils';
interface ManagementTableProps {
    jobs: JobResult[];
    attackNames?: Record<string, string>;
}

const ManagementTable: React.FC<ManagementTableProps> = ({
    jobs,
    attackNames = {},
}) => {


    const [searchTerm, setSearchTerm] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<'All' | AttackStatusLabel>('All');


    const filteredJobs = useMemo<JobResult[]>(() => {
        const normalizedSearchTerm: string = searchTerm.trim().toLowerCase();

        return jobs.filter((job) => {
            const attackName = attackNames[job.id] ?? job.id;
            const matchesSearch =
                attackName.toLowerCase().includes(normalizedSearchTerm) ||
                job.id.toLowerCase().includes(normalizedSearchTerm) ||
                getStatusLabel(job.status ?? 'pending').toLowerCase().includes(normalizedSearchTerm);

            const matchesStatus = statusFilter === 'All' || getStatusLabel(job.status ?? 'pending') === statusFilter;

            return matchesSearch && matchesStatus;
        });

    }, [attackNames, jobs, searchTerm, statusFilter]);



    return (
        <div className='table-container'>
            <div>
                <div className="management-filters">
                    <div className="management-search-wrapper">
                        <Search className="management-search-icon" />
                        <input
                            type="text"
                            id="searchInput"
                            placeholder="Search jobs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className='management-filter'>
                        <div>Filter by:</div>
                        <select
                            className='selectionButton'
                            id="statusFilter"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as 'All' | AttackStatusLabel)}
                        >
                            <option value="All">All Statuses</option>
                            {statuses.map(status => {
                                return <option key={status} value={status}>{status}</option>
                            })
                            }
                        </select>
                    </div>
                </div>
                <div className="management-table-wrapper">

                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Attack Name </th>
                                <th>Status & Progress</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredJobs.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                                        {jobs.length === 0 ? 'No jobs have been executed' : 'No jobs match the current filters'}
                                    </td>
                                </tr>
                            ) : (
                                filteredJobs.map((job) => {
                                    return (
                                        <tr key={job.id}>
                                            <td>
                                                {job.id}
                                            </td>
                                            <td style={{ fontWeight: "bold" }}>
                                                {attackNames[job.id] ?? job.id}
                                            </td>
                                            <td>
                                                {job.status === "in progress" ?
                                                    <Progress
                                                        value={job.total ? ((job.progress ?? 0) / job.total) * 100 : 0}
                                                        color='blue'
                                                        animated
                                                    />
                                                    :
                                                    <div className={`status-badge ${getStatusColor(job.status ?? 'pending')}`}>
                                                        {getStatusIcon(job.status ?? 'pending')}
                                                        <span>{getStatusLabel(job.status ?? 'pending')}</span>
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
