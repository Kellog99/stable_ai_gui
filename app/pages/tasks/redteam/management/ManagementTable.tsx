import { AttackManagementProps } from '@/interfaces/NNInterfaces';
import { Progress } from '@mantine/core';
import { ArrowDownUp, Search } from 'lucide-react';
import React, { useMemo, useState, useEffect } from 'react';
import './ManagementTable.css';
import useNNTrustStore from '@/store/nnTrustStore';
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

    const handleSort = (key: keyof AttackManagementProps) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const filteredAndSortedJobs = useMemo(() => {
        const normalize = (value: any) => String(value ?? '').toLowerCase();

        const filtered = jobs.filter(({ id, name, status }) => {
            const term = searchTerm.toLowerCase();
            const matchesSearch =
                normalize(id).includes(term) ||
                normalize(name).includes(term) ||
                normalize(status).includes(term);

            const matchesStatus = statusFilter === 'All' || status === statusFilter;
            return matchesSearch && matchesStatus;
        });

        if (!sortConfig.key) {
            return filtered;
        }
        else {
            const { key, direction } = sortConfig;
            const multiplier = direction === 'asc' ? 1 : -1;

            return [...filtered].sort((a, b) => {
                const aValue = a[key];
                const bValue = b[key];

                const aNum = Number(aValue);
                const bNum = Number(bValue);
                if (key === 'id' && !isNaN(aNum) && !isNaN(bNum)) {
                    return (aNum - bNum) * multiplier;
                }

                return normalize(aValue).localeCompare(normalize(bValue)) * multiplier;
            });
        }
    }, [jobs, searchTerm, statusFilter, sortConfig]);

    const { setExecutedAttacks } = useNNTrustStore()

    const handleRefresh = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/attacks/benchmarkStatus');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`); // Fixed: parentheses, not backtick
            }
            const data = await response.json(); // Parse the response
            console.log("management ==", data)
            setExecutedAttacks(data)
        } catch (error) {
            console.error('ERROR:', error);
            return []; // Return empty array on error
        }
    }

    useEffect(() => {
        const timer = setInterval(handleRefresh, 6000);
        return () => clearInterval(timer);
    }, []);

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
                                return <option value={status}>{status}</option>
                            })
                            }
                        </select>
                    </div>
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
                                        Attack Name <ArrowDownUp />
                                    </button>
                                </th>
                                <th>
                                    <button onClick={() => handleSort('status')}>
                                        Status & Progress <ArrowDownUp />
                                    </button>
                                </th>
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