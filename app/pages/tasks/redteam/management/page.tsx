"use client";
import React, { useEffect, useMemo, useState } from 'react'
import './TaskManagement.css'
import useNNTrustStore from '@/store/nnTrustStore'
import { ArrowDownUp, Search } from 'lucide-react';

const TaskManagement: React.FC = () => {
    const { executedAttacks } = useNNTrustStore()
    const [attackArray, setAttackArray] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [sortConfig, setSortConfig] = useState<{ key: string | null, direction: 'asc' | 'desc' }>({
        key: null,
        direction: 'asc'
    });

    // Convert Set to Array whenever executedAttacks changes
    useEffect(() => {
        const attacksArray = Array.from(executedAttacks);
        setAttackArray(attacksArray);
    }, [executedAttacks]);

    const handleSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const filteredAndSortedJobs = useMemo(() => {
        let filtered = attackArray.filter(job => {
            // Handle both string and object cases
            const jobName = typeof job === 'string' ? job : (job?.name || '');
            const jobStatus = typeof job === 'string' ? '' : (job?.status || '');
            const jobId = typeof job === 'string' ? job : (job?.id || '');

            const matchesSearch =
                jobName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                jobId.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
                jobStatus.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = statusFilter === 'All' || jobStatus === statusFilter;

            return matchesSearch && matchesStatus;
        });

        if (sortConfig.key) {
            filtered.sort((a, b) => {
                let aValue, bValue;

                if (typeof a === 'string' && typeof b === 'string') {
                    aValue = a;
                    bValue = b;
                } else {
                    aValue = a?.[sortConfig.key!] || '';
                    bValue = b?.[sortConfig.key!] || '';
                }

                // Handle numeric sorting for IDs
                if (sortConfig.key === 'id') {
                    const aNum = Number(aValue);
                    const bNum = Number(bValue);
                    if (!isNaN(aNum) && !isNaN(bNum)) {
                        return sortConfig.direction === 'asc' ? aNum - bNum : bNum - aNum;
                    }
                }

                // String comparison
                if (aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }

        return filtered;
    }, [attackArray, searchTerm, statusFilter, sortConfig]);

    return (
        <div className="container">
            <h1>Job Status Management</h1>
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
                <select
                    id="statusFilter"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="All">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Blocked">Blocked</option>
                </select>
            </div>
            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>
                                <button onClick={() => handleSort('id')}>
                                    ID <ArrowDownUp />
                                </button>
                            </th>
                            <th>
                                <button onClick={() => handleSort('name')}>
                                    Job Name <ArrowDownUp />
                                </button>
                            </th>
                            <th>
                                <button onClick={() => handleSort('status')}>
                                    Status <ArrowDownUp />
                                </button>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredAndSortedJobs.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                                    No jobs found
                                </td>
                            </tr>
                        ) : (
                            filteredAndSortedJobs.map((job, index) => {
                                const jobId = typeof job === 'string' ? job : (job?.id || index);
                                const jobName = typeof job === 'string' ? job : (job?.name || 'N/A');
                                const jobStatus = typeof job === 'string' ? 'N/A' : (job?.status || 'N/A');

                                return (
                                    <tr key={`${jobId}-${index}`} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {jobId}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {jobName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100">
                                                {jobStatus}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default TaskManagement