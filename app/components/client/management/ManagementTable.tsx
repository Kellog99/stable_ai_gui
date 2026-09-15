import {ATTACK_STATUSES} from '@/interfaces/NNInterfaces';
import type {AttackStatus, JobResult} from '@/interfaces/NNInterfaces';
import {Progress} from '@mantine/core';
import {Search} from 'lucide-react';
import React, {useMemo, useState} from 'react';
import './TaskManagement.css';
import {getStatusColor, getStatusIcon, getStatusLabel} from './utils';

interface ManagementTableProps {
    jobs: JobResult[];
    attackNames?: Record<string, string>;
    isLoading?: boolean;
    error?: string | null;
}

const ManagementTable: React.FC<ManagementTableProps> = (
    {
        jobs,
        attackNames = {},
        isLoading = false,
        error = null,
    }
) => {


    const [searchTerm, setSearchTerm] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<'All' | AttackStatus>('All');


    const filteredJobs = useMemo<JobResult[]>(() => {
        const normalizedSearchTerm: string = searchTerm.trim().toLowerCase();

        return jobs.filter((job) => {
            const attackName = attackNames[job.id] ?? job.id;
            const matchesSearch =
                attackName.toLowerCase().includes(normalizedSearchTerm) ||
                job.id.toLowerCase().includes(normalizedSearchTerm) ||
                getStatusLabel(job.status).toLowerCase().includes(normalizedSearchTerm);

            const matchesStatus = statusFilter === 'All' || job.status === statusFilter;

            return matchesSearch && matchesStatus;
        });

    }, [attackNames, jobs, searchTerm, statusFilter]);


    return (
        <div className='table-container'>
            <div>
                <div className="management-filters">
                    <div className="management-search-wrapper">
                        <Search className="management-search-icon" aria-hidden="true"/>
                        <input
                            type="text"
                            id="searchInput"
                            placeholder="Search jobs..."
                            aria-label="Search vulnerability jobs"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className='management-filter'>
                        <label htmlFor="statusFilter">Filter by:</label>
                        <select
                            className='selectionButton'
                            id="statusFilter"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as 'All' | AttackStatus)}
                        >
                            <option value="All">All Statuses</option>
                            {ATTACK_STATUSES.map((status) => (
                                <option key={status} value={status}>{getStatusLabel(status)}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="management-table-wrapper">

                    <table>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Attack Name</th>
                            <th>Status & Progress</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredJobs.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                                    <span role="status" aria-live="polite">
                                        {isLoading
                                            ? 'Loading jobs…'
                                            : error
                                                ? error
                                                : jobs.length === 0
                                                    ? 'No jobs have been executed'
                                                    : 'No jobs match the current filters'}
                                    </span>
                                </td>
                            </tr>
                        ) : (
                            filteredJobs.map((job) => {
                                return (
                                    <tr key={job.id}>
                                        <td>
                                            {job.id}
                                        </td>
                                        <td style={{fontWeight: "bold"}}>
                                            {attackNames[job.id] ?? job.id}
                                        </td>
                                        <td>
                                            {job.status === 'in progress' ?
                                                <Progress
                                                    value={job.total ? ((job.progress ?? 0) / job.total) * 100 : 0}
                                                    color='blue'
                                                    animated
                                                    aria-label={`${getStatusLabel(job.status)}: ${job.progress ?? 0} of ${job.total ?? 0}`}
                                                />
                                                :
                                                <div
                                                    className={`status-badge ${getStatusColor(job.status)}`}>
                                                    {getStatusIcon(job.status)}
                                                    <span>{getStatusLabel(job.status)}</span>
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
