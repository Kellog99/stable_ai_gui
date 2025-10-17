"use client";
import React, { useMemo, useState } from 'react'
import './TaskManagement.css'
import useNNTrustStore from '@/store/nnTrustStore'
import { ArrowDownUp, Search } from 'lucide-react';

const TaskManagement: React.FC = () => {
    const attackList: Set<string> = useNNTrustStore((state) => state.attacks)

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [priorityFilter, setPriorityFilter] = useState('All');
    const [sortConfig, setSortConfig] = useState<{ key: string | null, direction: 'asc' | 'desc' }>({ key: null, direction: 'asc' });

    // Convert Set to Array
    const attackArray = Array.from(attackList);

    const handleSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const filteredAndSortedJobs = useMemo(() => {
        let filtered = attackArray.filter(job => {
            const matchesSearch = job.toLowerCase().includes(searchTerm.toLowerCase());
            // Since attackArray is just strings, we can't filter by status/priority
            return matchesSearch;
        });

        if (sortConfig.key) {
            filtered.sort((a, b) => {
                if (a < b) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a > b) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }

        return filtered;
    }, [attackArray, searchTerm, sortConfig]);

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
                        onChange={(e) => setSearchTerm(e.target.value)} />
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
                <select
                    id="priorityFilter"
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                >
                    <option value="All">All Priorities</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                </select>
            </div>
            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>
                                <button onClick={() => handleSort('id')}> ID <ArrowDownUp /> </button>
                            </th>
                            <th>
                                <button onClick={() => handleSort('name')}> Job Name <ArrowDownUp /> </button>
                            </th>
                            <th>
                                <button onClick={() => handleSort('status')}> Status <ArrowDownUp /> </button>
                            </th>
                            <th>Progress</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredAndSortedJobs.map((job, index) => (
                            <tr key={`${job}-${index}`} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{job}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100">
                                        Status
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">Progress info</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
}

export default TaskManagement